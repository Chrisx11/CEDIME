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
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      school: 'Escola',
      center: 'Centro Educacional',
      other: 'Outro'
    }
    return types[type] || type
  }

  const data = institutions.map(institution => ({
    'Nome': institution.name,
    'CNPJ': maskCNPJ(institution.cnpj),
    'Telefone': institution.phone ? maskPhone(institution.phone) : '-',
    'Email': institution.email || '-',
    'Endereço': institution.address || '-',
    'Cidade': institution.city,
    'Diretor': institution.principalName,
    'Tipo': getTypeLabel(institution.type),
    'Status': institution.status === 'active' ? 'Ativo' : 'Inativo',
    'Data de Cadastro': new Date(institution.createdAt).toLocaleDateString('pt-BR')
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Instituições')

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 35 }, // Nome
    { wch: 18 }, // CNPJ
    { wch: 15 }, // Telefone
    { wch: 25 }, // Email
    { wch: 30 }, // Endereço
    { wch: 20 }, // Cidade
    { wch: 20 }, // Diretor
    { wch: 18 }, // Tipo
    { wch: 10 }, // Status
    { wch: 15 }  // Data
  ]
  worksheet['!cols'] = colWidths

  XLSX.writeFile(workbook, `instituicoes_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function exportInstitutionsToPDF(institutions: Institution[]) {
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      school: 'Escola',
      center: 'Centro Educacional',
      other: 'Outro'
    }
    return types[type] || type
  }

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
    maskCNPJ(institution.cnpj),
    institution.phone ? maskPhone(institution.phone) : '-',
    institution.city,
    institution.principalName,
    getTypeLabel(institution.type),
    institution.status === 'active' ? 'Ativo' : 'Inativo'
  ])

  autoTable(doc, {
    head: [['Nome', 'CNPJ', 'Telefone', 'Cidade', 'Diretor', 'Tipo', 'Status']],
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
    'Estoque': `${material.quantity} ${material.unit}`,
    'Estoque Mínimo': `${material.minQuantity} ${material.unit}`,
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
    { wch: 15 }, // Estoque
    { wch: 15 }, // Mínimo
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
  doc.setFont(undefined, 'bold')
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
  doc.setFont(undefined, 'normal')
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
  doc.setFont(undefined, 'normal')
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

