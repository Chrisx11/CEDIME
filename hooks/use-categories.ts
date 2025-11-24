import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Erro ao buscar categorias:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as categorias.',
          variant: 'destructive',
        })
        return
      }

      setCategories(data || [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as categorias.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = useCallback(
    async (name: string) => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([{ name: name.trim() }])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar categoria:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar a categoria.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
          toast({
            title: 'Sucesso',
            description: 'Categoria criada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const updateCategory = useCallback(
    async (id: string, name: string) => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .update({ name: name.trim() })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar categoria:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar a categoria.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setCategories((prev) =>
            prev.map((category) => (category.id === id ? data : category)).sort((a, b) => a.name.localeCompare(b.name))
          )
          toast({
            title: 'Sucesso',
            description: 'Categoria atualizada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id)

        if (error) {
          console.error('Erro ao excluir categoria:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir a categoria.',
            variant: 'destructive',
          })
          throw error
        }

        setCategories((prev) => prev.filter((category) => category.id !== id))
        toast({
          title: 'Sucesso',
          description: 'Categoria excluída com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  }
}

