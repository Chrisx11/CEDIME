'use client'

import { useState } from 'react'
import { useData } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { OutputTable } from '@/components/outputs/output-table'
import { OutputForm } from '@/components/outputs/output-form'
import { useToast } from '@/hooks/use-toast'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'

export default function OutputsPage() {
  const { outputs, addOutput, updateOutput, deleteOutput, deleteAllOutputs, materials, institutions, updateMaterial } = useData()
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOutput, setEditingOutput] = useState<string | null>(null)

  const handleAddNew = () => {
    setEditingOutput(null)
    setIsFormOpen(true)
  }

  const handleEdit = (id: string) => {
    setEditingOutput(id)
    setIsFormOpen(true)
  }

  const handleSubmit = (data: {
    materialId: string
    quantity: number
    institutionId?: string
    reason: string
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

    if (data.quantity > material.quantity) {
      toast({
        title: 'Estoque insuficiente',
        description: `Estoque disponível: ${material.quantity} ${material.unit}. Quantidade solicitada: ${data.quantity} ${material.unit}.`,
        variant: 'destructive',
      })
      return
    }

    const institution = data.institutionId 
      ? institutions.find(i => i.id === data.institutionId)
      : null

    if (editingOutput) {
      // Editar saída existente
      const existingOutput = outputs.find(o => o.id === editingOutput)
      if (existingOutput) {
        // Ajustar estoque: restaurar quantidade antiga e subtrair nova
        const oldMaterial = materials.find(m => m.id === existingOutput.materialId)
        if (oldMaterial) {
          // Restaurar estoque do material antigo
          const restoredQuantity = oldMaterial.quantity + existingOutput.quantity
          // Se mudou de material, atualizar ambos
          if (existingOutput.materialId !== data.materialId) {
            // Restaurar material antigo
            updateMaterial(existingOutput.materialId, { quantity: restoredQuantity })
            // Subtrair do novo material
            const newQuantity = Math.max(0, material.quantity - data.quantity)
            updateMaterial(data.materialId, { quantity: newQuantity })
          } else {
            // Mesmo material, ajustar diferença
            const difference = existingOutput.quantity - data.quantity
            const newQuantity = Math.max(0, material.quantity + difference)
            updateMaterial(data.materialId, { quantity: newQuantity })
          }
        }

        updateOutput(editingOutput, {
          materialId: data.materialId,
          materialName: material.name,
          quantity: data.quantity,
          unit: material.unit,
          institutionId: data.institutionId,
          institutionName: institution?.name,
          reason: data.reason,
          responsible: data.responsible,
          outputDate: data.outputDate,
        })

        toast({
          title: 'Saída atualizada',
          description: 'A saída de material foi atualizada com sucesso.',
        })
      }
    } else {
      // Nova saída
      addOutput({
        materialId: data.materialId,
        materialName: material.name,
        quantity: data.quantity,
        unit: material.unit,
        institutionId: data.institutionId,
        institutionName: institution?.name,
        reason: data.reason,
        responsible: data.responsible,
        outputDate: data.outputDate,
      })

      toast({
        title: 'Saída registrada',
        description: 'A saída de material foi registrada com sucesso.',
      })
    }

    setIsFormOpen(false)
    setEditingOutput(null)
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
      deleteOutput(id)
      toast({
        title: 'Saída excluída',
        description: 'A saída foi excluída e o estoque foi restaurado.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAll = async () => {
    if (outputs.length === 0) {
      toast({
        title: 'Nenhuma saída',
        description: 'Não há saídas para excluir.',
      })
      return
    }

    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Todas as Saídas',
      description: `Tem certeza que deseja excluir todas as ${outputs.length} saída(s)? O estoque de todos os materiais será restaurado. Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir Todas',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      const count = outputs.length
      deleteAllOutputs()
      toast({
        title: 'Todas as saídas excluídas',
        description: `${count} saída(s) excluída(s) e estoque restaurado.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <PageHeader
          title="Saídas de Materiais"
          description="Registre saídas individuais de materiais do estoque"
          action={
            <div className="flex gap-2">
              <Button 
                onClick={handleDeleteAll} 
                variant="destructive"
                className="font-medium"
              >
                Excluir Todas (Dev)
              </Button>
              <Button 
                onClick={handleAddNew} 
                className="bg-primary hover:bg-primary/90 font-medium"
              >
                Nova Saída
              </Button>
            </div>
          }
        />

        <OutputTable
          outputs={outputs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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

