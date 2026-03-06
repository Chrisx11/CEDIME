import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Supplier {
  id: string
  name: string
  cnpj: string
  phone: string
  city: string
  state: string
  status: 'active' | 'inactive'
  created_at: string
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar fornecedores:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os fornecedores.',
          variant: 'destructive',
        })
        return
      }

      setSuppliers(data || [])
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os fornecedores.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const addSupplier = useCallback(
    async (supplierData: Omit<Supplier, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .insert([supplierData])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar fornecedor:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar o fornecedor.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setSuppliers((prev) => [data, ...prev])
          toast({
            title: 'Sucesso',
            description: 'Fornecedor criado com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const updateSupplier = useCallback(
    async (id: string, supplierData: Partial<Omit<Supplier, 'id' | 'created_at'>>) => {
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .update(supplierData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar fornecedor:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar o fornecedor.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          setSuppliers((prev) =>
            prev.map((supplier) => (supplier.id === id ? data : supplier))
          )
          toast({
            title: 'Sucesso',
            description: 'Fornecedor atualizado com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  const deleteSupplier = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from('suppliers').delete().eq('id', id)

        if (error) {
          console.error('Erro ao excluir fornecedor:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir o fornecedor.',
            variant: 'destructive',
          })
          throw error
        }

        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
        toast({
          title: 'Sucesso',
          description: 'Fornecedor excluído com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast]
  )

  return {
    suppliers,
    isLoading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers: fetchSuppliers,
  }
}

