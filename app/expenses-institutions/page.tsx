'use client'

import { useState, useMemo } from 'react'
import { AuthLayout } from '@/components/auth-layout'
import { useInstitutions } from '@/hooks/use-institutions'
import { useOutputs } from '@/hooks/use-outputs'
import { useMaterials } from '@/hooks/use-materials'
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
import { exportExpensesByInstitutionsToExcel, exportExpensesByInstitutionsToPDF } from '@/lib/export-utils'

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

export default function ExpensesInstitutionsPage() {
  const { institutions, isLoading: isLoadingInstitutions } = useInstitutions()
  const { outputs, isLoading: isLoadingOutputs } = useOutputs()
  const { materials, isLoading: isLoadingMaterials } = useMaterials()
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()

  const isLoading = isLoadingInstitutions || isLoadingOutputs || isLoadingMaterials

  const filteredInstitutions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return institutions
    }

    const query = searchQuery.trim().toLowerCase()
    return institutions.filter(institution => {
      const nameMatch = institution.name.toLowerCase().includes(query)
      const cityMatch = institution.city.toLowerCase().includes(query)
      const stateMatch = institution.state?.toLowerCase().includes(query) || false
      const principalMatch = institution.principal_name.toLowerCase().includes(query)
      return nameMatch || cityMatch || stateMatch || principalMatch
    })
  }, [institutions, searchQuery])


  // Calcular despesas por instituição e mês
  const expensesByInstitution = useMemo(() => {
    const expenses: Record<string, Record<number, number>> = {}
    
    outputs.forEach(output => {
      if (!output.institution_id) return
      
      const date = new Date(output.output_date)
      const month = date.getMonth() // 0-11
      const year = date.getFullYear()
      const currentYear = new Date().getFullYear()
      
      // Só considerar saídas do ano atual
      if (year !== currentYear) return
      
      // Buscar preço unitário do material
      const material = materials.find(m => m.id === output.material_id)
      const unitPrice = material?.unit_price || 0
      const value = output.quantity * unitPrice
      
      if (!expenses[output.institution_id]) {
        expenses[output.institution_id] = {}
      }
      
      if (!expenses[output.institution_id][month]) {
        expenses[output.institution_id][month] = 0
      }
      
      expenses[output.institution_id][month] += value
    })
    
    return expenses
  }, [outputs, materials])

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
  const getMonthValue = (institutionId: string, monthIndex: number) => {
    return expensesByInstitution[institutionId]?.[monthIndex] || 0
  }

  // Função para calcular total da instituição
  const getTotalValue = (institutionId: string) => {
    const institutionExpenses = expensesByInstitution[institutionId]
    if (!institutionExpenses) return 0
    return Object.values(institutionExpenses).reduce((sum, value) => sum + value, 0)
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
              placeholder="Pesquisar por nome, cidade, estado ou responsável..."
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
                  exportExpensesByInstitutionsToExcel(
                    filteredInstitutions.map(i => ({ id: i.id, name: i.name })),
                    expensesByInstitution
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
                  exportExpensesByInstitutionsToPDF(
                    filteredInstitutions.map(i => ({ id: i.id, name: i.name })),
                    expensesByInstitution
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
                  <TableHead className="min-w-[200px] text-sm">Instituição</TableHead>
                  {months.map((month) => (
                    <TableHead key={month} className="text-center min-w-[60px] px-2 text-xs">
                      {month}
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[80px] font-semibold px-2 text-xs">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstitutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                      {searchQuery.trim() !== '' 
                        ? `Nenhuma instituição encontrada com o termo "${searchQuery}"`
                        : 'Nenhuma instituição cadastrada'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstitutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell className="font-medium text-sm">
                        {institution.name}
                      </TableCell>
                      {months.map((month, index) => (
                        <TableCell key={month} className="text-center px-2 text-xs">
                          {formatCurrency(getMonthValue(institution.id, index))}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold px-2 text-xs">
                        {formatCurrency(getTotalValue(institution.id))}
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
