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
  unidade: string
  'Estoque Mínimo': number
  ' Valor Unitário ': number
  ' Valor Total ': number
  Status: string
  'Última Atualização': string
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
        const normalizedUnit = normalizeUnit(row.unidade || 'unidade')
        
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
        
        const unitPrice = row[' Valor Unitário '] !== null && row[' Valor Unitário '] !== undefined
          ? Number(row[' Valor Unitário '])
          : 0

        // Atualizar o material
        const { error: updateError } = await supabase
          .from('materials')
          .update({
            quantity: Math.max(0, quantity),
            min_quantity: Math.max(0, minQuantity),
            unit_price: Math.max(0, unitPrice),
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

