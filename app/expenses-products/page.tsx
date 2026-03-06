'use client'

import { useState, useMemo } from 'react'
import React from 'react'
import { AuthLayout } from '@/components/auth-layout'
import { useMaterials } from '@/hooks/use-materials'
import { useEntries } from '@/hooks/use-entries'
import { useInstitutions } from '@/hooks/use-institutions'
import { useOutputs } from '@/hooks/use-outputs'
import { useCategories } from '@/hooks/use-categories'
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
import { FileText, Download, FileSpreadsheet, File, Search, School, Eye, LayoutGrid } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { exportExpensesByProductsToExcel, exportExpensesByProductsToPDF } from '@/lib/export-utils'

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

export default function ExpensesProductsPage() {
  const { materials, isLoading: isLoadingMaterials } = useMaterials()
  const { entries, isLoading: isLoadingEntries } = useEntries()
  const { institutions, isLoading: isLoadingInstitutions } = useInstitutions()
  const { outputs, isLoading: isLoadingOutputs } = useOutputs()
  const { categories } = useCategories()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'values' | 'quantities' | 'complete'>('values')
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear())
  const { toast } = useToast()

  const isLoading = isLoadingMaterials || isLoadingEntries || isLoadingInstitutions || isLoadingOutputs

  // Obter lista de anos disponíveis baseado nas entradas e saídas
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    entries.forEach(entry => {
      const date = new Date(entry.entry_date)
      years.add(date.getFullYear())
    })
    outputs.forEach(output => {
      const date = new Date(output.output_date)
      years.add(date.getFullYear())
    })
    // Sempre incluir o ano atual (recalculado a cada vez para garantir que está atualizado)
    const now = new Date()
    const currentYearNow = now.getFullYear()
    years.add(currentYearNow)
    return Array.from(years).sort((a, b) => b - a) // Ordenar do mais recente para o mais antigo
  }, [entries, outputs])

  // Identificar produtos entregues para a instituição selecionada
  const materialsByInstitution = useMemo(() => {
    if (!selectedInstitutionId || selectedInstitutionId === 'all') {
      return new Set<string>() // Se nenhuma instituição selecionada ou "all", retorna vazio (mostra todos)
    }

    const materialIds = new Set<string>()
    outputs.forEach(output => {
      if (output.institution_id === selectedInstitutionId && output.material_id) {
        materialIds.add(output.material_id)
      }
    })
    return materialIds
  }, [outputs, selectedInstitutionId])

  const filteredMaterials = useMemo(() => {
    let filtered = materials

    // Filtrar por instituição se selecionada (e não for "all")
    if (selectedInstitutionId && selectedInstitutionId !== 'all') {
      filtered = filtered.filter(material => materialsByInstitution.has(material.id))
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory)
    }

    // Filtrar por busca de texto
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(material => {
        const nameMatch = material.name.toLowerCase().includes(query)
        const categoryMatch = material.category.toLowerCase().includes(query)
        return nameMatch || categoryMatch
      })
    }

    return filtered
  }, [materials, searchQuery, selectedInstitutionId, selectedCategory, materialsByInstitution])


  // Calcular despesas por produto e mês
  // Se "Todas as Instituições": baseado em entradas
  // Se instituição específica: baseado em saídas para aquela instituição
  const expensesByMaterial = useMemo(() => {
    const expenses: Record<string, Record<number, number>> = {}
    
    // Se uma instituição específica estiver selecionada, usar SAÍDAS
    if (selectedInstitutionId && selectedInstitutionId !== 'all') {
      outputs.forEach(output => {
        // Só considerar saídas para a instituição selecionada
        if (output.institution_id !== selectedInstitutionId) return
        
        const date = new Date(output.output_date)
        const month = date.getMonth() // 0-11
        const year = date.getFullYear()
        
        // Só considerar saídas do ano selecionado
        if (year !== selectedYear) return
        
        // Buscar preço unitário do material
        const material = materials.find(m => m.id === output.material_id)
        const unitPrice = material?.unit_price || 0
        const value = output.quantity * unitPrice
        
        if (!expenses[output.material_id]) {
          expenses[output.material_id] = {}
        }
        
        if (!expenses[output.material_id][month]) {
          expenses[output.material_id][month] = 0
        }
        
        expenses[output.material_id][month] += value
      })
    } else {
      // Se "Todas as Instituições", usar ENTRADAS
      entries.forEach(entry => {
        const date = new Date(entry.entry_date)
        const month = date.getMonth() // 0-11
        const year = date.getFullYear()
        
        // Só considerar entradas do ano selecionado
        if (year !== selectedYear) return
        
        const value = entry.quantity * entry.unit_price
        
        if (!expenses[entry.material_id]) {
          expenses[entry.material_id] = {}
        }
        
        if (!expenses[entry.material_id][month]) {
          expenses[entry.material_id][month] = 0
        }
        
        expenses[entry.material_id][month] += value
      })
    }
    
    return expenses
  }, [entries, outputs, selectedInstitutionId, materials, selectedYear])

  // Calcular quantidades por produto e mês
  // Se "Todas as Instituições": baseado em entradas
  // Se instituição específica: baseado em saídas para aquela instituição
  const quantitiesByMaterial = useMemo(() => {
    const quantities: Record<string, Record<number, number>> = {}
    
    // Se uma instituição específica estiver selecionada, usar SAÍDAS
    if (selectedInstitutionId && selectedInstitutionId !== 'all') {
      outputs.forEach(output => {
        // Só considerar saídas para a instituição selecionada
        if (output.institution_id !== selectedInstitutionId) return
        
        const date = new Date(output.output_date)
        const month = date.getMonth() // 0-11
        const year = date.getFullYear()
        
        // Só considerar saídas do ano selecionado
        if (year !== selectedYear) return
        
        if (!quantities[output.material_id]) {
          quantities[output.material_id] = {}
        }
        
        if (!quantities[output.material_id][month]) {
          quantities[output.material_id][month] = 0
        }
        
        quantities[output.material_id][month] += output.quantity
      })
    } else {
      // Se "Todas as Instituições", usar ENTRADAS
      entries.forEach(entry => {
        const date = new Date(entry.entry_date)
        const month = date.getMonth() // 0-11
        const year = date.getFullYear()
        
        // Só considerar entradas do ano selecionado
        if (year !== selectedYear) return
        
        if (!quantities[entry.material_id]) {
          quantities[entry.material_id] = {}
        }
        
        if (!quantities[entry.material_id][month]) {
          quantities[entry.material_id][month] = 0
        }
        
        quantities[entry.material_id][month] += entry.quantity
      })
    }
    
    return quantities
  }, [entries, outputs, selectedInstitutionId, selectedYear])

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
  const getMonthValue = (materialId: string, monthIndex: number) => {
    return expensesByMaterial[materialId]?.[monthIndex] || 0
  }

  // Função para obter quantidade do mês
  const getMonthQuantity = (materialId: string, monthIndex: number) => {
    return quantitiesByMaterial[materialId]?.[monthIndex] || 0
  }

  // Função para calcular total do produto (valor)
  const getTotalValue = (materialId: string) => {
    const materialExpenses = expensesByMaterial[materialId]
    if (!materialExpenses) return 0
    return Object.values(materialExpenses).reduce((sum, value) => sum + value, 0)
  }

  // Função para calcular total do produto (quantidade)
  const getTotalQuantity = (materialId: string) => {
    const materialQuantities = quantitiesByMaterial[materialId]
    if (!materialQuantities) return 0
    return Object.values(materialQuantities).reduce((sum, qty) => sum + qty, 0)
  }

  // Função para formatar quantidade
  const formatQuantity = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Calcular totais gerais por mês (valores)
  const getTotalByMonth = useMemo(() => {
    const totals: number[] = new Array(12).fill(0)
    
    // Calcular totais apenas dos materiais filtrados
    filteredMaterials.forEach(material => {
      const materialExpenses = expensesByMaterial[material.id]
      if (materialExpenses) {
        Object.entries(materialExpenses).forEach(([monthIndex, value]) => {
          const month = parseInt(monthIndex)
          if (month >= 0 && month < 12) {
            totals[month] += value
          }
        })
      }
    })
    
    return totals
  }, [expensesByMaterial, filteredMaterials])

  // Calcular totais gerais por mês (quantidades)
  const getTotalQuantityByMonth = useMemo(() => {
    const totals: number[] = new Array(12).fill(0)
    
    // Calcular totais apenas dos materiais filtrados
    filteredMaterials.forEach(material => {
      const materialQuantities = quantitiesByMaterial[material.id]
      if (materialQuantities) {
        Object.entries(materialQuantities).forEach(([monthIndex, qty]) => {
          const month = parseInt(monthIndex)
          if (month >= 0 && month < 12) {
            totals[month] += qty
          }
        })
      }
    })
    
    return totals
  }, [quantitiesByMaterial, filteredMaterials])

  // Calcular total geral do ano (valor)
  const getTotalYear = useMemo(() => {
    return getTotalByMonth.reduce((sum, value) => sum + value, 0)
  }, [getTotalByMonth])

  // Calcular total geral do ano (quantidade)
  const getTotalQuantityYear = useMemo(() => {
    return getTotalQuantityByMonth.reduce((sum, value) => sum + value, 0)
  }, [getTotalQuantityByMonth])

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
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedInstitutionId || 'all'} onValueChange={setSelectedInstitutionId}>
            <SelectTrigger className="w-[200px]">
              <School className="h-4 w-4 mr-2" />
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
                <Eye className="h-4 w-4 mr-2" />
                {viewMode === 'values' && 'Valores'}
                {viewMode === 'quantities' && 'Quantidade'}
                {viewMode === 'complete' && 'Completo'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode('values')}>
                <FileText className="h-4 w-4 mr-2" />
                Mostrar Valores
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('quantities')}>
                <LayoutGrid className="h-4 w-4 mr-2" />
                Mostrar Quantidade
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('complete')}>
                <LayoutGrid className="h-4 w-4 mr-2" />
                Completo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  const selectedInstitution = selectedInstitutionId && selectedInstitutionId !== 'all'
                    ? institutions.find(i => i.id === selectedInstitutionId)
                    : undefined
                  
                  exportExpensesByProductsToExcel(
                    filteredMaterials.map(m => ({ id: m.id, name: m.name })),
                    expensesByMaterial,
                    quantitiesByMaterial,
                    viewMode,
                    selectedInstitution?.name,
                    getTotalByMonth,
                    getTotalYear,
                    getTotalQuantityByMonth,
                    getTotalQuantityYear,
                    selectedYear,
                    selectedCategory !== 'all' ? selectedCategory : undefined,
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
                  const selectedInstitution = selectedInstitutionId && selectedInstitutionId !== 'all'
                    ? institutions.find(i => i.id === selectedInstitutionId)
                    : undefined
                  
                  exportExpensesByProductsToPDF(
                    filteredMaterials.map(m => ({ id: m.id, name: m.name })),
                    expensesByMaterial,
                    quantitiesByMaterial,
                    viewMode,
                    selectedInstitution?.name,
                    getTotalByMonth,
                    getTotalYear,
                    getTotalQuantityByMonth,
                    getTotalQuantityYear,
                    selectedYear,
                    selectedCategory !== 'all' ? selectedCategory : undefined,
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
                  <TableHead className="min-w-[200px] text-sm">Produto</TableHead>
                  {months.map((month) => {
                    if (viewMode === 'complete') {
                      return (
                        <TableHead key={month} colSpan={2} className="text-center min-w-[120px] px-2 text-xs border-x">
                          {month}
                        </TableHead>
                      )
                    }
                    return (
                      <TableHead key={month} className="text-center min-w-[60px] px-2 text-xs">
                        {month}
                      </TableHead>
                    )
                  })}
                  {viewMode === 'complete' ? (
                    <TableHead colSpan={2} className="text-center min-w-[120px] font-semibold px-2 text-xs">
                      Total
                    </TableHead>
                  ) : (
                    <TableHead className="text-center min-w-[80px] font-semibold px-2 text-xs">
                      Total
                    </TableHead>
                  )}
                </TableRow>
                {viewMode === 'complete' && (
                  <TableRow>
                    <TableHead className="min-w-[200px] text-sm"></TableHead>
                    {months.map((month) => (
                      <React.Fragment key={month}>
                        <TableHead className="text-center min-w-[60px] px-2 text-xs text-muted-foreground border-x">
                          Qtd
                        </TableHead>
                        <TableHead className="text-center min-w-[60px] px-2 text-xs text-muted-foreground">
                          Valor
                        </TableHead>
                      </React.Fragment>
                    ))}
                    <TableHead className="text-center min-w-[60px] px-2 text-xs text-muted-foreground border-x">
                      Qtd
                    </TableHead>
                    <TableHead className="text-center min-w-[60px] px-2 text-xs text-muted-foreground">
                      Valor
                    </TableHead>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={viewMode === 'complete' ? 26 : 14} 
                      className="text-center text-muted-foreground py-8"
                    >
                      {selectedInstitutionId && selectedInstitutionId !== 'all'
                        ? searchQuery.trim() !== ''
                          ? `Nenhum produto encontrado para a instituição selecionada com o termo "${searchQuery}"`
                          : 'Nenhum produto entregue para a instituição selecionada'
                        : searchQuery.trim() !== ''
                          ? `Nenhum produto encontrado com o termo "${searchQuery}"`
                          : 'Nenhum produto cadastrado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium text-sm">
                          {material.name}
                        </TableCell>
                        {months.map((month, index) => {
                          if (viewMode === 'complete') {
                            return (
                              <React.Fragment key={month}>
                                <TableCell className="text-center px-2 text-xs border-x">
                                  {formatQuantity(getMonthQuantity(material.id, index))}
                                </TableCell>
                                <TableCell className="text-center px-2 text-xs">
                                  {formatCurrency(getMonthValue(material.id, index))}
                                </TableCell>
                              </React.Fragment>
                            )
                          } else if (viewMode === 'quantities') {
                            return (
                              <TableCell key={month} className="text-center px-2 text-xs">
                                {formatQuantity(getMonthQuantity(material.id, index))}
                              </TableCell>
                            )
                          } else {
                            return (
                              <TableCell key={month} className="text-center px-2 text-xs">
                                {formatCurrency(getMonthValue(material.id, index))}
                              </TableCell>
                            )
                          }
                        })}
                        {viewMode === 'complete' ? (
                          <>
                            <TableCell className="text-center font-semibold px-2 text-xs border-x">
                              {formatQuantity(getTotalQuantity(material.id))}
                            </TableCell>
                            <TableCell className="text-center font-semibold px-2 text-xs">
                              {formatCurrency(getTotalValue(material.id))}
                            </TableCell>
                          </>
                        ) : viewMode === 'quantities' ? (
                          <TableCell className="text-center font-semibold px-2 text-xs">
                            {formatQuantity(getTotalQuantity(material.id))}
                          </TableCell>
                        ) : (
                          <TableCell className="text-center font-semibold px-2 text-xs">
                            {formatCurrency(getTotalValue(material.id))}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {/* Linha de totais gerais */}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="font-bold text-sm">
                        Total Geral
                      </TableCell>
                      {months.map((month, index) => {
                        if (viewMode === 'complete') {
                          return (
                            <React.Fragment key={month}>
                              <TableCell className="text-center font-bold px-2 text-xs border-x">
                                {formatQuantity(getTotalQuantityByMonth[index])}
                              </TableCell>
                              <TableCell className="text-center font-bold px-2 text-xs">
                                {formatCurrency(getTotalByMonth[index])}
                              </TableCell>
                            </React.Fragment>
                          )
                        } else if (viewMode === 'quantities') {
                          return (
                            <TableCell key={month} className="text-center font-bold px-2 text-xs">
                              {formatQuantity(getTotalQuantityByMonth[index])}
                            </TableCell>
                          )
                        } else {
                          return (
                            <TableCell key={month} className="text-center font-bold px-2 text-xs">
                              {formatCurrency(getTotalByMonth[index])}
                            </TableCell>
                          )
                        }
                      })}
                      {viewMode === 'complete' ? (
                        <>
                          <TableCell className="text-center font-bold px-2 text-xs border-x">
                            {formatQuantity(getTotalQuantityYear)}
                          </TableCell>
                          <TableCell className="text-center font-bold px-2 text-xs">
                            {formatCurrency(getTotalYear)}
                          </TableCell>
                        </>
                      ) : viewMode === 'quantities' ? (
                        <TableCell className="text-center font-bold px-2 text-xs">
                          {formatQuantity(getTotalQuantityYear)}
                        </TableCell>
                      ) : (
                        <TableCell className="text-center font-bold px-2 text-xs">
                          {formatCurrency(getTotalYear)}
                        </TableCell>
                      )}
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
