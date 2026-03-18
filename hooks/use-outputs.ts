import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Output {
  id: string
  material_id: string
  material_name: string
  quantity: number
  unit: string
  institution_id?: string | null
  institution_name?: string | null
  reason: string
  responsible: string
  output_date: string
  created_at: string
}

export function useOutputs() {
  const [outputs, setOutputs] = useState<Output[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [fetchAll, setFetchAll] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchOutputs = useCallback(async () => {
    try {
      setIsLoading(true)
      // Quando fetchAll=true (modo filtro), precisamos evitar o limite padrão (~1000).
      // Então buscamos em páginas de 1000 e concatenamos.
      if (fetchAll) {
        const chunkSize = 1000
        let from = 0
        let all: Output[] = []
        let total: number | null = null

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const to = from + chunkSize - 1
          const { data, error, count } = await supabase
            .from('outputs')
            .select('*', { count: 'exact' })
            .order('output_date', { ascending: false })
            .order('created_at', { ascending: false })
            .range(from, to)

          if (error) {
            console.error('Erro ao buscar saídas:', error)
            toast({
              title: 'Erro',
              description: 'Não foi possível carregar as saídas.',
              variant: 'destructive',
            })
            return
          }

          if (typeof count === 'number') total = count
          const chunk = (data || []) as Output[]
          all = all.concat(chunk)

          if (chunk.length < chunkSize) break
          from += chunkSize
        }

        setOutputs(all)
        setTotalCount(typeof total === 'number' ? total : all.length)
        return
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await supabase
        .from('outputs')
        .select('*', { count: 'exact' })
        .order('output_date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Erro ao buscar saídas:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as saídas.',
          variant: 'destructive',
        })
        return
      }

      setOutputs(data || [])
      setTotalCount(typeof count === 'number' ? count : 0)
    } catch (error) {
      console.error('Erro ao buscar saídas:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as saídas.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast, page, pageSize, fetchAll])

  useEffect(() => {
    fetchOutputs()
  }, [fetchOutputs])

  const addOutput = useCallback(
    async (outputData: Omit<Output, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('outputs')
          .insert([outputData])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar saída:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar a saída.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          // Em paginação, recarregar a página atual para refletir ordenação e total
          await fetchOutputs()

          // Disparar evento para atualizar a UI (o trigger do banco já atualizou o estoque)
          window.dispatchEvent(new CustomEvent('materialUpdated', {
            detail: { materialId: outputData.material_id },
          }))

          toast({
            title: 'Sucesso',
            description: 'Saída criada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchOutputs]
  )

  const updateOutput = useCallback(
    async (id: string, outputData: Partial<Omit<Output, 'id' | 'created_at'>>) => {
      try {
        // Buscar a saída antiga para saber qual material atualizar
        const { data: oldOutput } = await supabase
          .from('outputs')
          .select('material_id')
          .eq('id', id)
          .single()

        const { data, error } = await supabase
          .from('outputs')
          .update(outputData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar saída:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar a saída.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          // Em paginação, recarregar a página atual para refletir ordenação e dados
          await fetchOutputs()
          
          // Disparar eventos para atualizar a UI (o trigger do banco já atualizou o estoque)
          const oldMaterialId = oldOutput?.material_id
          const newMaterialId = outputData.material_id || data.material_id
          
          // Se o material mudou, atualizar ambos (antigo e novo)
          if (oldMaterialId && oldMaterialId !== newMaterialId) {
            window.dispatchEvent(new CustomEvent('materialUpdated', { detail: { materialId: oldMaterialId } }))
          }
          
          // Atualizar o material (novo ou atualizado)
          if (newMaterialId) {
            window.dispatchEvent(new CustomEvent('materialUpdated', { detail: { materialId: newMaterialId } }))
          }
          
          toast({
            title: 'Sucesso',
            description: 'Saída atualizada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchOutputs]
  )

  const deleteOutput = useCallback(
    async (id: string) => {
      try {
        // Buscar a saída antes de excluir para saber qual material atualizar
        const { data: outputToDelete } = await supabase
          .from('outputs')
          .select('material_id')
          .eq('id', id)
          .single()

        const { error } = await supabase.from('outputs').delete().eq('id', id)

        if (error) {
          console.error('Erro ao excluir saída:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir a saída.',
            variant: 'destructive',
          })
          throw error
        }

        // Em paginação, recarregar a página atual para refletir total e lista
        await fetchOutputs()
        
        // Disparar evento para atualizar a UI (o trigger do banco já atualizou o estoque)
        if (outputToDelete?.material_id) {
          window.dispatchEvent(new CustomEvent('materialUpdated', { 
            detail: { materialId: outputToDelete.material_id } 
          }))
        }
        
        toast({
          title: 'Sucesso',
          description: 'Saída excluída com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchOutputs]
  )

  return {
    outputs,
    isLoading,
    totalCount,
    page,
    pageSize,
    setPage,
    setPageSize,
    fetchAll,
    setFetchAll,
    addOutput,
    updateOutput,
    deleteOutput,
    refreshOutputs: fetchOutputs,
  }
}

