import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Entry {
  id: string
  material_id: string
  material_name: string
  quantity: number
  unit: string
  unit_price: number
  supplier_id?: string
  supplier_name?: string
  reason: string
  responsible: string
  entry_date: string
  created_at: string
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar entradas:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as entradas.',
          variant: 'destructive',
        })
        return
      }

      setEntries(data || [])
    } catch (error) {
      console.error('Erro ao buscar entradas:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as entradas.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Função para atualizar estoque e preço médio do material
  const updateMaterialStockAndPrice = useCallback(
    async (materialId: string) => {
      try {
        console.log('Iniciando atualização do material:', materialId)
        
        // Buscar todas as entradas do material
        const { data: materialEntries, error: entriesError } = await supabase
          .from('entries')
          .select('quantity, unit_price')
          .eq('material_id', materialId)

        if (entriesError) {
          console.error('Erro ao buscar entradas do material:', entriesError)
          return
        }

        console.log('Entradas encontradas:', materialEntries)

        // Buscar todas as saídas do material (se houver tabela de outputs/deliveries)
        let materialOutputs: any[] = []
        try {
          const { data: outputsData, error: outputsError } = await supabase
            .from('outputs')
            .select('quantity')
            .eq('material_id', materialId)
          
          if (!outputsError && outputsData) {
            materialOutputs = outputsData
          }
        } catch (error) {
          // Se a tabela não existir, continuar com array vazio
          console.log('Tabela outputs não encontrada, continuando sem saídas')
        }

        // Calcular estoque: soma das entradas - soma das saídas
        const totalEntries = materialEntries?.reduce((sum, e) => sum + Number(e.quantity), 0) || 0
        const totalOutputs = materialOutputs?.reduce((sum, o) => sum + Number(o.quantity), 0) || 0
        const newQuantity = totalEntries - totalOutputs

        console.log('Cálculo de estoque:', { totalEntries, totalOutputs, newQuantity })

        // Calcular preço médio ponderado: soma(quantidade * preço) / soma(quantidade)
        let averagePrice = 0
        if (materialEntries && materialEntries.length > 0) {
          const totalValue = materialEntries.reduce((sum, e) => sum + (Number(e.quantity) * Number(e.unit_price)), 0)
          const totalQuantity = materialEntries.reduce((sum, e) => sum + Number(e.quantity), 0)
          if (totalQuantity > 0) {
            averagePrice = totalValue / totalQuantity
          }
        }

        console.log('Preço médio calculado:', averagePrice)

        // Atualizar o material e buscar o material atualizado
        const { data: updatedMaterial, error: updateError } = await supabase
          .from('materials')
          .update({
            quantity: Math.max(0, newQuantity),
            unit_price: averagePrice,
            last_update: new Date().toISOString(),
          })
          .eq('id', materialId)
          .select()
          .single()

        if (updateError) {
          console.error('Erro ao atualizar material:', updateError)
          toast({
            title: 'Erro',
            description: `Erro ao atualizar estoque: ${updateError.message}`,
            variant: 'destructive',
          })
        } else if (updatedMaterial) {
          console.log('Material atualizado com sucesso:', updatedMaterial)
          // Disparar um evento customizado para notificar outros componentes
          window.dispatchEvent(new CustomEvent('materialUpdated', { 
            detail: { materialId, material: updatedMaterial } 
          }))
        } else {
          console.error('Material não foi atualizado - nenhum dado retornado')
        }
      } catch (error) {
        console.error('Erro ao atualizar estoque e preço do material:', error)
        toast({
          title: 'Erro',
          description: `Erro ao atualizar estoque: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          variant: 'destructive',
        })
      }
    },
    [supabase, toast]
  )

  const addEntry = useCallback(
    async (entryData: Omit<Entry, 'id' | 'created_at'>) => {
      try {
        // Inserir a entrada
        const { data, error } = await supabase
          .from('entries')
          .insert([entryData])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar entrada:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar a entrada.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setEntries((prev) => [data, ...prev])
          
          // Atualizar o material: estoque e preço médio
          try {
            await updateMaterialStockAndPrice(entryData.material_id)
          } catch (updateError) {
            console.error('Erro ao atualizar material após criar entrada:', updateError)
          }
          
          toast({
            title: 'Sucesso',
            description: 'Entrada criada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, updateMaterialStockAndPrice]
  )

  const updateEntry = useCallback(
    async (id: string, entryData: Partial<Omit<Entry, 'id' | 'created_at'>>) => {
      try {
        // Buscar a entrada antiga para saber qual material atualizar
        const { data: oldEntry } = await supabase
          .from('entries')
          .select('material_id')
          .eq('id', id)
          .single()

        const { data, error } = await supabase
          .from('entries')
          .update(entryData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar entrada:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar a entrada.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setEntries((prev) =>
            prev.map((entry) => (entry.id === id ? data : entry))
          )
          
          // Atualizar o material: estoque e preço médio
          // Se o material mudou, atualizar ambos (antigo e novo)
          const oldMaterialId = oldEntry?.material_id
          const newMaterialId = entryData.material_id || data.material_id
          
          // Atualizar o material antigo se mudou
          if (oldMaterialId && oldMaterialId !== newMaterialId) {
            await updateMaterialStockAndPrice(oldMaterialId)
          }
          
          // Atualizar o material (novo ou atualizado)
          if (newMaterialId) {
            await updateMaterialStockAndPrice(newMaterialId)
          }
          
          toast({
            title: 'Sucesso',
            description: 'Entrada atualizada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, updateMaterialStockAndPrice]
  )

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        // Buscar a entrada antes de excluir para saber qual material atualizar
        const { data: entryToDelete } = await supabase
          .from('entries')
          .select('material_id')
          .eq('id', id)
          .single()

        const { error } = await supabase.from('entries').delete().eq('id', id)

        if (error) {
          console.error('Erro ao excluir entrada:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir a entrada.',
            variant: 'destructive',
          })
          throw error
        }

        setEntries((prev) => prev.filter((entry) => entry.id !== id))
        
        // Atualizar o material: estoque e preço médio
        if (entryToDelete?.material_id) {
          await updateMaterialStockAndPrice(entryToDelete.material_id)
        }
        
        toast({
          title: 'Sucesso',
          description: 'Entrada excluída com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, updateMaterialStockAndPrice]
  )

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: fetchEntries,
  }
}

