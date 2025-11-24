'use client'

import { useState, useMemo } from 'react'
import { Output } from '@/lib/data-context'
import { useOutputs, Output as OutputType } from '@/hooks/use-outputs'
import { useMaterials } from '@/hooks/use-materials'
import { useInstitutions } from '@/hooks/use-institutions'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { OutputTable } from '@/components/outputs/output-table'
import { OutputForm } from '@/components/outputs/output-form'
import { useToast } from '@/hooks/use-toast'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'

// Função para converter Output do Supabase para o formato esperado pelos componentes
function convertOutput(output: OutputType): Output {
  // Garantir que output_date está no formato YYYY-MM-DD sem conversão de timezone
  let outputDate: string
  
  if (output.output_date instanceof Date) {
    const year = output.output_date.getFullYear()
    const month = String(output.output_date.getMonth() + 1).padStart(2, '0')
    const day = String(output.output_date.getDate()).padStart(2, '0')
    outputDate = `${year}-${month}-${day}`
  } else if (typeof output.output_date === 'string') {
    outputDate = output.output_date.includes('T') 
      ? output.output_date.split('T')[0] 
      : output.output_date
  } else {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    outputDate = `${year}-${month}-${day}`
  }

  return {
    id: output.id,
    materialId: output.material_id,
    materialName: output.material_name,
    quantity: output.quantity,
    unit: output.unit,
    institutionId: output.institution_id,
    institutionName: output.institution_name,
    reason: output.reason,
    responsible: output.responsible,
    outputDate: outputDate,
    createdAt: output.created_at,
  }
}

export default function OutputsPage() {
  const { outputs: supabaseOutputs, addOutput, updateOutput, deleteOutput, isLoading } = useOutputs()
  const { materials: supabaseMaterials } = useMaterials()
  const { institutions: supabaseInstitutions } = useInstitutions()
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOutput, setEditingOutput] = useState<string | null>(null)

  // Converter saídas do Supabase para o formato esperado
  const outputs = useMemo(() => {
    return supabaseOutputs.map(convertOutput)
  }, [supabaseOutputs])

  // Converter materiais e instituições para o formato esperado
  const materials = useMemo(() => {
    return supabaseMaterials.map(m => ({
      id: m.id,
      name: m.name,
      category: m.category,
      unit: m.unit,
      quantity: m.quantity,
      minQuantity: m.min_quantity,
      unitPrice: m.unit_price,
      lastUpdate: m.last_update,
    }))
  }, [supabaseMaterials])

  const institutions = useMemo(() => {
    return supabaseInstitutions.map(i => ({
      id: i.id,
      name: i.name,
      cnpj: i.cnpj,
      city: i.city,
      state: i.state,
      principalName: i.principal_name,
      phone: i.phone,
      email: i.email,
      createdAt: i.created_at,
    }))
  }, [supabaseInstitutions])

  const handleAddNew = () => {
    setEditingOutput(null)
    setIsFormOpen(true)
  }

  const handleEdit = (id: string) => {
    setEditingOutput(id)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: {
    materialId: string
    quantity: number
    institutionId?: string
    responsible: string
    outputDate: string
  }) => {
    const material = materials.find(m => m.id === data.materialId)
    if (!material) {
      toast({
        title: 'Erro',
        description: 'Material não encontrado.',
        variant: 'destructive',
      })
      return
    }

    // Verificar estoque disponível
    if (data.quantity > material.quantity) {
      toast({
        title: 'Estoque insuficiente',
        description: `Estoque disponível: ${material.quantity} ${material.unit.charAt(0).toUpperCase() + material.unit.slice(1)}. Quantidade solicitada: ${data.quantity} ${material.unit.charAt(0).toUpperCase() + material.unit.slice(1)}.`,
        variant: 'destructive',
      })
      return
    }

    const institution = data.institutionId 
      ? institutions.find(i => i.id === data.institutionId)
      : null

    try {
      // Converter para o formato do Supabase
      const supabaseData = {
        material_id: data.materialId,
        material_name: material.name,
        quantity: data.quantity,
        unit: material.unit,
        institution_id: data.institutionId || undefined,
        institution_name: institution?.name || undefined,
        reason: '',
        responsible: data.responsible,
        output_date: data.outputDate,
      }

      if (editingOutput) {
        await updateOutput(editingOutput, supabaseData)
      } else {
        await addOutput(supabaseData)
      }
      setIsFormOpen(false)
      setEditingOutput(null)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingOutput(null)
  }

  const handleDelete = async (id: string) => {
    const output = outputs.find(o => o.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Saída',
      description: `Tem certeza que deseja excluir a saída de "${output?.materialName}"? O estoque será restaurado.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      try {
        await deleteOutput(id)
      } catch (error) {
        // Erro já foi tratado no hook
      }
    }
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <div className="flex gap-2 mb-6 justify-end">
          <Button 
            onClick={handleAddNew} 
            className="bg-primary hover:bg-primary/90 font-medium"
          >
            Nova Saída
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando saídas...</p>
          </div>
        ) : (
          <OutputTable
            outputs={outputs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <OutputForm
        outputId={editingOutput}
        isOpen={isFormOpen}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.options.title}
        description={confirmDialog.options.description}
        confirmText={confirmDialog.options.confirmText}
        cancelText={confirmDialog.options.cancelText}
        variant={confirmDialog.options.variant}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />
    </AuthLayout>
  )
}

