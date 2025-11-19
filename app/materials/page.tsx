'use client'

import { useState } from 'react'
import { useData, Material } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { MaterialForm } from '@/components/materials/material-form'
import { MaterialList } from '@/components/materials/material-list'
import { Button } from '@/components/ui/button'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useToast } from '@/hooks/use-toast'
import { PageHeader } from '@/components/page-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileText, Download, FileSpreadsheet, File } from 'lucide-react'
import { exportMaterialsToExcel, exportMaterialsToPDF } from '@/lib/export-utils'

export default function MaterialsPage() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useData()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()

  const handleAddNew = () => {
    setEditingMaterial(null)
    setIsFormVisible(true)
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
    setIsFormVisible(true)
  }

  const handleSubmit = (data: Omit<Material, 'id' | 'lastUpdate'>) => {
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, data)
      toast({
        title: 'Material atualizado',
        description: 'Os dados do material foram atualizados com sucesso.',
      })
    } else {
      addMaterial(data)
      toast({
        title: 'Material cadastrado',
        description: 'O material foi cadastrado com sucesso.',
      })
    }
    setIsFormVisible(false)
    setEditingMaterial(null)
  }

  const handleCancel = () => {
    setIsFormVisible(false)
    setEditingMaterial(null)
  }

  const handleDelete = async (id: string) => {
    const material = materials.find(m => m.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Material',
      description: `Tem certeza que deseja excluir o material "${material?.name}"? Esta ação não pode ser desfeita e pode afetar requisições relacionadas.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      deleteMaterial(id)
      toast({
        title: 'Material excluído',
        description: 'O material foi excluído com sucesso.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <PageHeader
          title="Gestão de Materiais"
          description="Cadastre, atualize e controle o estoque de materiais"
          action={
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="font-medium">
                    <FileText className="h-4 w-4 mr-2" />
                    Relatório
                    <Download className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      exportMaterialsToExcel(materials)
                      toast({
                        title: 'Exportação concluída',
                        description: 'Relatório Excel gerado com sucesso.',
                      })
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar para Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      exportMaterialsToPDF(materials)
                      toast({
                        title: 'Exportação concluída',
                        description: 'Relatório PDF gerado com sucesso.',
                      })
                    }}
                  >
                    <File className="h-4 w-4 mr-2" />
                    Exportar para PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 font-medium">
                Novo Material
              </Button>
            </div>
          }
        />
        <MaterialList
          materials={materials}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <MaterialForm
          material={editingMaterial || undefined}
          isOpen={isFormVisible}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>

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
