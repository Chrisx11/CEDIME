'use client'

import React from 'react'
import { useSuppliers } from '@/hooks/use-suppliers'
import { useInstitutions } from '@/hooks/use-institutions'
import { useMaterials } from '@/hooks/use-materials'
import { useRequests } from '@/hooks/use-requests'
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
  AlertTriangle
} from 'lucide-react'

export default function DashboardPage() {
  const { suppliers, isLoading: isLoadingSuppliers } = useSuppliers()
  const { institutions, isLoading: isLoadingInstitutions } = useInstitutions()
  const { materials, isLoading: isLoadingMaterials } = useMaterials()
  const { requests, isLoading: isLoadingRequests } = useRequests()

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

          <Card className="p-5 border border-destructive/20 bg-destructive/5 hover:border-destructive/40 transition-colors">
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
      </div>
    </AuthLayout>
  )
}
