import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Supplier, Institution, Material, Request } from './data-context'
import { maskCNPJ, maskPhone } from './utils'

export function exportSuppliersToExcel(suppliers: Supplier[]) {
  const data = suppliers.map(supplier => ({
    'Nome': supplier.name,
    'CNPJ': maskCNPJ(supplier.cnpj),
    'Telefone': supplier.phone ? maskPhone(supplier.phone) : '-',
    'Cidade': supplier.city,
    'Estado': supplier.state || '-',
    'Status': supplier.status === 'active' ? 'Ativo' : 'Inativo',
    'Data de Cadastro': new Date(supplier.createdAt).toLocaleDateString('pt-BR')
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Fornecedores')

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 30 }, // Nome
    { wch: 18 }, // CNPJ
    { wch: 15 }, // Telefone
    { wch: 20 }, // Cidade
    { wch: 8 },  // Estado
    { wch: 10 }, // Status
    { wch: 15 }  // Data
  ]
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `fornecedores_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function exportSuppliersToPDF(suppliers: Supplier[]) {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  // Título
  doc.setFontSize(18)
  doc.text('Relatório de Fornecedores - CEDIME', 14, 15)
  
  // Data de geração
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 22)
  
  // Tabela
  const tableData = suppliers.map(supplier => [
    supplier.name,
    maskCNPJ(supplier.cnpj),
    supplier.phone ? maskPhone(supplier.phone) : '-',
    supplier.city,
    supplier.state || '-',
    supplier.status === 'active' ? 'Ativo' : 'Inativo'
  ])

  autoTable(doc, {
    head: [['Nome', 'CNPJ', 'Telefone', 'Cidade', 'Estado', 'Status']],
    body: tableData,
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: 28, left: 14, right: 14 }
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`fornecedores_${new Date().toISOString().split('T')[0]}.pdf`)
}

export function exportInstitutionsToExcel(institutions: Institution[]) {
  const data = institutions.map(institution => ({
    'Nome': institution.name,
    'Telefone': institution.phone ? maskPhone(institution.phone) : '-',
    'Cidade': institution.city,
    'Estado': institution.state || '-',
    'Responsável': institution.principalName,
    'Status': institution.status === 'active' ? 'Ativo' : 'Inativo',
    'Data de Cadastro': new Date(institution.createdAt).toLocaleDateString('pt-BR')
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Instituições')

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 35 }, // Nome
    { wch: 15 }, // Telefone
    { wch: 20 }, // Cidade
    { wch: 8 },  // Estado
    { wch: 20 }, // Responsável
    { wch: 10 }, // Status
    { wch: 15 }  // Data
  ]
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `instituicoes_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function exportInstitutionsToPDF(institutions: Institution[]) {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  // Título
  doc.setFontSize(18)
  doc.text('Relatório de Instituições - CEDIME', 14, 15)
  
  // Data de geração
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 22)
  
  // Tabela
  const tableData = institutions.map(institution => [
    institution.name,
    institution.phone ? maskPhone(institution.phone) : '-',
    institution.city,
    institution.state || '-',
    institution.principalName,
    institution.status === 'active' ? 'Ativo' : 'Inativo'
  ])

  autoTable(doc, {
    head: [['Nome', 'Telefone', 'Cidade', 'Estado', 'Responsável', 'Status']],
    body: tableData,
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: 28, left: 14, right: 14 }
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`instituicoes_${new Date().toISOString().split('T')[0]}.pdf`)
}

export function exportMaterialsToExcel(materials: Material[]) {
  const getCategoryLabel = (category: string) => {
    // Retorna o próprio nome da categoria (todas são customizadas)
    return category
  }

  const data = materials.map(material => ({
    'Nome': material.name,
    'Categoria': getCategoryLabel(material.category),
    'Estoque': material.quantity,
    'Unidade': material.unit,
    'Estoque Mínimo': material.minQuantity,
    'Valor Unitário': material.unitPrice.toFixed(2),
    'Valor Total': (material.quantity * material.unitPrice).toFixed(2),
    'Status': material.quantity <= material.minQuantity ? 'Estoque Baixo' : 'Normal',
    'Última Atualização': new Date(material.lastUpdate).toLocaleDateString('pt-BR')
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Materiais')

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 30 }, // Nome
    { wch: 20 }, // Categoria
    { wch: 12 }, // Estoque
    { wch: 12 }, // Unidade
    { wch: 15 }, // Estoque Mínimo
    { wch: 12 }, // Valor Unit.
    { wch: 12 }, // Valor Total
    { wch: 15 }, // Status
    { wch: 18 }  // Última Atualização
  ]
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `materiais_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function exportMaterialsToPDF(materials: Material[]) {
  const getCategoryLabel = (category: string) => {
    // Retorna o próprio nome da categoria (todas são customizadas)
    return category
  }

  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  // Título
  doc.setFontSize(18)
  doc.text('Relatório de Materiais - CEDIME', 14, 15)
  
  // Data de geração
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 22)
  
  // Tabela
  const tableData = materials.map(material => [
    material.name,
    getCategoryLabel(material.category),
    `${material.quantity} ${material.unit}`,
    `${material.minQuantity} ${material.unit}`,
    `R$ ${material.unitPrice.toFixed(2)}`,
    material.quantity <= material.minQuantity ? 'Baixo' : 'Normal'
  ])

  autoTable(doc, {
    head: [['Nome', 'Categoria', 'Estoque', 'Mínimo', 'Valor Unit.', 'Status']],
    body: tableData,
    startY: 28,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: 28, left: 14, right: 14 }
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`materiais_${new Date().toISOString().split('T')[0]}.pdf`)
}

export async function generateRequestReceipt(request: Request, institutionName: string) {
  const doc = new jsPDF('portrait', 'mm', 'a4')
  
  // Logo (tentar carregar usando fetch)
  let logoData: string | null = null
  try {
    const logoPath = '/Inserir um título (800 x 400 px).png'
    const response = await fetch(logoPath)
    if (response.ok) {
      const blob = await response.blob()
      logoData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    }
  } catch (e) {
    // Se não conseguir carregar logo, continua sem ela
    console.log('Logo não carregado, continuando sem logo')
  }
  
  // Título
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('CANHOTO DE ENTREGA', 105, logoData ? 35 : 30, { align: 'center' })
  
  // Adicionar logo se disponível
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', 15, 10, 40, 20)
    } catch (e) {
      // Ignora erro de imagem
    }
  }
  
  // Informações da requisição
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  let yPos = logoData ? 55 : 50
  
  doc.text(`Número da Requisição: ${request.requestNumber}`, 15, yPos)
  yPos += 8
  doc.text(`Instituição: ${institutionName}`, 15, yPos)
  yPos += 8
  doc.text(`Data Necessária: ${new Date(request.requiredDate).toLocaleDateString('pt-BR')}`, 15, yPos)
  yPos += 8
  doc.text(`Data de Emissão: ${new Date(request.createdAt).toLocaleDateString('pt-BR')}`, 15, yPos)
  yPos += 8
  doc.text(`Status: ${request.status === 'pending' ? 'Pendente' : request.status === 'approved' ? 'Aprovada' : request.status === 'delivered' ? 'Entregue' : 'Cancelada'}`, 15, yPos)
  yPos += 15
  
  // Tabela de produtos
  const tableData = request.items.map(item => [
    item.materialName,
    item.quantity.toString()
  ])
  
  autoTable(doc, {
    head: [['Produto', 'Quantidade']],
    body: tableData,
    startY: yPos,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: yPos, left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 150 },
      1: { cellWidth: 30, halign: 'center' }
    }
  })
  
  // Total removido - apenas posicionamento para assinaturas
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 50
  
  // Linha de assinatura
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('_________________________________', 15, finalY + 35)
  doc.text('Assinatura do Responsável', 15, finalY + 40)
  
  doc.text('_________________________________', 120, finalY + 35)
  doc.text('Assinatura do Recebedor', 120, finalY + 40)
  
  // Rodapé
  doc.setFontSize(8)
  doc.text(
    `CEDIME - Centro de Distribuição de Material Escolar`,
    doc.internal.pageSize.getWidth() / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  )
  
  doc.save(`canhoto_${request.requestNumber}_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Funções de exportação para páginas de despesas

interface ExpenseData {
  [key: string]: {
    [month: number]: number
  }
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function exportExpensesBySuppliersToExcel(
  suppliers: { id: string; name: string }[],
  expensesBySupplier: ExpenseData
) {
  const data = suppliers.map(supplier => {
    const row: Record<string, string> = {
      'Fornecedor': supplier.name,
    }
    
    months.forEach((month, index) => {
      const value = expensesBySupplier[supplier.id]?.[index] || 0
      row[month] = formatCurrency(value)
    })
    
    const total = Object.values(expensesBySupplier[supplier.id] || {}).reduce((sum, val) => sum + val, 0)
    row['Total'] = formatCurrency(total)
    
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Despesas por Fornecedor')

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 30 }, // Fornecedor
    ...months.map(() => ({ wch: 12 })), // Meses
    { wch: 15 }  // Total
  ]
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `despesas_fornecedores_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function exportExpensesBySuppliersToPDF(
  suppliers: { id: string; name: string }[],
  expensesBySupplier: ExpenseData
) {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  // Título
  doc.setFontSize(18)
  doc.text('Despesas por Fornecedor - CEDIME', 14, 15)
  
  // Data de geração
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 22)
  
  // Tabela
  const tableData = suppliers.map(supplier => {
    const row = [supplier.name]
    
    months.forEach((month, index) => {
      const value = expensesBySupplier[supplier.id]?.[index] || 0
      row.push(formatCurrency(value))
    })
    
    const total = Object.values(expensesBySupplier[supplier.id] || {}).reduce((sum, val) => sum + val, 0)
    row.push(formatCurrency(total))
    
    return row
  })

  const headers = ['Fornecedor', ...months, 'Total']

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 28,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: 28, left: 14, right: 14 }
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`despesas_fornecedores_${new Date().toISOString().split('T')[0]}.pdf`)
}

export function exportExpensesByInstitutionsToExcel(
  institutions: { id: string; name: string }[],
  expensesByInstitution: ExpenseData
) {
  const data = institutions.map(institution => {
    const row: Record<string, string> = {
      'Instituição': institution.name,
    }
    
    months.forEach((month, index) => {
      const value = expensesByInstitution[institution.id]?.[index] || 0
      row[month] = formatCurrency(value)
    })
    
    const total = Object.values(expensesByInstitution[institution.id] || {}).reduce((sum, val) => sum + val, 0)
    row['Total'] = formatCurrency(total)
    
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Despesas por Instituição')

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 30 }, // Instituição
    ...months.map(() => ({ wch: 12 })), // Meses
    { wch: 15 }  // Total
  ]
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `despesas_instituicoes_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function exportExpensesByInstitutionsToPDF(
  institutions: { id: string; name: string }[],
  expensesByInstitution: ExpenseData
) {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  // Título
  doc.setFontSize(18)
  doc.text('Despesas por Instituição - CEDIME', 14, 15)
  
  // Data de geração
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 22)
  
  // Tabela
  const tableData = institutions.map(institution => {
    const row = [institution.name]
    
    months.forEach((month, index) => {
      const value = expensesByInstitution[institution.id]?.[index] || 0
      row.push(formatCurrency(value))
    })
    
    const total = Object.values(expensesByInstitution[institution.id] || {}).reduce((sum, val) => sum + val, 0)
    row.push(formatCurrency(total))
    
    return row
  })

  const headers = ['Instituição', ...months, 'Total']

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 28,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: 28, left: 14, right: 14 }
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`despesas_instituicoes_${new Date().toISOString().split('T')[0]}.pdf`)
}

export function exportExpensesByProductsToExcel(
  materials: { id: string; name: string }[],
  expensesByMaterial: ExpenseData,
  quantitiesByMaterial?: ExpenseData,
  viewMode: 'values' | 'quantities' | 'complete' = 'values',
  selectedInstitutionName?: string
) {
  const formatQuantity = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const data = materials.map(material => {
    const row: Record<string, string> = {
      'Produto': material.name,
    }
    
    if (viewMode === 'complete') {
      months.forEach((month, index) => {
        const qty = quantitiesByMaterial?.[material.id]?.[index] || 0
        const value = expensesByMaterial[material.id]?.[index] || 0
        row[`${month} - Qtd`] = formatQuantity(qty)
        row[`${month} - Valor`] = formatCurrency(value)
      })
      
      const totalQty = quantitiesByMaterial 
        ? Object.values(quantitiesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
        : 0
      const totalValue = Object.values(expensesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
      row['Total - Qtd'] = formatQuantity(totalQty)
      row['Total - Valor'] = formatCurrency(totalValue)
    } else if (viewMode === 'quantities') {
      months.forEach((month, index) => {
        const qty = quantitiesByMaterial?.[material.id]?.[index] || 0
        row[month] = formatQuantity(qty)
      })
      
      const total = quantitiesByMaterial
        ? Object.values(quantitiesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
        : 0
      row['Total'] = formatQuantity(total)
    } else {
      months.forEach((month, index) => {
        const value = expensesByMaterial[material.id]?.[index] || 0
        row[month] = formatCurrency(value)
      })
      
      const total = Object.values(expensesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
      row['Total'] = formatCurrency(total)
    }
    
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  
  // Adicionar informações de filtro e modo se houver
  const infoRows: string[][] = []
  if (selectedInstitutionName) {
    infoRows.push(['Filtro: Instituição - ' + selectedInstitutionName])
  }
  const modeLabel = viewMode === 'values' ? 'Valores' : viewMode === 'quantities' ? 'Quantidades' : 'Completo'
  infoRows.push(['Modo de visualização: ' + modeLabel])
  
  if (infoRows.length > 0) {
    XLSX.utils.sheet_add_aoa(worksheet, infoRows, { origin: -1 })
  }
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Despesas por Produto')

  // Ajustar largura das colunas
  const colWidths = viewMode === 'complete'
    ? [
        { wch: 30 }, // Produto
        ...months.flatMap(() => [{ wch: 12 }, { wch: 12 }]), // Qtd e Valor para cada mês
        { wch: 12 }, // Total Qtd
        { wch: 12 }  // Total Valor
      ]
    : [
        { wch: 30 }, // Produto
        ...months.map(() => ({ wch: 12 })), // Meses
        { wch: 15 }  // Total
      ]
  worksheet['!cols'] = colWidths

  const fileName = selectedInstitutionName
    ? `despesas_produtos_${selectedInstitutionName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
    : `despesas_produtos_${new Date().toISOString().split('T')[0]}.xlsx`

  XLSX.writeFile(workbook, fileName)
}

export function exportExpensesByProductsToPDF(
  materials: { id: string; name: string }[],
  expensesByMaterial: ExpenseData,
  quantitiesByMaterial?: ExpenseData,
  viewMode: 'values' | 'quantities' | 'complete' = 'values',
  selectedInstitutionName?: string
) {
  const formatQuantity = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  // Título
  doc.setFontSize(18)
  doc.text('Despesas por Produto - CEDIME', 14, 15)
  
  // Informações de filtro e modo
  let yPos = 22
  doc.setFontSize(10)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, yPos)
  
  if (selectedInstitutionName) {
    yPos += 5
    doc.text(`Filtro: Instituição - ${selectedInstitutionName}`, 14, yPos)
  }
  
  yPos += 5
  const modeLabel = viewMode === 'values' ? 'Valores' : viewMode === 'quantities' ? 'Quantidades' : 'Completo'
  doc.text(`Modo de visualização: ${modeLabel}`, 14, yPos)
  
  // Tabela
  let headers: string[]
  let tableData: (string | number)[][]

  if (viewMode === 'complete') {
    headers = ['Produto', ...months.flatMap(month => [`${month} - Qtd`, `${month} - Valor`]), 'Total - Qtd', 'Total - Valor']
    tableData = materials.map(material => {
      const row: (string | number)[] = [material.name]
      
      months.forEach((month, index) => {
        const qty = quantitiesByMaterial?.[material.id]?.[index] || 0
        const value = expensesByMaterial[material.id]?.[index] || 0
        row.push(formatQuantity(qty))
        row.push(formatCurrency(value))
      })
      
      const totalQty = quantitiesByMaterial
        ? Object.values(quantitiesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
        : 0
      const totalValue = Object.values(expensesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
      row.push(formatQuantity(totalQty))
      row.push(formatCurrency(totalValue))
      
      return row
    })
  } else if (viewMode === 'quantities') {
    headers = ['Produto', ...months, 'Total']
    tableData = materials.map(material => {
      const row: (string | number)[] = [material.name]
      
      months.forEach((month, index) => {
        const qty = quantitiesByMaterial?.[material.id]?.[index] || 0
        row.push(formatQuantity(qty))
      })
      
      const total = quantitiesByMaterial
        ? Object.values(quantitiesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
        : 0
      row.push(formatQuantity(total))
      
      return row
    })
  } else {
    headers = ['Produto', ...months, 'Total']
    tableData = materials.map(material => {
      const row: (string | number)[] = [material.name]
      
      months.forEach((month, index) => {
        const value = expensesByMaterial[material.id]?.[index] || 0
        row.push(formatCurrency(value))
      })
      
      const total = Object.values(expensesByMaterial[material.id] || {}).reduce((sum, val) => sum + val, 0)
      row.push(formatCurrency(total))
      
      return row
    })
  }

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: yPos + 5,
    styles: { fontSize: viewMode === 'complete' ? 6 : 7 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: yPos + 5, left: 14, right: 14 }
  })

  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  const fileName = selectedInstitutionName
    ? `despesas_produtos_${selectedInstitutionName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    : `despesas_produtos_${new Date().toISOString().split('T')[0]}.pdf`

  doc.save(fileName)
}

