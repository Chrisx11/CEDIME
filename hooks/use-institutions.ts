import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Institution {
  id: string
  name: string
  phone?: string | null
  city: string
  state: string
  principal_name: string
  status: 'active' | 'inactive'
  created_at: string
}

export function useInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchInstitutions = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar instituições:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as instituições.',
          variant: 'destructive',
        })
        return
      }

      setInstitutions(data || [])
    } catch (error) {
      console.error('Erro ao buscar instituições:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as instituições.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchInstitutions()
  }, [fetchInstitutions])

  const addInstitution = useCallback(
    async (institutionData: Omit<Institution, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('institutions')
          .insert([institutionData])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar instituição:', error)
          console.error('Dados enviados:', institutionData)
          const errorMessage = error.message || error.details || error.hint || 'Não foi possível criar a instituição.'
          toast({
            title: 'Erro',
            description: errorMessage,
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setInstitutions((prev) => [data, ...prev])
          toast({
            title: 'Sucesso',
            description: 'Instituição criada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const updateInstitution = useCallback(
    async (id: string, institutionData: Partial<Omit<Institution, 'id' | 'created_at'>>) => {
      try {
        const { data, error } = await supabase
          .from('institutions')
          .update(institutionData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar instituição:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar a instituição.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setInstitutions((prev) =>
            prev.map((institution) => (institution.id === id ? data : institution))
          )
          toast({
            title: 'Sucesso',
            description: 'Instituição atualizada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const deleteInstitution = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('institutions').delete().eq('id', id)

        if (error) {
          console.error('Erro ao excluir instituição:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir a instituição.',
            variant: 'destructive',
          })
          throw error
        }

        setInstitutions((prev) => prev.filter((institution) => institution.id !== id))
        toast({
          title: 'Sucesso',
          description: 'Instituição excluída com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  return {
    institutions,
    isLoading,
    addInstitution,
    updateInstitution,
    deleteInstitution,
    refreshInstitutions: fetchInstitutions,
  }
}

