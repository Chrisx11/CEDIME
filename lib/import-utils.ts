import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/client'

// Mapeamento de abreviações para unidades completas
const unitMapping: Record<string, string> = {
  'cx': 'caixa',
  'caixa': 'caixa',
  'pct': 'pacote',
  'pacote': 'pacote',
  'kg': 'kg',
  'quilograma': 'kg',
  'unidade': 'unidade',
  'un': 'unidade',
  'und': 'unidade',
  'litro': 'litro',
  'l': 'litro',
  'ml': 'mililitro',
  'mililitro': 'mililitro',
  'g': 'grama',
  'grama': 'grama',
  'm': 'metro',
  'metro': 'metro',
  'cm': 'centimetro',
  'centimetro': 'centimetro',
  'm²': 'metro quadrado',
  'metro quadrado': 'metro quadrado',
  'm³': 'metro cubico',
  'metro cubico': 'metro cubico',
}

interface ExcelMaterialRow {
  Nome: string
  Categoria: string
  Estoque: number | null
  unidade?: string
  Unidade?: string
  'Estoque Mínimo': number
  'Valor Unitário'?: number
  ' Valor Unitário '?: number
  'Valor Total'?: number
  ' Valor Total '?: number
  Status?: string
  'Última Atualização'?: string
}

export interface ImportResult {
  success: number
  errors: number
  notFound: string[]
  createdUnits: string[]
  errorsList: Array<{ material: string; error: string }>
}

/**
 * Normaliza o nome da unidade (remove espaços, converte para minúsculas)
 * e mapeia abreviações para nomes completos
 */
function normalizeUnit(unit: string): string {
  if (!unit) return 'unidade'
  
  const trimmed = unit.trim().toLowerCase()
  
  // Verificar se já existe no mapeamento
  if (unitMapping[trimmed]) {
    return unitMapping[trimmed]
  }
  
  // Se não estiver no mapeamento, retornar a unidade normalizada
  return trimmed
}

/**
 * Lê um arquivo Excel e retorna os dados
 */
export function readExcelFile(file: File): Promise<ExcelMaterialRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('Não foi possível ler o arquivo'))
          return
        }
        
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<ExcelMaterialRow>(worksheet, { defval: null })
        
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'))
    }
    
    reader.readAsBinaryString(file)
  })
}

/**
 * Importa materiais do Excel, atualizando estoque, preço e unidades
 */
