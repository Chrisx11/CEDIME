'use client'

import React from 'react'
import { useData } from '@/lib/data-context'
import { useAuth } from '@/lib/auth-context'
import { AuthLayout } from '@/components/auth-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { 
  Building2, 
  School, 
  Package, 
  FileText, 
  BarChart3,
  AlertTriangle,
  Plus,
  TrendingUp,
  DollarSign,
  CheckCircle2
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { suppliers, institutions, materials, requests, seedInitialData } = useData()
  
  // Popular dados iniciais se não houver
  React.useEffect(() => {
    if (suppliers.length === 0 || materials.length === 0) {
      seedInitialData()
    }
  }, [suppliers.length, materials.length, seedInitialData])

  const lowStockItems = materials.filter(m => m.quantity <= m.minQuantity)
  const pendingRequests = requests.filter(r => r.status === 'pending')
  const deliveredRequests = requests.filter(r => r.status === 'delivered')
  const totalStockValue = materials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0)
  const totalRequisitionValue = requests.reduce((acc, r) => acc + r.totalValue, 0)

  // Dados para gráfico de requisições por status
  const statusData = [
    { name: 'Pendentes', value: requests.filter(r => r.status === 'pending').length, fill: '#eab308' },
    { name: 'Aprovadas', value: requests.filter(r => r.status === 'approved').length, fill: '#3b82f6' },
    { name: 'Entregues', value: requests.filter(r => r.status === 'delivered').length, fill: '#22c55e' },
    { name: 'Canceladas', value: requests.filter(r => r.status === 'cancelled').length, fill: '#ef4444' },
  ].filter(s => s.value > 0)

  // Dados para gráfico de requisições recentes
  const recentRequests = requests.slice(-6).map(r => ({
    number: r.requestNumber.substring(4),
    value: r.totalValue
  }))

  const quickActions = [
    { label: 'Novo Fornecedor', href: '/suppliers', icon: Building2 },
    { label: 'Nova Instituição', href: '/institutions', icon: School },
    { label: 'Novo Material', href: '/materials', icon: Package },
    { label: 'Nova Requisição', href: '/requests', icon: FileText },
    { label: 'Ver Relatórios', href: '/reports', icon: BarChart3 },
  ]

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <PageHeader
          title={`Bem-vindo, ${user?.name}`}
          description="Dashboard operacional do CEDIME"
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="p-5 border border-border/50 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fornecedores</div>
              <Building2 className="h-4 w-4 text-primary/60" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{suppliers.length}</div>
            <div className="text-xs text-muted-foreground mt-1">cadastrados</div>
          </Card>

          <Card className="p-5 border border-border/50 hover:border-secondary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Instituições</div>
              <School className="h-4 w-4 text-secondary/60" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{institutions.length}</div>
            <div className="text-xs text-muted-foreground mt-1">ativas</div>
          </Card>

          <Card className="p-5 border border-border/50 hover:border-accent/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Materiais</div>
              <Package className="h-4 w-4 text-accent/60" />
            </div>
            <div className="text-2xl font-semibold text-foreground">{materials.length}</div>
            <div className="text-xs text-muted-foreground mt-1">em estoque</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
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
                    <Tooltip formatter={(value) => `R$ ${(value as number).toFixed(2)}`} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Ações Rápidas</h3>
              <div className="space-y-2">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon
                  return (
                    <Link key={idx} href={action.href}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      >
                        <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{action.label}</span>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </Card>

            {/* Key Metrics */}
            <Card className="p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Métricas Principais</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Valor Total Estoque</span>
                  </div>
                  <span className="font-semibold text-base text-foreground">R$ {totalStockValue.toFixed(2)}</span>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Valor em Requisições</span>
                  </div>
                  <span className="font-semibold text-base text-foreground">R$ {totalRequisitionValue.toFixed(2)}</span>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Taxa Entrega</span>
                  </div>
                  <span className="font-semibold text-base text-foreground">
                    {requests.length === 0 ? '0%' : Math.round((deliveredRequests.length / requests.length) * 100) + '%'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Alerts */}
        {(lowStockItems.length > 0 || pendingRequests.length > 0) && (
          <div className="space-y-4">
            {lowStockItems.length > 0 && (
              <Card className="p-5 border-destructive/20 bg-destructive/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1.5 text-foreground">Alerta de Estoque Baixo</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {lowStockItems.length} item(ns) com estoque abaixo do mínimo. Considere fazer novos pedidos.
                      </p>
                    </div>
                  </div>
                  <Link href="/materials">
                    <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

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
        )}
      </div>
    </AuthLayout>
  )
}
