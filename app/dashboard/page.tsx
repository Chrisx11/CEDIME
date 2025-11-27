'use client'

import React from 'react'
import { useSuppliers } from '@/hooks/use-suppliers'
import { useInstitutions } from '@/hooks/use-institutions'
import { useMaterials } from '@/hooks/use-materials'
import { useRequests } from '@/hooks/use-requests'
import { useEntries } from '@/hooks/use-entries'
import { useOutputs } from '@/hooks/use-outputs'
import { AuthLayout } from '@/components/auth-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { 
  Building2, 
  School, 
  Package, 
  FileText, 
  AlertTriangle,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function DashboardPage() {
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers()
  const { institutions, isLoading: isLoadingInstitutions } = useInstitutions()
  const { materials, isLoading: isLoadingMaterials } = useMaterials()
  const { requests, isLoading: isLoadingRequests } = useRequests()
  const { entries = [], isLoading: isLoadingEntries } = useEntries()
  const { outputs = [], isLoading: isLoadingOutputs } = useOutputs()

  const [isLowStockDialogOpen, setIsLowStockDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [sortColumn, setSortColumn] = React.useState<keyof typeof materials[0] | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const isLoading = isLoadingSuppliers || isLoadingInstitutions || isLoadingMaterials || isLoadingRequests

  // Filtrar fornecedores ativos
  const activeSuppliers = suppliers.filter(s => s.status === 'active')
  
  // Filtrar instituições ativas
  const activeInstitutions = institutions.filter(i => i.status === 'active')

  // Materiais com estoque baixo (excluindo ALIMENTO PERECÍVEL)
  const lowStockItems = materials.filter(
    m => m.quantity <= m.min_quantity && m.category !== 'ALIMENTO PERECÍVEL'
  )
  
  // Requisições pendentes
  const pendingRequests = requests.filter(r => r.status === 'pending')

  // Obter categorias únicas dos itens com estoque baixo
  const availableCategories = React.useMemo(() => {
    const categories = new Set(
      lowStockItems.map(item => item.category)
    )
    return Array.from(categories).sort()
  }, [lowStockItems])

  // Filtrar e ordenar itens com estoque baixo
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = lowStockItems

    // Filtro de pesquisa
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.unit.toLowerCase().includes(query)
      )
    }

    // Filtro de categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Ordenação
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        return 0
      })
    }

    return filtered
  }, [lowStockItems, searchQuery, selectedCategory, sortColumn, sortDirection])

  const handleSort = (column: keyof typeof materials[0]) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ column }: { column: keyof typeof materials[0] }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />
  }

  // Calcular total de compras por fornecedor
  const purchasesBySupplier = React.useMemo(() => {
    if (!entries || entries.length === 0) return []
    
    const purchases: Record<string, { total: number; name: string }> = {}
    
    entries.forEach(entry => {
      if (!entry.supplier_id || !entry.supplier_name) return
      
      const value = entry.quantity * entry.unit_price
      
      if (!purchases[entry.supplier_id]) {
        purchases[entry.supplier_id] = {
          total: 0,
          name: entry.supplier_name
        }
      }
      
      purchases[entry.supplier_id].total += value
    })
    
    // Converter para array e ordenar por valor
    return Object.entries(purchases)
      .map(([supplierId, data]) => {
        const supplier = suppliers.find(s => s.id === supplierId)
        return {
          name: supplier?.name || data.name || 'Fornecedor Desconhecido',
          value: data.total
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10
  }, [entries, suppliers])

  // Calcular despesas por instituição
  const expensesByInstitution = React.useMemo(() => {
    if (!outputs || outputs.length === 0) return []
    
    const expenses: Record<string, { total: number; name: string }> = {}
    
    outputs.forEach(output => {
      if (!output.institution_id || !output.institution_name) return
      
      // Buscar preço unitário do material
      const material = materials.find(m => m.id === output.material_id)
      const unitPrice = material?.unit_price || 0
      const value = output.quantity * unitPrice
      
      if (!expenses[output.institution_id]) {
        expenses[output.institution_id] = {
          total: 0,
          name: output.institution_name
        }
      }
      
      expenses[output.institution_id].total += value
    })
    
    // Converter para array e ordenar por valor
    return Object.entries(expenses)
      .map(([institutionId, data]) => {
        const institution = institutions.find(i => i.id === institutionId)
        return {
          name: institution?.name || data.name || 'Instituição Desconhecida',
          value: data.total
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10
  }, [outputs, materials, institutions])

  // Dados para gráfico de requisições por status
  const statusData = [
    { name: 'Pendentes', value: requests.filter(r => r.status === 'pending').length, fill: '#eab308' },
    { name: 'Aprovadas', value: requests.filter(r => r.status === 'approved').length, fill: '#3b82f6' },
    { name: 'Entregues', value: requests.filter(r => r.status === 'delivered').length, fill: '#22c55e' },
    { name: 'Canceladas', value: requests.filter(r => r.status === 'cancelled').length, fill: '#ef4444' },
  ].filter(s => s.value > 0)

  // Dados para gráfico de requisições recentes
  const recentRequests = requests
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6)
    .map(r => ({
      number: r.request_number.substring(4),
      value: r.total_value
    }))


  if (isLoading) {
    return (
      <AuthLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando dados do dashboard...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="p-5 border border-border/50 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fornecedores</div>
              <Building2 className="h-4 w-4 text-primary/60" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{activeSuppliers.length}</div>
            <div className="text-xs text-muted-foreground mt-1">ativos</div>
          </Card>

          <Card className="p-5 border border-border/50 hover:border-secondary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Instituições</div>
              <School className="h-4 w-4 text-secondary/60" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{activeInstitutions.length}</div>
            <div className="text-xs text-muted-foreground mt-1">ativas</div>
          </Card>

          <Card className="p-5 border border-border/50 hover:border-accent/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Materiais</div>
              <Package className="h-4 w-4 text-accent/60" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{materials.length}</div>
            <div className="text-xs text-muted-foreground mt-1">cadastrados</div>
          </Card>

          <Card 
            className="p-5 border border-destructive/20 bg-destructive/5 hover:border-destructive/40 transition-colors cursor-pointer"
            onClick={() => lowStockItems.length > 0 && setIsLowStockDialogOpen(true)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estoque Baixo</div>
              <AlertTriangle className="h-4 w-4 text-destructive/70" />
            </div>
            <div className="text-2xl font-semibold text-destructive">{lowStockItems.length}</div>
            <div className="text-xs text-muted-foreground mt-1">itens</div>
          </Card>

          <Card className="p-5 border border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pendentes</div>
              <FileText className="h-4 w-4 text-yellow-600/70" />
            </div>
            <div className="text-2xl font-semibold text-yellow-600">{pendingRequests.length}</div>
            <div className="text-xs text-muted-foreground mt-1">requisições</div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Charts */}
          <div className="space-y-6">
            {/* Status Chart */}
            {statusData.length > 0 && (
              <Card className="p-5 border border-border/50">
                <h3 className="font-semibold text-sm mb-5 text-foreground">Requisições por Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Recent Requests Chart */}
            {recentRequests.length > 0 && (
              <Card className="p-5 border border-border/50">
                <h3 className="font-semibold text-sm mb-5 text-foreground">Requisições Recentes (Valor)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={recentRequests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="number" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(value as number)
                      } 
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Total de Compras por Fornecedor */}
            <Card className="p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-5 text-foreground">Total de Compras por Fornecedor</h3>
              {purchasesBySupplier.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={purchasesBySupplier}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number"
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          notation: 'compact',
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(value as number)
                      }
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <p className="text-sm">Nenhuma compra registrada ainda.</p>
                    <p className="text-xs mt-1">Os dados aparecerão aqui quando houver entradas de materiais.</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Despesas por Instituição */}
            <Card className="p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-5 text-foreground">Despesas por Instituição</h3>
              {expensesByInstitution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={expensesByInstitution}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number"
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          notation: 'compact',
                          maximumFractionDigits: 0,
                        }).format(value)
                      }
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(value as number)
                      }
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <p className="text-sm">Nenhuma despesa registrada ainda.</p>
                    <p className="text-xs mt-1">Os dados aparecerão aqui quando houver saídas de materiais para instituições.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

        </div>

        {/* Alerts */}
        {pendingRequests.length > 0 && (
          <Card className="p-5 border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1.5 text-foreground">Requisições Pendentes</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pendingRequests.length} requisição(ões) aguardando aprovação. Revise e processe conforme necessário.
                  </p>
                </div>
              </div>
              <Link href="/requests">
                <Button variant="outline" size="sm" className="border-yellow-500/30 text-yellow-600 hover:bg-yellow-500 hover:text-yellow-50">
                  Ver Requisições
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Diálogo de Estoque Baixo */}
        <Dialog open={isLowStockDialogOpen} onOpenChange={(open) => {
          setIsLowStockDialogOpen(open)
          if (!open) {
            setSearchQuery('')
            setSelectedCategory('all')
            setSortColumn(null)
            setSortDirection('asc')
          }
        }}>
          <DialogContent className="sm:max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Itens com Estoque Baixo</DialogTitle>
                  <DialogDescription className="mt-1">
                    {filteredAndSortedItems.length} de {lowStockItems.length} item(ns) com estoque abaixo ou igual ao mínimo
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {lowStockItems.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum item com estoque baixo no momento.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Filtros e Pesquisa */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar por nome, categoria ou unidade..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="min-w-[200px] cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Nome
                            <SortIcon column="name" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="min-w-[150px] cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center">
                            Categoria
                            <SortIcon column="category" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="min-w-[100px] text-right cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('quantity')}
                        >
                          <div className="flex items-center justify-end">
                            Estoque
                            <SortIcon column="quantity" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="min-w-[100px] text-right cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('min_quantity')}
                        >
                          <div className="flex items-center justify-end">
                            Mínimo
                            <SortIcon column="min_quantity" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="min-w-[100px] cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('unit')}
                        >
                          <div className="flex items-center">
                            Unidade
                            <SortIcon column="unit" />
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[120px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            Nenhum item encontrado com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAndSortedItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.min_quantity}</TableCell>
                            <TableCell>
                              {item.unit.charAt(0).toUpperCase() + item.unit.slice(1)}
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                Estoque Baixo
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthLayout>
  )
}
