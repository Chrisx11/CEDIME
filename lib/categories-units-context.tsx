'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  name: string
  created_at: string
  updated_at: string
}

interface CategoriesUnitsContextType {
  categories: Category[]
  units: Unit[]
  isLoadingCategories: boolean
  isLoadingUnits: boolean
  addCategory: (name: string) => Promise<void>
  updateCategory: (id: string, name: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addUnit: (name: string) => Promise<void>
  updateUnit: (id: string, name: string) => Promise<void>
  deleteUnit: (id: string) => Promise<void>
  refreshCategories: () => Promise<void>
  refreshUnits: () => Promise<void>
}

const CategoriesUnitsContext = createContext<CategoriesUnitsContextType | undefined>(undefined)

export function CategoriesUnitsProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingUnits, setIsLoadingUnits] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true)
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
      setIsLoadingCategories(false)
    }
  }, [supabase, toast])

  const fetchUnits = useCallback(async () => {
    try {
      setIsLoadingUnits(true)
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
      setIsLoadingUnits(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchCategories()
    fetchUnits()
  }, [fetchCategories, fetchUnits])

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

  return (
    <CategoriesUnitsContext.Provider
      value={{
        categories,
        units,
        isLoadingCategories,
        isLoadingUnits,
        addCategory,
        updateCategory,
        deleteCategory,
        addUnit,
        updateUnit,
        deleteUnit,
        refreshCategories: fetchCategories,
        refreshUnits: fetchUnits,
      }}
    >
      {children}
    </CategoriesUnitsContext.Provider>
  )
}

export function useCategoriesUnits() {
  const context = useContext(CategoriesUnitsContext)
  if (context === undefined) {
    throw new Error('useCategoriesUnits must be used within a CategoriesUnitsProvider')
  }
  return context
}

