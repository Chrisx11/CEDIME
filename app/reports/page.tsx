'use client'

import { useData } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { StatsCards } from '@/components/reports/stats-cards'
import { Charts } from '@/components/reports/charts'
import { StockAnalysis } from '@/components/reports/stock-analysis'
import { PageHeader } from '@/components/page-header'

export default function ReportsPage() {
  const { suppliers, institutions, materials, requests } = useData()

  const lowStockItems = materials.filter(m => m.quantity <= m.minQuantity)
  const deliveredRequests = requests.filter(r => r.status === 'delivered')
  const totalStockValue = materials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0)
  const totalRequisitionValue = requests.reduce((acc, r) => acc + r.totalValue, 0)

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <PageHeader
          title="Relatórios e Análises"
          description="Painel inteligente com insights sobre sua operação de distribuição"
        />

        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards
            totalSuppliers={suppliers.length}
            totalInstitutions={institutions.length}
            totalMaterials={materials.length}
            lowStockItems={lowStockItems.length}
            totalRequests={requests.length}
            deliveredRequests={deliveredRequests.length}
            totalStockValue={totalStockValue}
            totalRequisitionValue={totalRequisitionValue}
          />

          {/* Charts */}
          <Charts materials={materials} requests={requests} />

          {/* Stock Analysis */}
          <StockAnalysis materials={materials} />
        </div>
      </div>
    </AuthLayout>
  )
}
