'use client'

import { Card } from '@/components/ui/card'
import { Building2, School, Package, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react'

interface StatsCardsProps {
  totalSuppliers: number
  totalInstitutions: number
  totalMaterials: number
  lowStockItems: number
  totalRequests: number
  deliveredRequests: number
  totalStockValue: number
  totalRequisitionValue: number
}

export function StatsCards({
  totalSuppliers,
  totalInstitutions,
  totalMaterials,
  lowStockItems,
  totalRequests,
  deliveredRequests,
  totalStockValue,
  totalRequisitionValue
}: StatsCardsProps) {
  const stats = [
    { label: 'Fornecedores Cadastrados', value: totalSuppliers, color: 'primary', icon: Building2 },
    { label: 'Instituições Ativas', value: totalInstitutions, color: 'secondary', icon: School },
    { label: 'Itens em Estoque', value: totalMaterials, color: 'accent', icon: Package },
    { label: 'Itens com Estoque Baixo', value: lowStockItems, color: 'destructive', icon: AlertTriangle },
    { label: 'Total de Requisições', value: totalRequests, color: 'primary', icon: FileText },
    { label: 'Requisições Entregues', value: deliveredRequests, color: 'secondary', icon: CheckCircle2 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        const colorClass = stat.color === 'primary' 
          ? 'border-primary/20 hover:border-primary/40' 
          : stat.color === 'secondary' 
          ? 'border-secondary/20 hover:border-secondary/40'
          : stat.color === 'accent' 
          ? 'border-accent/20 hover:border-accent/40'
          : 'border-destructive/20 hover:border-destructive/40 bg-destructive/5'
        
        const iconColorClass = stat.color === 'primary' 
          ? 'text-primary/60' 
          : stat.color === 'secondary' 
          ? 'text-secondary/60'
          : stat.color === 'accent' 
          ? 'text-accent/60'
          : 'text-destructive/70'
        
        return (
          <Card key={idx} className={`p-5 border transition-colors ${colorClass}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">{stat.label}</div>
                <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              </div>
              <Icon className={`h-5 w-5 ${iconColorClass} flex-shrink-0`} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