export async function importMaterialsFromExcel(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<ImportResult> {
  const supabase = createClient()
  const result: ImportResult = {
    success: 0,
    errors: 0,
    notFound: [],
    createdUnits: [],
    errorsList: []
  }

  try {
    // Ler o arquivo Excel
    onProgress?.(0, 'Lendo arquivo Excel...')
    const excelData = await readExcelFile(file)
    
    if (excelData.length === 0) {
      throw new Error('O arquivo Excel está vazio')
    }

    // Buscar todas as unidades existentes
    onProgress?.(10, 'Buscando unidades existentes...')
    const { data: existingUnits, error: unitsError } = await supabase
      .from('units')
      .select('name')
    
    if (unitsError) {
      throw new Error(`Erro ao buscar unidades: ${unitsError.message}`)
    }

    const existingUnitsSet = new Set(
      (existingUnits || []).map(u => u.name.toLowerCase())
    )

    // Processar cada linha do Excel
    const totalRows = excelData.length
    let processedRows = 0

    for (const row of excelData) {
      try {
        // Debug: logar as chaves disponíveis na primeira linha para verificar nomes das colunas
        if (processedRows === 0) {
          console.log('🔍 Chaves disponíveis na primeira linha do Excel:', Object.keys(row))
        }
        
        const materialName = row.Nome?.trim()
        if (!materialName) {
          result.errors++
          result.errorsList.push({
            material: 'Nome não informado',
            error: 'Linha sem nome de material'
          })
          continue
        }

        // Buscar o material pelo nome (case-insensitive)
        const { data: materials, error: materialError } = await supabase
          .from('materials')
          .select('id, name, unit')
          .ilike('name', materialName)
          .limit(1)

        if (materialError) {
          result.errors++
          result.errorsList.push({
            material: materialName,
            error: `Erro ao buscar material: ${materialError.message}`
          })
          continue
        }

        if (!materials || materials.length === 0) {
          result.notFound.push(materialName)
          continue
        }

        const material = materials[0]

        // Normalizar e verificar/criar unidade
        const unitFromRow = row.unidade || row.Unidade || 'unidade'
        const normalizedUnit = normalizeUnit(unitFromRow)
        
        if (!existingUnitsSet.has(normalizedUnit)) {
          // Criar a unidade
          const { error: createUnitError } = await supabase
            .from('units')
            .insert([{ name: normalizedUnit }])

          if (createUnitError) {
            result.errors++
            result.errorsList.push({
              material: materialName,
              error: `Erro ao criar unidade "${normalizedUnit}": ${createUnitError.message}`
            })
            continue
          }

          existingUnitsSet.add(normalizedUnit)
          result.createdUnits.push(normalizedUnit)
        }

        // Preparar dados para atualização
        const quantity = row.Estoque !== null && row.Estoque !== undefined 
          ? Number(row.Estoque) 
          : 0
        
        const minQuantity = row['Estoque Mínimo'] !== null && row['Estoque Mínimo'] !== undefined
          ? Number(row['Estoque Mínimo'])
          : 0
        
        // Tentar ler o valor unitário de diferentes variações do nome da coluna
        // O Excel pode retornar com ou sem espaços nas extremidades
        let unitPrice: number | null = null
        
        // Tentar diferentes variações do nome da coluna
        const priceValue = row['Valor Unitário'] ?? row[' Valor Unitário '] ?? null
        
        if (priceValue !== null && priceValue !== undefined) {
          const parsedPrice = Number(priceValue)
          if (!isNaN(parsedPrice)) {
            unitPrice = parsedPrice
            console.log(`💰 Valor unitário lido do Excel para ${materialName}: ${unitPrice}`)
          }
        }
        
        // Se o valor unitário não foi encontrado no Excel, buscar o valor atual do material
        if (unitPrice === null) {
          const { data: currentMaterialForPrice } = await supabase
            .from('materials')
            .select('unit_price')
            .eq('id', material.id)
            .single()
          
          if (currentMaterialForPrice?.unit_price !== null && currentMaterialForPrice?.unit_price !== undefined) {
            unitPrice = currentMaterialForPrice.unit_price
            console.log(`💰 Usando valor unitário atual do material ${materialName}: ${unitPrice}`)
          } else {
            unitPrice = 0
            console.warn(`⚠️ Valor unitário não encontrado para ${materialName}, usando 0`)
          }
        }
        
        // Garantir que unitPrice seja um número válido (não negativo)
        const finalUnitPrice = Math.max(0, unitPrice || 0)

        // Buscar estoque atual do material para calcular a diferença
        const { data: currentMaterial } = await supabase
          .from('materials')
          .select('quantity, unit_price')
          .eq('id', material.id)
          .single()

        const currentQuantity = currentMaterial?.quantity || 0
        const newQuantity = Math.max(0, quantity)
        const quantityDifference = newQuantity - currentQuantity

        // Atualizar o material
        const { error: updateError } = await supabase
          .from('materials')
          .update({
            quantity: newQuantity,
            min_quantity: Math.max(0, minQuantity),
            unit_price: finalUnitPrice,
            unit: normalizedUnit,
            last_update: new Date().toISOString()
          })
          .eq('id', material.id)

        if (updateError) {
          result.errors++
          result.errorsList.push({
            material: materialName,
            error: `Erro ao atualizar: ${updateError.message}`
          })
        } else {
          result.success++
          
          // Se o estoque final for maior que 0, criar entrada automaticamente
          // Se a quantidade aumentou, usar a diferença. Se não, usar a quantidade total
          if (newQuantity > 0) {
            try {
              const entryQuantity = quantityDifference > 0 ? quantityDifference : newQuantity
              // Usar o valor unitário importado (finalUnitPrice), ou o valor atual do material se não houver
              const entryPrice = finalUnitPrice > 0 ? finalUnitPrice : (currentMaterial?.unit_price || 0)
              const entryDate = new Date().toISOString().split('T')[0]
              
              console.log(`📦 Criando entrada para ${materialName}: quantidade=${entryQuantity}, preço=${entryPrice}`)
              
              const { error: entryError } = await supabase
                .from('entries')
                .insert([{
                  material_id: material.id,
                  material_name: material.name,
                  quantity: entryQuantity,
                  unit: normalizedUnit,
                  unit_price: entryPrice,
                  supplier_id: null,
                  supplier_name: null,
                  reason: 'Importação de estoque',
                  responsible: 'Sistema',
                  entry_date: entryDate
                }])

              if (entryError) {
                console.error('Erro ao criar entrada automaticamente:', entryError)
                // Não contar como erro principal, apenas logar
              } else {
                console.log(`✅ Entrada criada automaticamente para ${materialName}: ${entryQuantity} ${normalizedUnit}`)
                // Disparar evento para atualizar a página de entradas
                window.dispatchEvent(new CustomEvent('entriesUpdated'))
              }
            } catch (entryError) {
              console.error('Erro ao criar entrada:', entryError)
              // Não contar como erro principal
            }
          }
        }

        processedRows++
        const progress = 10 + Math.floor((processedRows / totalRows) * 90)
        onProgress?.(progress, `Processando ${processedRows}/${totalRows} materiais...`)

      } catch (error) {
        result.errors++
        result.errorsList.push({
          material: row.Nome || 'Desconhecido',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    onProgress?.(100, 'Importação concluída!')
    return result

  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Erro desconhecido ao importar'
    )
  }
}

interface ExcelEntryRow {
  Material: string
  Quantidade: number | string
  Unidade?: string
  'Preço Unitário': number | string
  'Valor Total'?: number | string
  Fornecedor?: string
  Responsável: string
  'Data de Entrada': string
}

/**
 * Lê um arquivo Excel de entradas e retorna os dados
 */
export function readEntriesExcelFile(file: File): Promise<ExcelEntryRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('Não foi possível ler o arquivo'))
          return
        }
        
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<ExcelEntryRow>(worksheet, { defval: null })
        
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'))
    }
    
    reader.readAsBinaryString(file)
  })
}

