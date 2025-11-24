import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface DeliveryItem {
  id: string
  delivery_id: string
  material_id: string
  material_name: string
  quantity: number
  unit_price: number
  total: number
  created_at: string
}

export interface Delivery {
  id: string
  delivery_number: string
  supplier_id: string
  supplier_name: string
  delivery_date: string
  status: 'pending' | 'received' | 'cancelled'
  total_value: number
  created_at: string
  updated_at: string
  items?: DeliveryItem[]
}

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchDeliveries = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Buscar entregas
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false })

      if (deliveriesError) {
        console.error('Erro ao buscar entregas:', deliveriesError)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as entregas.',
          variant: 'destructive',
        })
        return
      }

      // Buscar itens das entregas
      if (deliveriesData && deliveriesData.length > 0) {
        const deliveryIds = deliveriesData.map(d => d.id)
        const { data: itemsData, error: itemsError } = await supabase
          .from('delivery_items')
          .select('*')
          .in('delivery_id', deliveryIds)

        if (itemsError) {
          console.error('Erro ao buscar itens das entregas:', itemsError)
        }

        // Associar itens às entregas
        const deliveriesWithItems = deliveriesData.map(delivery => ({
          ...delivery,
          items: itemsData?.filter(item => item.delivery_id === delivery.id) || []
        }))

        setDeliveries(deliveriesWithItems)
      } else {
        setDeliveries([])
      }
    } catch (error) {
      console.error('Erro ao buscar entregas:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as entregas.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchDeliveries()
  }, [fetchDeliveries])

  // Gerar número de entrega único
  const generateDeliveryNumber = useCallback(async (): Promise<string> => {
    try {
      // Buscar o maior número de entrega existente
      const { data, error } = await supabase
        .from('deliveries')
        .select('delivery_number')
        .order('delivery_number', { ascending: false })
        .limit(1)

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao buscar última entrega:', error)
      }

      if (data && data.length > 0 && data[0]?.delivery_number) {
        const lastNumberStr = data[0].delivery_number.replace('ENT-', '')
        const lastNumber = parseInt(lastNumberStr, 10)
        
        if (!isNaN(lastNumber)) {
          const newNumber = lastNumber + 1
          return `ENT-${String(newNumber).padStart(6, '0')}`
        }
      }

      // Se não houver entregas anteriores, começar do 1
      return 'ENT-000001'
    } catch (error) {
      console.error('Erro ao gerar número de entrega:', error)
      // Em caso de erro, usar timestamp para garantir unicidade
      const timestamp = Date.now().toString().slice(-8)
      return `ENT-${timestamp}`
    }
  }, [supabase])

  const addDeliveries = useCallback(
    async (deliveriesData: Array<Omit<Delivery, 'id' | 'delivery_number' | 'created_at' | 'updated_at' | 'items'> & { items: Omit<DeliveryItem, 'id' | 'delivery_id' | 'created_at'>[] }>) => {
      try {
        // Buscar nomes dos fornecedores
        const supplierIds = [...new Set(deliveriesData.map(d => d.supplier_id))]
        const { data: suppliersData } = await supabase
          .from('suppliers')
          .select('id, name')
          .in('id', supplierIds)

        const suppliersMap = new Map(suppliersData?.map(s => [s.id, s.name]) || [])

        // Gerar todos os números de entrega de uma vez para evitar duplicatas
        let lastDeliveryNumber = 'ENT-000000'
        try {
          const { data } = await supabase
            .from('deliveries')
            .select('delivery_number')
            .order('delivery_number', { ascending: false })
            .limit(1)
          
          if (data && data.length > 0 && data[0]?.delivery_number) {
            lastDeliveryNumber = data[0].delivery_number
          }
        } catch (error) {
          console.error('Erro ao buscar último número de entrega:', error)
        }
        
        // Extrair o número base
        const lastNumberStr = lastDeliveryNumber.replace('ENT-', '')
        let baseNumber = parseInt(lastNumberStr, 10)
        if (isNaN(baseNumber)) {
          baseNumber = 0
        }
        
        // Preparar dados para inserção
        const deliveriesToInsert = deliveriesData.map((deliveryData, index) => {
          const newNumber = baseNumber + index + 1
          const deliveryNumber = `ENT-${String(newNumber).padStart(6, '0')}`
          
          return {
            delivery_number: deliveryNumber,
            supplier_id: deliveryData.supplier_id,
            supplier_name: suppliersMap.get(deliveryData.supplier_id) || 'Fornecedor não encontrado',
            delivery_date: deliveryData.delivery_date,
            status: deliveryData.status || 'pending',
            total_value: deliveryData.total_value || 0,
            items: deliveryData.items,
          }
        })

        // Inserir entregas
        const { data: insertedDeliveries, error: deliveriesError } = await supabase
          .from('deliveries')
          .insert(deliveriesToInsert.map(({ items, ...delivery }) => delivery))
          .select()

        if (deliveriesError) {
          console.error('Erro ao criar entregas:', {
            message: deliveriesError.message,
            details: deliveriesError.details,
            hint: deliveriesError.hint,
            code: deliveriesError.code,
            error: deliveriesError
          })
          toast({
            title: 'Erro',
            description: `Não foi possível criar as entregas: ${deliveriesError.message || deliveriesError.code || 'Erro desconhecido'}`,
            variant: 'destructive',
          })
          throw deliveriesError
        }

        // Inserir itens de todas as entregas
        const allItems: Array<Omit<DeliveryItem, 'id'>> = []
        for (const [index, delivery] of (insertedDeliveries || []).entries()) {
          const originalDeliveryData = deliveriesToInsert[index]
          for (const item of originalDeliveryData.items) {
            allItems.push({
              delivery_id: delivery.id,
              material_id: item.material_id,
              material_name: item.material_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total: item.total,
            })
          }
        }

        if (allItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('delivery_items')
            .insert(allItems)

          if (itemsError) {
            console.error('Erro ao criar itens das entregas:', {
              message: itemsError.message,
              details: itemsError.details,
              hint: itemsError.hint,
              code: itemsError.code,
              error: itemsError
            })
            // Tentar excluir as entregas criadas
            const deliveryIds = (insertedDeliveries || []).map(d => d.id)
            await supabase.from('deliveries').delete().in('id', deliveryIds)
            toast({
              title: 'Erro',
              description: `Não foi possível criar os itens das entregas: ${itemsError.message || 'Erro desconhecido'}`,
              variant: 'destructive',
            })
            throw itemsError
          }
        }

        // Criar entradas correspondentes para cada entrega
        // Buscar materiais para obter unidades
        const materialIds = [...new Set(allItems.map(item => item.material_id))]
        const { data: materialsData } = await supabase
          .from('materials')
          .select('id, unit')
          .in('id', materialIds)

        const materialsMap = new Map(materialsData?.map(m => [m.id, m.unit]) || [])

        // Criar entradas para cada item de cada entrega
        const entriesToInsert = []
        for (const [index, delivery] of (insertedDeliveries || []).entries()) {
          const originalDeliveryData = deliveriesToInsert[index]
          const supplierName = suppliersMap.get(delivery.supplier_id) || 'Fornecedor não encontrado'
          
          for (const item of originalDeliveryData.items) {
            const unit = materialsMap.get(item.material_id) || 'un'
            entriesToInsert.push({
              material_id: item.material_id,
              material_name: item.material_name,
              quantity: item.quantity,
              unit: unit,
              unit_price: item.unit_price,
              supplier_id: delivery.supplier_id,
              supplier_name: supplierName,
              reason: `Entrega ${delivery.delivery_number}`,
              responsible: supplierName,
              entry_date: delivery.delivery_date,
            })
          }
        }

        // Inserir todas as entradas
        if (entriesToInsert.length > 0) {
          const { error: entriesError } = await supabase
            .from('entries')
            .insert(entriesToInsert)

          if (entriesError) {
            console.error('Erro ao criar entradas das entregas:', entriesError)
            // Não falhar as entregas se as entradas falharem, apenas logar o erro
            // Mas vamos tentar excluir as entregas criadas para manter consistência
            const deliveryIds = (insertedDeliveries || []).map(d => d.id)
            await supabase.from('delivery_items').delete().in('delivery_id', deliveryIds)
            await supabase.from('deliveries').delete().in('id', deliveryIds)
            toast({
              title: 'Erro',
              description: `Não foi possível criar as entradas das entregas: ${entriesError.message || 'Erro desconhecido'}`,
              variant: 'destructive',
            })
            throw entriesError
          } else {
            // Disparar eventos para atualizar o estoque dos materiais afetados
            const materialIdsSet = new Set(materialIds)
            materialIdsSet.forEach(materialId => {
              window.dispatchEvent(new CustomEvent('materialUpdated', {
                detail: { materialId }
              }))
            })
          }
        }

        // Recarregar entregas
        await fetchDeliveries()

        toast({
          title: 'Sucesso',
          description: `${deliveriesData.length} entrega(s) criada(s) com sucesso.`,
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchDeliveries]
  )

  const updateDelivery = useCallback(
    async (id: string, deliveryData: Partial<Omit<Delivery, 'id' | 'delivery_number' | 'created_at' | 'updated_at' | 'items'>>) => {
      try {
        const { data, error } = await supabase
          .from('deliveries')
          .update(deliveryData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar entrega:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar a entrega.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          await fetchDeliveries()
          toast({
            title: 'Sucesso',
            description: 'Entrega atualizada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchDeliveries]
  )

  const deleteDelivery = useCallback(
    async (id: string) => {
      try {
        // Buscar a entrega para obter o número da entrega
        const { data: delivery, error: fetchError } = await supabase
          .from('deliveries')
          .select('delivery_number')
          .eq('id', id)
          .single()

        if (fetchError) {
          console.error('Erro ao buscar entrega:', fetchError)
          toast({
            title: 'Erro',
            description: 'Não foi possível encontrar a entrega.',
            variant: 'destructive',
          })
          throw fetchError
        }

        // Buscar os materiais dos itens da entrega ANTES de excluir
        // para poder disparar eventos de atualização do estoque
        const { data: deliveryItems } = await supabase
          .from('delivery_items')
          .select('material_id')
          .eq('delivery_id', id)

        // Excluir entradas relacionadas à entrega
        if (delivery?.delivery_number) {
          const { error: entriesError } = await supabase
            .from('entries')
            .delete()
            .like('reason', `Entrega ${delivery.delivery_number}`)

          if (entriesError) {
            console.error('Erro ao excluir entradas da entrega:', entriesError)
            // Não falhar a exclusão se as entradas não forem encontradas, apenas logar
          } else {
            // Disparar eventos para atualizar o estoque dos materiais afetados
            // O trigger do banco já atualizou o estoque ao excluir as entradas
            if (deliveryItems) {
              const materialIds = new Set(deliveryItems.map(item => item.material_id))
              materialIds.forEach(materialId => {
                window.dispatchEvent(new CustomEvent('materialUpdated', {
                  detail: { materialId }
                }))
              })
            }
          }
        }

        // Excluir itens primeiro (devido à foreign key)
        const { error: itemsError } = await supabase
          .from('delivery_items')
          .delete()
          .eq('delivery_id', id)

        if (itemsError) {
          console.error('Erro ao excluir itens da entrega:', itemsError)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir os itens da entrega.',
            variant: 'destructive',
          })
          throw itemsError
        }

        // Excluir entrega
        const { error } = await supabase
          .from('deliveries')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Erro ao excluir entrega:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir a entrega.',
            variant: 'destructive',
          })
          throw error
        }

        await fetchDeliveries()
        toast({
          title: 'Sucesso',
          description: 'Entrega e entradas relacionadas excluídas com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchDeliveries]
  )

  return {
    deliveries,
    isLoading,
    addDeliveries,
    updateDelivery,
    deleteDelivery,
    refreshDeliveries: fetchDeliveries,
  }
}

