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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear())
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('all')
  const { toast } = useToast()

  const isLoading = isLoadingInstitutions || isLoadingOutputs || isLoadingMaterials

  // Obter lista de anos disponíveis baseado nas saídas
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    outputs.forEach(output => {
      const date = new Date(output.output_date)
      years.add(date.getFullYear())
    })
    // Sempre incluir o ano atual (recalculado a cada vez para garantir que está atualizado)
    const now = new Date()
    const currentYearNow = now.getFullYear()
    years.add(currentYearNow)
    return Array.from(years).sort((a, b) => b - a) // Ordenar do mais recente para o mais antigo
  }, [outputs])

  const filteredInstitutions = useMemo(() => {
    let filtered = institutions

    // Filtrar por instituição selecionada no dropdown
    if (selectedInstitutionId && selectedInstitutionId !== 'all') {
      filtered = filtered.filter(institution => institution.id === selectedInstitutionId)
    }

    // Filtrar por pesquisa na barra
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(institution => {
        const nameMatch = institution.name.toLowerCase().includes(query)
        const cityMatch = institution.city.toLowerCase().includes(query)
        const stateMatch = institution.state?.toLowerCase().includes(query) || false
        const principalMatch = institution.principal_name.toLowerCase().includes(query)
        return nameMatch || cityMatch || stateMatch || principalMatch
      })
    }

    return filtered
  }, [institutions, searchQuery, selectedInstitutionId])


  // Calcular despesas por instituição e mês
  const expensesByInstitution = useMemo(() => {
    const expenses: Record<string, Record<number, number>> = {}
    
    outputs.forEach(output => {
      if (!output.institution_id) return
      
      const date = new Date(output.output_date)
      const month = date.getMonth() // 0-11
      const year = date.getFullYear()
      
      // Só considerar saídas do ano selecionado
      if (year !== selectedYear) return
      
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
  }, [outputs, materials, selectedYear])

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

  // Calcular totais gerais por mês (apenas das instituições filtradas)
  const getTotalByMonth = useMemo(() => {
    const totals: number[] = new Array(12).fill(0)
    
    // Calcular totais apenas das instituições filtradas
    filteredInstitutions.forEach(institution => {
      const institutionExpenses = expensesByInstitution[institution.id]
      if (institutionExpenses) {
        Object.entries(institutionExpenses).forEach(([monthIndex, value]) => {
          const month = parseInt(monthIndex)
          if (month >= 0 && month < 12) {
            totals[month] += value
          }
        })
      }
    })
    
    return totals
  }, [expensesByInstitution, filteredInstitutions])

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
              placeholder="Pesquisar por nome, cidade, estado ou responsável..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>
          <Select
            value={selectedInstitutionId}
            onValueChange={(value) => setSelectedInstitutionId(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todas as instituições" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as instituições</SelectItem>
              {institutions.map((institution) => (
                <SelectItem key={institution.id} value={institution.id}>
                  {institution.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  const selectedInstitution = selectedInstitutionId !== 'all' 
                    ? institutions.find(i => i.id === selectedInstitutionId)
                    : undefined
                  
                  exportExpensesByInstitutionsToExcel(
                    filteredInstitutions.map(i => ({ id: i.id, name: i.name })),
                    expensesByInstitution,
                    getTotalByMonth,
                    getTotalYear,
                    selectedYear,
                    selectedInstitution?.name,
                    searchQuery.trim() !== '' ? searchQuery : undefined
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
                  const selectedInstitution = selectedInstitutionId !== 'all' 
                    ? institutions.find(i => i.id === selectedInstitutionId)
                    : undefined
                  
                  exportExpensesByInstitutionsToPDF(
                    filteredInstitutions.map(i => ({ id: i.id, name: i.name })),
                    expensesByInstitution,
                    getTotalByMonth,
                    getTotalYear,
                    selectedYear,
                    selectedInstitution?.name,
                    searchQuery.trim() !== '' ? searchQuery : undefined
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
                  <>
                    {filteredInstitutions.map((institution) => (
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
    </AuthLayout>
  )
}