/**
 * Importa entradas do Excel, criando entradas automaticamente
 */
export async function importEntriesFromExcel(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<ImportResult> {
  const supabase = createClient()
  const result: ImportResult = {
    success: 0,
    errors: 0,
    notFound: [],
    createdUnits: [],
    errorsList: []
  }

  try {
    // Ler o arquivo Excel
    onProgress?.(0, 'Lendo arquivo Excel...')
    const excelData = await readEntriesExcelFile(file)
    
    if (excelData.length === 0) {
      throw new Error('O arquivo Excel está vazio')
    }

    // Processar cada linha do Excel
    const totalRows = excelData.length
    let processedRows = 0

    for (const row of excelData) {
      try {
        const materialName = row.Material?.trim()
        if (!materialName) {
          result.errors++
          result.errorsList.push({
            material: 'Material não informado',
            error: 'Linha sem nome de material'
          })
          continue
        }

        // Normalizar o nome do material (remover espaços extras, normalizar)
        const normalizedName = materialName.replace(/\s+/g, ' ').trim().toLowerCase()
        
        // Função para normalizar strings para comparação (remove acentos, espaços extras, etc)
        const normalizeForComparison = (str: string) => {
          return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/\s+/g, ' ') // Normaliza espaços
            .trim()
        }

        // Buscar o material pelo nome - tentar múltiplas estratégias
        let materials: any[] | null = null
        let materialError: any = null

        // Estratégia 1: Busca exata com ilike
        let { data: exactMatch, error: exactError } = await supabase
          .from('materials')
          .select('id, name, unit, unit_price')
          .ilike('name', materialName.trim())
          .limit(1)

        if (exactMatch && exactMatch.length > 0) {
          materials = exactMatch
        } else {
          // Estratégia 2: Busca com LIKE usando % no início e fim
          const { data: likeMatch, error: likeError } = await supabase
            .from('materials')
            .select('id, name, unit, unit_price')
            .ilike('name', `%${materialName.trim()}%`)
            .limit(10)

          if (likeMatch && likeMatch.length > 0) {
            // Encontrar o match mais próximo usando comparação normalizada
            const normalizedSearch = normalizeForComparison(materialName)
            const bestMatch = likeMatch.find(m => {
              const normalizedMaterial = normalizeForComparison(m.name)
              return normalizedMaterial === normalizedSearch ||
                     normalizedMaterial.startsWith(normalizedSearch) ||
                     normalizedSearch.startsWith(normalizedMaterial)
            }) || likeMatch.find(m => {
              // Busca parcial mais flexível
              const normalizedMaterial = normalizeForComparison(m.name)
              return normalizedMaterial.includes(normalizedSearch) ||
                     normalizedSearch.includes(normalizedMaterial)
            }) || likeMatch[0]
            
            materials = [bestMatch]
          } else {
            materialError = likeError || exactError
          }
        }

        if (materialError) {
          result.errors++
          result.errorsList.push({
            material: materialName,
            error: `Erro ao buscar material: ${materialError.message}`
          })
          continue
        }

        if (!materials || materials.length === 0) {
          result.notFound.push(materialName)
          continue
        }

        const material = materials[0]
        
        // Log para debug (pode remover depois)
        if (material.name.toLowerCase().trim() !== normalizedName.toLowerCase()) {
          console.log(`Material encontrado com nome diferente: "${material.name}" (buscado: "${materialName}")`)
        }

        // Obter quantidade
        const quantity = row.Quantidade !== null && row.Quantidade !== undefined
          ? Number(row.Quantidade)
          : 0

        // Ignorar produtos com quantidade zero ou negativa (não gerar entrada)
        if (quantity <= 0) {
          // Não contar como erro, apenas pular esta linha
          console.log(`⏭️ Ignorando ${materialName} - quantidade zero (${quantity})`)
          processedRows++
          const progress = Math.floor((processedRows / totalRows) * 100)
          onProgress?.(progress, `Processando ${processedRows}/${totalRows} entradas... (ignorando ${materialName} - quantidade zero)`)
          continue
        }

        // Obter preço unitário - usar o valor do Excel ou o preço médio do material
        let unitPrice = 0
        if (row['Preço Unitário'] !== null && row['Preço Unitário'] !== undefined && row['Preço Unitário'] !== '') {
          const priceValue = Number(row['Preço Unitário'])
          if (!isNaN(priceValue) && priceValue > 0) {
            unitPrice = priceValue
          } else if (material.unit_price && material.unit_price > 0) {
            // Usar preço médio do material se o valor do Excel for inválido
            unitPrice = material.unit_price
          }
        } else if (material.unit_price && material.unit_price > 0) {
          // Usar preço médio do material se não fornecido
          unitPrice = material.unit_price
        }
        // Se ainda for 0, permite criar a entrada com preço 0 (será atualizado pelo sistema)

        // Buscar fornecedor se informado
        let supplierId: string | undefined = undefined
        let supplierName: string | undefined = undefined
        
        if (row.Fornecedor && row.Fornecedor.trim()) {
          const { data: suppliers } = await supabase
            .from('suppliers')
            .select('id, name')
            .ilike('name', row.Fornecedor.trim())
            .limit(1)
          
          if (suppliers && suppliers.length > 0) {
            supplierId = suppliers[0].id
            supplierName = suppliers[0].name
          }
        }

        // Obter responsável
        const responsible = row.Responsável?.trim() || 'Sistema'

        // Obter data de entrada
        let entryDate = row['Data de Entrada']
        if (!entryDate) {
          entryDate = new Date().toISOString().split('T')[0]
        } else {
          // Tentar converter a data para formato YYYY-MM-DD
          try {
            const date = new Date(entryDate)
            if (isNaN(date.getTime())) {
              entryDate = new Date().toISOString().split('T')[0]
            } else {
              entryDate = date.toISOString().split('T')[0]
            }
          } catch {
            entryDate = new Date().toISOString().split('T')[0]
          }
        }

        // Criar a entrada
        const entryData = {
          material_id: material.id,
          material_name: material.name,
          quantity: quantity,
          unit: material.unit,
          unit_price: unitPrice,
          supplier_id: supplierId || null,
          supplier_name: supplierName || null,
          reason: '',
          responsible: responsible,
          entry_date: entryDate
        }

        const { data: insertedEntry, error: insertError } = await supabase
          .from('entries')
          .insert([entryData])
          .select()

        if (insertError) {
          console.error('Erro ao criar entrada:', insertError, entryData)
          result.errors++
          result.errorsList.push({
            material: materialName,
            error: `Erro ao criar entrada: ${insertError.message}`
          })
        } else {
          console.log('✅ Entrada criada com sucesso:', insertedEntry)
          console.log('Material:', materialName, 'Quantidade:', quantity)
          result.success++
        }

        processedRows++
        const progress = Math.floor((processedRows / totalRows) * 100)
        onProgress?.(progress, `Processando ${processedRows}/${totalRows} entradas...`)

      } catch (error) {
        result.errors++
        result.errorsList.push({
          material: row.Material || 'Desconhecido',
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    onProgress?.(100, 'Importação concluída!')
    console.log('📊 Resultado final da importação de entradas:', {
      success: result.success,
      errors: result.errors,
      notFound: result.notFound.length
    })
    return result

  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Erro desconhecido ao importar'
    )
  }
}

