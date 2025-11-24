import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Material {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  min_quantity: number
  unit_price: number
  last_update: string
}

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchMaterials = useCallback(async () => {
    try {
      setIsLoading(true)
      // Adicionar timestamp para evitar cache
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Erro ao buscar materiais:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os materiais.',
          variant: 'destructive',
        })
        return
      }

      console.log('Materiais carregados:', data)
      setMaterials(data || [])
    } catch (error) {
      console.error('Erro ao buscar materiais:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os materiais.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchMaterials()
    
    // Escutar eventos de atualização de material para recarregar os dados
    const handleMaterialUpdate = (event?: CustomEvent) => {
      console.log('Evento materialUpdated recebido, recarregando materiais...', event?.detail)
      // Adicionar um pequeno delay para garantir que o banco atualizou
      setTimeout(() => {
        fetchMaterials()
      }, 100)
    }
    
    window.addEventListener('materialUpdated', handleMaterialUpdate)
    
    return () => {
      window.removeEventListener('materialUpdated', handleMaterialUpdate)
    }
  }, [fetchMaterials])

  const addMaterial = useCallback(
    async (materialData: Omit<Material, 'id' | 'last_update'>) => {
      try {
        const { data, error } = await supabase
          .from('materials')
          .insert([materialData])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar material:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar o material.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setMaterials((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
          toast({
            title: 'Sucesso',
            description: 'Material criado com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const updateMaterial = useCallback(
    async (id: string, materialData: Partial<Omit<Material, 'id' | 'last_update'>>) => {
      try {
        const { data, error } = await supabase
          .from('materials')
          .update({
            ...materialData,
            last_update: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar material:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar o material.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setMaterials((prev) =>
            prev.map((material) => (material.id === id ? data : material))
          )
          toast({
            title: 'Sucesso',
            description: 'Material atualizado com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const deleteMaterial = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('materials').delete().eq('id', id)

        if (error) {
          console.error('Erro ao excluir material:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir o material.',
            variant: 'destructive',
          })
          throw error
        }

        setMaterials((prev) => prev.filter((material) => material.id !== id))
        toast({
          title: 'Sucesso',
          description: 'Material excluído com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  return {
    materials,
    isLoading,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    refreshMaterials: fetchMaterials,
  }
}

