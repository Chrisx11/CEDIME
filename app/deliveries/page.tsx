'use client'

import { useState, useMemo } from 'react'
import { Delivery } from '@/lib/data-context'
import { useDeliveries, Delivery as DeliveryType } from '@/hooks/use-deliveries'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { DeliveryWizard } from '@/components/deliveries/delivery-wizard'
import { DeliveryTable } from '@/components/deliveries/delivery-table'
import { useToast } from '@/hooks/use-toast'

// Função para converter Delivery do Supabase para o formato esperado pelos componentes
function convertDelivery(delivery: DeliveryType): Delivery {
  return {
    id: delivery.id,
    deliveryNumber: delivery.delivery_number,
    supplier: delivery.supplier_id,
    deliveryDate: delivery.delivery_date,
    status: delivery.status,
    items: delivery.items?.map(item => ({
      materialId: item.material_id,
      materialName: item.material_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total,
    })) || [],
    totalValue: delivery.total_value,
    createdAt: delivery.created_at,
  }
}

export default function DeliveriesPage() {
  const { deliveries: supabaseDeliveries, addDeliveries, deleteDelivery, updateDelivery, isLoading } = useDeliveries()
  const { toast } = useToast()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Converter entregas do Supabase para o formato esperado
  const deliveries = useMemo(() => {
    return supabaseDeliveries.map(convertDelivery)
  }, [supabaseDeliveries])

  const handleWizardSubmit = async (deliveriesData: Array<{
    supplier: string
    deliveryDate: string
    status: 'pending' | 'received' | 'cancelled'
    items: Array<{
      materialId: string
      materialName: string
      quantity: number
      unitPrice: number
      total: number
    }>
    totalValue: number
  }>) => {
    try {
      // Converter para o formato do Supabase
      // Garantir que a data está no formato correto (YYYY-MM-DD) e somar +1 dia
      const supabaseDeliveriesData = deliveriesData.map(delivery => {
        // Garantir que deliveryDate está no formato YYYY-MM-DD
        let deliveryDate = delivery.deliveryDate
        if (deliveryDate.includes('T')) {
          deliveryDate = deliveryDate.split('T')[0]
        }
        
        // Somar +1 dia para corrigir o problema de timezone
        const date = new Date(deliveryDate)
        date.setDate(date.getDate() + 1)
        const correctedDate = date.toISOString().split('T')[0]
        
        return {
          supplier_id: delivery.supplier,
          supplier_name: '', // Será preenchido pelo hook
          delivery_date: correctedDate,
          status: delivery.status,
          total_value: delivery.totalValue,
          items: delivery.items.map(item => ({
            material_id: item.materialId,
            material_name: item.materialName,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total: item.total,
          })),
        }
      })

      await addDeliveries(supabaseDeliveriesData)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDelivery(id)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleUpdateStatus = async (id: string, status: 'pending' | 'received' | 'cancelled') => {
    try {
      await updateDelivery(id, { status })
      const statusLabels: Record<string, string> = {
        pending: 'Pendente',
        received: 'Recebida',
        cancelled: 'Cancelada'
      }
      toast({
        title: 'Status atualizado',
        description: `O status da entrega foi alterado para "${statusLabels[status]}".`,
      })
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <div className="flex gap-2 mb-6 justify-end">
          <Button 
            onClick={() => setIsWizardOpen(true)} 
            className="bg-primary hover:bg-primary/90 font-medium"
          >
            Nova Entrega
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando entregas...</p>
          </div>
        ) : (
          <DeliveryTable
            deliveries={deliveries}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>

      <DeliveryWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleWizardSubmit}
      />
    </AuthLayout>
  )
}

