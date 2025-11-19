'use client'

import { useState } from 'react'
import { useData } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { RequestWizard } from '@/components/requests/request-wizard'
import { RequestTable } from '@/components/requests/request-table'
import { useToast } from '@/hooks/use-toast'
import { generateRequestReceipt } from '@/lib/export-utils'

export default function RequestsPage() {
  const { requests, addRequests, deleteRequest, updateRequest, institutions } = useData()
  const { toast } = useToast()
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const handleWizardSubmit = (requestsData: Array<{
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
    // Criar todas as requisições de uma vez (uma para cada instituição)
    addRequests(requestsData)

    toast({
      title: 'Requisições criadas',
      description: `${requestsData.length} requisição(ões) criada(s) com sucesso.`,
    })
  }

  const handleDelete = (id: string) => {
    deleteRequest(id)
    toast({
      title: 'Requisição excluída',
      description: 'A requisição foi excluída com sucesso.',
    })
  }

  const handleUpdateStatus = (id: string, status: 'pending' | 'approved' | 'delivered' | 'cancelled') => {
    updateRequest(id, { status })
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
        <PageHeader
          title="Requisições de Materiais"
          description="Gerencie as requisições de saída de materiais das instituições"
          action={
            <Button 
              onClick={() => setIsWizardOpen(true)} 
              className="bg-primary hover:bg-primary/90 font-medium"
            >
              Nova Requisição
            </Button>
          }
        />

        <RequestTable
          requests={requests}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
          onGenerateReceipt={handleGenerateReceipt}
        />
      </div>

      <RequestWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleWizardSubmit}
      />
    </AuthLayout>
  )
}
