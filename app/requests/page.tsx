'use client'

import { useState, useMemo } from 'react'
import { Request } from '@/lib/data-context'
import { useRequests, Request as RequestType } from '@/hooks/use-requests'
import { useInstitutions } from '@/hooks/use-institutions'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { RequestWizard } from '@/components/requests/request-wizard'
import { RequestTable } from '@/components/requests/request-table'
import { useToast } from '@/hooks/use-toast'
import { generateRequestReceipt } from '@/lib/export-utils'

// Função para converter Request do Supabase para o formato esperado pelos componentes
function convertRequest(request: RequestType): Request {
  return {
    id: request.id,
    requestNumber: request.request_number,
    institution: request.institution_id,
    requiredDate: request.required_date,
    status: request.status,
    items: request.items?.map(item => ({
      materialId: item.material_id,
      materialName: item.material_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total,
    })) || [],
    totalValue: request.total_value,
    createdAt: request.created_at,
  }
}

export default function RequestsPage() {
  const { requests: supabaseRequests, addRequests, deleteRequest, updateRequest, isLoading } = useRequests()
  const { institutions: supabaseInstitutions } = useInstitutions()
  const { toast } = useToast()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Converter requisições do Supabase para o formato esperado
  const requests = useMemo(() => {
    return supabaseRequests.map(convertRequest)
  }, [supabaseRequests])

  // Converter instituições para o formato esperado
  const institutions = useMemo(() => {
    return supabaseInstitutions.map(i => ({
      id: i.id,
      name: i.name,
      cnpj: '',
      city: i.city,
      state: i.state,
      principalName: i.principal_name,
      phone: i.phone || '',
      email: '',
      createdAt: i.created_at,
    }))
  }, [supabaseInstitutions])

  const handleWizardSubmit = async (requestsData: Array<{
    institution: string
    requiredDate: string
    status: 'pending' | 'approved' | 'delivered' | 'cancelled'
    items: Array<{
      materialId: string
      materialName: string
      quantity: number
      unitPrice: number
      total: number
    }>
    totalValue: number
  }>) => {
    try {
      // Converter para o formato do Supabase
      const supabaseRequestsData = requestsData.map(req => {
        const institution = institutions.find(i => i.id === req.institution)
        return {
          institution_id: req.institution,
          institution_name: institution?.name || 'Instituição não encontrada',
          required_date: req.requiredDate,
          status: req.status,
          total_value: req.totalValue,
          items: req.items.map(item => ({
            material_id: item.materialId,
            material_name: item.materialName,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total: item.total,
          })),
        }
      })

      await addRequests(supabaseRequestsData)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRequest(id)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleUpdateStatus = async (id: string, status: 'pending' | 'approved' | 'delivered' | 'cancelled') => {
    try {
      await updateRequest(id, { status })
      const statusLabels: Record<string, string> = {
        pending: 'Pendente',
        approved: 'Aprovada',
        delivered: 'Entregue',
        cancelled: 'Cancelada'
      }
      toast({
        title: 'Status atualizado',
        description: `O status da requisição foi alterado para "${statusLabels[status]}".`,
      })
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleGenerateReceipt = async (request: any) => {
    const institution = institutions.find(i => i.id === request.institution)
    const institutionName = institution?.name || 'Instituição não encontrada'
    
    try {
      await generateRequestReceipt(request, institutionName)
      toast({
        title: 'Canhoto gerado',
        description: 'O canhoto foi gerado com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro ao gerar canhoto',
        description: 'Ocorreu um erro ao gerar o canhoto. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <div className="flex gap-2 mb-6 justify-end">
          <Button 
            onClick={() => setIsWizardOpen(true)} 
            className="bg-primary hover:bg-primary/90 font-medium"
          >
            Nova Requisição
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando requisições...</p>
          </div>
        ) : (
          <RequestTable
            requests={requests}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
            onGenerateReceipt={handleGenerateReceipt}
          />
        )}
      </div>

      <RequestWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleWizardSubmit}
      />
    </AuthLayout>
  )
}
