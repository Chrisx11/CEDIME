import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface RequestItem {
  id: string
  request_id: string
  material_id: string
  material_name: string
  quantity: number
  unit_price: number
  total: number
}

export interface Request {
  id: string
  request_number: string
  institution_id: string
  institution_name: string
  required_date: string
  status: 'pending' | 'approved' | 'delivered' | 'cancelled'
  total_value: number
  created_at: string
  updated_at: string
  items?: RequestItem[]
}

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Buscar requisições
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (requestsError) {
        console.error('Erro ao buscar requisições:', requestsError)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as requisições.',
          variant: 'destructive',
        })
        return
      }

      // Buscar itens das requisições
      if (requestsData && requestsData.length > 0) {
        const requestIds = requestsData.map(r => r.id)
        const { data: itemsData, error: itemsError } = await supabase
          .from('request_items')
          .select('*')
          .in('request_id', requestIds)

        if (itemsError) {
          console.error('Erro ao buscar itens das requisições:', itemsError)
        }

        // Associar itens às requisições
        const requestsWithItems = requestsData.map(request => ({
          ...request,
          items: itemsData?.filter(item => item.request_id === request.id) || []
        }))

        setRequests(requestsWithItems)
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error('Erro ao buscar requisições:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as requisições.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, toast])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Gerar número de requisição único
  const generateRequestNumber = useCallback(async (): Promise<string> => {
    try {
      // Buscar o maior número de requisição existente
      const { data, error } = await supabase
        .from('requests')
        .select('request_number')
        .order('request_number', { ascending: false })
        .limit(1)

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao buscar última requisição:', error)
      }

      if (data && data.length > 0 && data[0]?.request_number) {
        const lastNumberStr = data[0].request_number.replace('REQ-', '')
        const lastNumber = parseInt(lastNumberStr, 10)
        
        if (!isNaN(lastNumber)) {
          const newNumber = lastNumber + 1
          return `REQ-${String(newNumber).padStart(6, '0')}`
        }
      }

      // Se não houver requisições anteriores, começar do 1
      return 'REQ-000001'
    } catch (error) {
      console.error('Erro ao gerar número de requisição:', error)
      // Em caso de erro, usar timestamp para garantir unicidade
      const timestamp = Date.now().toString().slice(-8)
      return `REQ-${timestamp}`
    }
  }, [supabase])

  const addRequest = useCallback(
    async (requestData: Omit<Request, 'id' | 'request_number' | 'created_at' | 'updated_at' | 'items'> & { items: Omit<RequestItem, 'id' | 'request_id'>[] }) => {
      try {
        const requestNumber = await generateRequestNumber()

        // Criar requisição
        const { data: request, error: requestError } = await supabase
          .from('requests')
          .insert([{
            request_number: requestNumber,
            institution_id: requestData.institution_id,
            institution_name: requestData.institution_name,
            required_date: requestData.required_date,
            status: requestData.status,
            total_value: requestData.total_value,
          }])
          .select()
          .single()

        if (requestError) {
          console.error('Erro ao criar requisição:', requestError)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar a requisição.',
            variant: 'destructive',
          })
          throw requestError
        }

        // Criar itens da requisição
        if (request && requestData.items.length > 0) {
          const itemsToInsert = requestData.items.map(item => ({
            request_id: request.id,
            material_id: item.material_id,
            material_name: item.material_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
          }))

          const { error: itemsError } = await supabase
            .from('request_items')
            .insert(itemsToInsert)

          if (itemsError) {
            console.error('Erro ao criar itens da requisição:', {
              message: itemsError.message,
              details: itemsError.details,
              hint: itemsError.hint,
              code: itemsError.code,
              error: itemsError
            })
            // Tentar excluir a requisição criada
            await supabase.from('requests').delete().eq('id', request.id)
            toast({
              title: 'Erro',
              description: `Não foi possível criar os itens da requisição: ${itemsError.message || 'Erro desconhecido'}`,
              variant: 'destructive',
            })
            throw itemsError
          }

          // Criar saídas automaticamente para cada item da requisição
          const outputsToInsert = []
          for (const item of requestData.items) {
            // Buscar material para obter a unidade
            const { data: material } = await supabase
              .from('materials')
              .select('unit')
              .eq('id', item.material_id)
              .single()

            // Buscar instituição para obter o nome do responsável
            const { data: institution } = await supabase
              .from('institutions')
              .select('principal_name')
              .eq('id', requestData.institution_id)
              .single()

            if (material) {
              outputsToInsert.push({
                material_id: item.material_id,
                material_name: item.material_name,
                quantity: item.quantity,
                unit: material.unit,
                institution_id: requestData.institution_id,
                institution_name: requestData.institution_name,
                reason: `Requisição ${request.request_number}`,
                responsible: institution?.principal_name || 'Sistema',
                output_date: requestData.required_date,
              })
            }
          }

          // Inserir todas as saídas
          if (outputsToInsert.length > 0) {
            const { error: outputsError } = await supabase
              .from('outputs')
              .insert(outputsToInsert)

            if (outputsError) {
              console.error('Erro ao criar saídas da requisição:', outputsError)
              // Não falhar a requisição se a saída falhar, apenas logar o erro
            } else {
              // Disparar eventos para atualizar a UI
              const materialIds = new Set(outputsToInsert.map(o => o.material_id))
              materialIds.forEach(materialId => {
                window.dispatchEvent(new CustomEvent('materialUpdated', { 
                  detail: { materialId } 
                }))
              })
            }
          }
        }

        // Buscar requisição completa com itens
        await fetchRequests()

        toast({
          title: 'Sucesso',
          description: 'Requisição criada com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, generateRequestNumber, fetchRequests]
  )

  const addRequests = useCallback(
    async (requestsData: Array<Omit<Request, 'id' | 'request_number' | 'created_at' | 'updated_at' | 'items'> & { items: Omit<RequestItem, 'id' | 'request_id'>[] }>) => {
      try {
        // Criar todas as requisições em uma transação
        interface RequestToInsert {
          request_number: string
          institution_id: string
          institution_name: string
          required_date: string
          status: 'pending' | 'approved' | 'delivered' | 'cancelled'
          total_value: number
          items: Omit<RequestItem, 'id' | 'request_id'>[]
        }
        
        const requestsToInsert: RequestToInsert[] = []
        
        // Gerar todos os números de requisição de uma vez para evitar duplicatas
        // Buscar o último número uma única vez
        let lastRequestNumber = 'REQ-000000'
        try {
          const { data } = await supabase
            .from('requests')
            .select('request_number')
            .order('request_number', { ascending: false })
            .limit(1)
          
          if (data && data.length > 0 && data[0]?.request_number) {
            lastRequestNumber = data[0].request_number
          }
        } catch (error) {
          console.error('Erro ao buscar último número de requisição:', error)
        }
        
        // Extrair o número base
        const lastNumberStr = lastRequestNumber.replace('REQ-', '')
        let baseNumber = parseInt(lastNumberStr, 10)
        if (isNaN(baseNumber)) {
          baseNumber = 0
        }
        
        // Gerar números sequenciais para todas as requisições
        for (let i = 0; i < requestsData.length; i++) {
          const requestData = requestsData[i]
          
          // Validar dados antes de processar
          if (!requestData.institution_id) {
            throw new Error('ID da instituição é obrigatório')
          }
          if (!requestData.institution_name) {
            throw new Error('Nome da instituição é obrigatório')
          }
          if (!requestData.required_date) {
            throw new Error('Data de entrega é obrigatória')
          }
          if (!requestData.items || requestData.items.length === 0) {
            throw new Error('A requisição deve ter pelo menos um item')
          }
          
          // Gerar número sequencial
          const newNumber = baseNumber + i + 1
          const requestNumber = `REQ-${String(newNumber).padStart(6, '0')}`
          
          requestsToInsert.push({
            request_number: requestNumber,
            institution_id: requestData.institution_id,
            institution_name: requestData.institution_name.trim(),
            required_date: requestData.required_date,
            status: requestData.status || 'pending',
            total_value: requestData.total_value || 0,
            items: requestData.items,
          })
        }

        // Preparar dados para inserção (remover items que não vão na tabela requests)
        const requestsDataToInsert = requestsToInsert.map(({ items, ...req }) => {
          // Garantir que todos os campos obrigatórios estão presentes
          return {
            request_number: req.request_number,
            institution_id: req.institution_id,
            institution_name: req.institution_name,
            required_date: req.required_date,
            status: req.status,
            total_value: Number(req.total_value) || 0,
          }
        })
        
        // Log dos dados antes de inserir (para debug)
        console.log('Dados a serem inseridos:', JSON.stringify(requestsDataToInsert, null, 2))

        // Inserir requisições
        const { data: requests, error: requestsError } = await supabase
          .from('requests')
          .insert(requestsDataToInsert)
          .select()

        if (requestsError) {
          // Log detalhado do erro
          console.error('Erro ao criar requisições - Detalhes completos:', JSON.stringify(requestsError, null, 2))
          console.error('Erro ao criar requisições - Message:', requestsError.message)
          console.error('Erro ao criar requisições - Code:', requestsError.code)
          console.error('Erro ao criar requisições - Details:', requestsError.details)
          console.error('Erro ao criar requisições - Hint:', requestsError.hint)
          console.error('Erro ao criar requisições - Objeto completo:', requestsError)
          
          toast({
            title: 'Erro',
            description: `Não foi possível criar as requisições: ${requestsError.message || requestsError.code || 'Erro desconhecido'}`,
            variant: 'destructive',
          })
          throw requestsError
        }

        // Inserir itens de todas as requisições
        const allItems: Array<Omit<RequestItem, 'id'>> = []
        requests?.forEach((request, index) => {
          const requestData = requestsToInsert[index]
          requestData.items.forEach((item: Omit<RequestItem, 'id' | 'request_id'>) => {
            allItems.push({
              request_id: request.id,
              material_id: item.material_id,
              material_name: item.material_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total: item.total,
            })
          })
        })

        if (allItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('request_items')
            .insert(allItems)

          if (itemsError) {
            console.error('Erro ao criar itens das requisições:', {
              message: itemsError.message,
              details: itemsError.details,
              hint: itemsError.hint,
              code: itemsError.code,
              error: itemsError
            })
            // Tentar excluir as requisições criadas
            const requestIds = requests?.map(r => r.id) || []
            await supabase.from('requests').delete().in('id', requestIds)
            toast({
              title: 'Erro',
              description: `Não foi possível criar os itens das requisições: ${itemsError.message || 'Erro desconhecido'}`,
              variant: 'destructive',
            })
            throw itemsError
          }

          // Criar saídas automaticamente para cada item de cada requisição
          const outputsToInsert = []
          const materialIdsSet = new Set<string>()

          for (let i = 0; i < requests.length; i++) {
            const request = requests[i]
            const requestData = requestsToInsert[i]

            for (const item of requestData.items) {
              // Buscar material para obter a unidade
              const { data: material } = await supabase
                .from('materials')
                .select('unit')
                .eq('id', item.material_id)
                .single()

              // Buscar instituição para obter o nome do responsável
              const { data: institution } = await supabase
                .from('institutions')
                .select('principal_name')
                .eq('id', requestData.institution_id)
                .single()

              if (material) {
                outputsToInsert.push({
                  material_id: item.material_id,
                  material_name: item.material_name,
                  quantity: item.quantity,
                  unit: material.unit,
                  institution_id: requestData.institution_id,
                  institution_name: requestData.institution_name,
                  reason: `Requisição ${request.request_number}`,
                  responsible: institution?.principal_name || 'Sistema',
                  output_date: requestData.required_date,
                })
                materialIdsSet.add(item.material_id)
              }
            }
          }

          // Inserir todas as saídas
          if (outputsToInsert.length > 0) {
            const { error: outputsError } = await supabase
              .from('outputs')
              .insert(outputsToInsert)

            if (outputsError) {
              console.error('Erro ao criar saídas das requisições:', outputsError)
              // Não falhar as requisições se as saídas falharem, apenas logar o erro
            } else {
              // Disparar eventos para atualizar a UI
              materialIdsSet.forEach(materialId => {
                window.dispatchEvent(new CustomEvent('materialUpdated', { 
                  detail: { materialId } 
                }))
              })
            }
          }
        }

        // Recarregar requisições
        await fetchRequests()

        toast({
          title: 'Sucesso',
          description: `${requestsData.length} requisição(ões) criada(s) com sucesso.`,
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, generateRequestNumber, fetchRequests]
  )

  const updateRequest = useCallback(
    async (id: string, requestData: Partial<Omit<Request, 'id' | 'request_number' | 'created_at' | 'updated_at' | 'items'>>) => {
      try {
        const { data, error } = await supabase
          .from('requests')
          .update(requestData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar requisição:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar a requisição.',
            variant: 'destructive',
          })
          throw error
        }

        if (data) {
          await fetchRequests()
          toast({
            title: 'Sucesso',
            description: 'Requisição atualizada com sucesso.',
          })
        }
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchRequests]
  )

  const deleteRequest = useCallback(
    async (id: string) => {
      try {
        // Buscar a requisição para obter o número da requisição
        const { data: request, error: fetchError } = await supabase
          .from('requests')
          .select('request_number')
          .eq('id', id)
          .single()

        if (fetchError) {
          console.error('Erro ao buscar requisição:', fetchError)
          toast({
            title: 'Erro',
            description: 'Não foi possível encontrar a requisição.',
            variant: 'destructive',
          })
          throw fetchError
        }

        // Buscar os materiais dos itens da requisição ANTES de excluir
        // para poder disparar eventos de atualização do estoque
        const { data: requestItems } = await supabase
          .from('request_items')
          .select('material_id')
          .eq('request_id', id)

        // Excluir saídas relacionadas à requisição
        if (request?.request_number) {
          const { error: outputsError } = await supabase
            .from('outputs')
            .delete()
            .like('reason', `Requisição ${request.request_number}`)

          if (outputsError) {
            console.error('Erro ao excluir saídas da requisição:', outputsError)
            // Não falhar a exclusão se as saídas não forem encontradas, apenas logar
            // Mas se for outro erro, vamos continuar mesmo assim
          }

          // Disparar eventos para atualizar o estoque dos materiais afetados
          // O trigger do banco já atualizou o estoque ao excluir as saídas
          if (requestItems) {
            const materialIds = new Set(requestItems.map(item => item.material_id))
            materialIds.forEach(materialId => {
              window.dispatchEvent(new CustomEvent('materialUpdated', {
                detail: { materialId }
              }))
            })
          }
        }

        // Excluir itens primeiro (devido à foreign key)
        const { error: itemsError } = await supabase
          .from('request_items')
          .delete()
          .eq('request_id', id)

        if (itemsError) {
          console.error('Erro ao excluir itens da requisição:', itemsError)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir os itens da requisição.',
            variant: 'destructive',
          })
          throw itemsError
        }

        // Excluir requisição
        const { error } = await supabase
          .from('requests')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Erro ao excluir requisição:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir a requisição.',
            variant: 'destructive',
          })
          throw error
        }

        await fetchRequests()
        toast({
          title: 'Sucesso',
          description: 'Requisição e saídas relacionadas excluídas com sucesso.',
        })
      } catch (error) {
        throw error
      }
    },
    [supabase, toast, fetchRequests]
  )

  return {
    requests,
    isLoading,
    addRequest,
    addRequests,
    updateRequest,
    deleteRequest,
    refreshRequests: fetchRequests,
  }
}

