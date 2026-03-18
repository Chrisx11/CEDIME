'use client'

import { useState, useMemo } from 'react'
import { AuthLayout } from '@/components/auth-layout'
import { useSuppliers } from '@/hooks/use-suppliers'
import { useEntries } from '@/hooks/use-entries'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Download, FileSpreadsheet, File, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { exportExpensesBySuppliersToExcel, exportExpensesBySuppliersToPDF, exportTableToPDF } from '@/lib/export-utils'

const months = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez'
]

export default function ExpensesSuppliersPage() {
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers()
  const { entries, isLoading: isLoadingEntries } = useEntries()
  const [searchQuery, setSearchQuery] = useState('')
  // Inicializar com o ano atual
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear())
  const { toast } = useToast()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsSupplierId, setDetailsSupplierId] = useState<string | null>(null)
  const [detailsMonthIndex, setDetailsMonthIndex] = useState<number | null>(null)

  const isLoading = isLoadingSuppliers || isLoadingEntries

  const openDetails = (supplierId: string, monthIndex: number | null) => {
    setDetailsSupplierId(supplierId)
    setDetailsMonthIndex(monthIndex)
    setDetailsOpen(true)
  }

  // Obter lista de anos disponíveis baseado nas entradas
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    entries.forEach(entry => {
      const date = new Date(entry.entry_date)
      years.add(date.getFullYear())
    })
    // Sempre incluir o ano atual (recalculado a cada vez para garantir que está atualizado)
    const now = new Date()
    const currentYearNow = now.getFullYear()
    years.add(currentYearNow)
    return Array.from(years).sort((a, b) => b - a) // Ordenar do mais recente para o mais antigo
  }, [entries])

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return suppliers
    }

    const query = searchQuery.trim().toLowerCase()
    return suppliers.filter(supplier => {
      const nameMatch = supplier.name.toLowerCase().includes(query)
      const cityMatch = supplier.city.toLowerCase().includes(query)
      const stateMatch = supplier.state && supplier.state.toLowerCase().includes(query)
      return nameMatch || cityMatch || stateMatch
    })
  }, [suppliers, searchQuery])


  // Calcular despesas por fornecedor e mês
  const expensesBySupplier = useMemo(() => {
    const expenses: Record<string, Record<number, number>> = {}
    
    entries.forEach(entry => {
      if (!entry.supplier_id) return
      
      const date = new Date(entry.entry_date)
      const month = date.getMonth() // 0-11
      const year = date.getFullYear()
      
      // Só considerar entradas do ano selecionado
      if (year !== selectedYear) return
      
      const value = entry.quantity * entry.unit_price
      
      if (!expenses[entry.supplier_id]) {
        expenses[entry.supplier_id] = {}
      }
      
      if (!expenses[entry.supplier_id][month]) {
        expenses[entry.supplier_id][month] = 0
      }
      
      expenses[entry.supplier_id][month] += value
    })
    
    return expenses
  }, [entries, selectedYear])

  type DetailRow = {
    id: string
    date: string
    materialName: string
    qty: number
    unitPrice: number
    total: number
    responsible: string
  }

  const detailRows = useMemo<DetailRow[]>(() => {
    if (!detailsSupplierId) return []

    const monthFilter = detailsMonthIndex
    const rows: DetailRow[] = []

    const includeMonth = (d: Date) => {
      if (monthFilter === null) return true
      return d.getMonth() === monthFilter
    }

    entries.forEach((e) => {
      if (!e.supplier_id) return
      if (e.supplier_id !== detailsSupplierId) return

      const d = new Date(e.entry_date)
      if (d.getFullYear() !== selectedYear) return
      if (!includeMonth(d)) return

      const qty = Number(e.quantity) || 0
      const unitPrice = Number(e.unit_price) || 0
      rows.push({
        id: e.id,
        date: e.entry_date,
        materialName: e.material_name,
        qty,
        unitPrice,
        total: qty * unitPrice,
        responsible: e.responsible,
      })
    })

    rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return rows
  }, [detailsSupplierId, detailsMonthIndex, entries, selectedYear])

  const detailsSupplierName = useMemo(() => {
    if (!detailsSupplierId) return ''
    return suppliers.find((s) => s.id === detailsSupplierId)?.name || ''
  }, [detailsSupplierId, suppliers])

  const detailsTitle = useMemo(() => {
    if (!detailsSupplierId) return 'Detalhes'
    const monthLabel = detailsMonthIndex === null ? 'Todos os meses' : months[detailsMonthIndex]
    return `${detailsSupplierName} • ${monthLabel} • ${selectedYear}`
  }, [detailsSupplierId, detailsMonthIndex, detailsSupplierName, selectedYear])

  // Função para formatar valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatQuantity = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Função para obter valor do mês
  const getMonthValue = (supplierId: string, monthIndex: number) => {
    return expensesBySupplier[supplierId]?.[monthIndex] || 0
  }

  // Função para calcular total do fornecedor
  const getTotalValue = (supplierId: string) => {
    const supplierExpenses = expensesBySupplier[supplierId]
    if (!supplierExpenses) return 0
    return Object.values(supplierExpenses).reduce((sum, value) => sum + value, 0)
  }

  // Calcular totais gerais por mês
  const getTotalByMonth = useMemo(() => {
    const totals: number[] = new Array(12).fill(0)
    
    Object.values(expensesBySupplier).forEach((supplierExpenses) => {
      Object.entries(supplierExpenses).forEach(([monthIndex, value]) => {
        const month = parseInt(monthIndex)
        if (month >= 0 && month < 12) {
          totals[month] += value
        }
      })
    })
    
    return totals
  }, [expensesBySupplier])

  // Calcular total geral do ano
  const getTotalYear = useMemo(() => {
    return getTotalByMonth.reduce((sum, value) => sum + value, 0)
  }, [getTotalByMonth])

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <div className="flex gap-2 mb-6 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, cidade ou estado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="font-medium">
                <FileText className="h-4 w-4 mr-2" />
                Relatório
                <Download className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  exportExpensesBySuppliersToExcel(
                    filteredSuppliers.map(s => ({ id: s.id, name: s.name })),
                    expensesBySupplier,
                    getTotalByMonth,
                    getTotalYear
                  )
                  toast({
                    title: 'Exportação concluída',
                    description: 'Relatório Excel gerado com sucesso.',
                  })
                }}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exportar para Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  exportExpensesBySuppliersToPDF(
                    filteredSuppliers.map(s => ({ id: s.id, name: s.name })),
                    expensesBySupplier,
                    getTotalByMonth,
                    getTotalYear
                  )
                  toast({
                    title: 'Exportação concluída',
                    description: 'Relatório PDF gerado com sucesso.',
                  })
                }}
              >
                <File className="h-4 w-4 mr-2" />
                Exportar para PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] text-sm">Fornecedor</TableHead>
                  {months.map((month) => (
                    <TableHead key={month} className="text-center min-w-[60px] px-2 text-xs">
                      {month}
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[80px] font-semibold px-2 text-xs">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                      {searchQuery.trim() !== '' 
                        ? `Nenhum fornecedor encontrado com o termo "${searchQuery}"`
                        : 'Nenhum fornecedor cadastrado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium text-sm">
                          <button
                            type="button"
                            className="text-left hover:underline"
                            onClick={() => openDetails(supplier.id, null)}
                          >
                            {supplier.name}
                          </button>
                        </TableCell>
                        {months.map((month, index) => (
                          <TableCell key={month} className="text-center px-2 text-xs">
                            <button
                              type="button"
                              className="hover:underline"
                              onClick={() => openDetails(supplier.id, index)}
                            >
                              {formatCurrency(getMonthValue(supplier.id, index))}
                            </button>
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-semibold px-2 text-xs">
                          {formatCurrency(getTotalValue(supplier.id))}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Linha de totais gerais */}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="font-bold text-sm">
                        Total Geral
                      </TableCell>
                      {months.map((month, index) => (
                        <TableCell key={month} className="text-center font-bold px-2 text-xs">
                          {formatCurrency(getTotalByMonth[index])}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-bold px-2 text-xs">
                        {formatCurrency(getTotalYear)}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <DialogTitle>Registros</DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Baixar PDF"
                onClick={() => {
                  exportTableToPDF({
                    title: 'Registros de Despesas por Fornecedor - CEDIME',
                    subtitle: detailsTitle,
                    headers: ['Data', 'Material', 'Qtd', 'Preço Unit.', 'Total', 'Responsável'],
                    rows: detailRows.map(r => [
                      new Date(r.date).toLocaleDateString('pt-BR'),
                      r.materialName,
                      formatQuantity(r.qty),
                      formatCurrency(r.unitPrice),
                      formatCurrency(r.total),
                      r.responsible,
                    ]),
                    filename: `registros_fornecedor_${detailsSupplierName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
                    orientation: 'landscape',
                  })
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>{detailsTitle}</DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Nenhum registro encontrado para este filtro.
                    </TableCell>
                  </TableRow>
                ) : (
                  detailRows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{new Date(r.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="font-medium">{r.materialName}</TableCell>
                      <TableCell className="text-right">{formatQuantity(r.qty)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(r.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(r.total)}</TableCell>
                      <TableCell>{r.responsible}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  )
}
