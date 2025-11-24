'use client'

import { useState, useMemo } from 'react'
import { AuthLayout } from '@/components/auth-layout'
import { useSuppliers } from '@/hooks/use-suppliers'
import { useEntries } from '@/hooks/use-entries'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { FileText, Download, FileSpreadsheet, File, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { exportExpensesBySuppliersToExcel, exportExpensesBySuppliersToPDF } from '@/lib/export-utils'

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
  const { toast } = useToast()

  const isLoading = isLoadingSuppliers || isLoadingEntries

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
      const currentYear = new Date().getFullYear()
      
      // Só considerar entradas do ano atual
      if (year !== currentYear) return
      
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
  }, [entries])

  // Função para formatar valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
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
                    expensesBySupplier
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
                    expensesBySupplier
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
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium text-sm">
                        {supplier.name}
                      </TableCell>
                      {months.map((month, index) => (
                        <TableCell key={month} className="text-center px-2 text-xs">
                          {formatCurrency(getMonthValue(supplier.id, index))}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold px-2 text-xs">
                        {formatCurrency(getTotalValue(supplier.id))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AuthLayout>
  )
}
