import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Unit {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export function useUnits() {
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchUnits = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Erro ao buscar unidades:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as unidades.',
          variant: 'destructive',
        })
        return
      }

      setUnits(data || [])
    } catch (error) {
      console.error('Erro ao buscar unidades:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as unidades.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  const addUnit = useCallback(
    async (name: string) => {
      try {
        const { data, error } = await supabase
          .from('units')
          .insert([{ name: name.trim() }])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar unidade:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar a unidade.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setUnits((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
          toast({
            title: 'Sucesso',
            description: 'Unidade criada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const updateUnit = useCallback(
    async (id: string, name: string) => {
      try {
        const { data, error } = await supabase
          .from('units')
          .update({ name: name.trim() })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar unidade:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar a unidade.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setUnits((prev) =>
            prev.map((unit) => (unit.id === id ? data : unit)).sort((a, b) => a.name.localeCompare(b.name))
          )
          toast({
            title: 'Sucesso',
            description: 'Unidade atualizada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const deleteUnit = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('units').delete().eq('id', id)

        if (error) {
          console.error('Erro ao excluir unidade:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir a unidade.',
            variant: 'destructive',
          })
          throw error
        }

        setUnits((prev) => prev.filter((unit) => unit.id !== id))
        toast({
          title: 'Sucesso',
          description: 'Unidade excluída com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  return {
    units,
    isLoading,
    addUnit,
    updateUnit,
    deleteUnit,
    refreshUnits: fetchUnits,
  }
}

