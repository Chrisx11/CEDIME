'use client'

import { useState } from 'react'
import { useData, Institution } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { InstitutionForm } from '@/components/institutions/institution-form'
import { InstitutionList } from '@/components/institutions/institution-list'
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
import { exportInstitutionsToExcel, exportInstitutionsToPDF } from '@/lib/export-utils'

export default function InstitutionsPage() {
  const { institutions, addInstitution, updateInstitution, deleteInstitution } = useData()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null)
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()

  const handleAddNew = () => {
    setEditingInstitution(null)
    setIsFormVisible(true)
  }

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution)
    setIsFormVisible(true)
  }

  const handleSubmit = (data: Omit<Institution, 'id' | 'createdAt'>) => {
    if (editingInstitution) {
      updateInstitution(editingInstitution.id, data)
      toast({
        title: 'Instituição atualizada',
        description: 'Os dados da instituição foram atualizados com sucesso.',
      })
    } else {
      addInstitution(data)
      toast({
        title: 'Instituição cadastrada',
        description: 'A instituição foi cadastrada com sucesso.',
      })
    }
    setIsFormVisible(false)
    setEditingInstitution(null)
  }

  const handleCancel = () => {
    setIsFormVisible(false)
    setEditingInstitution(null)
  }

  const handleDelete = async (id: string) => {
    const institution = institutions.find(i => i.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Instituição',
      description: `Tem certeza que deseja excluir a instituição "${institution?.name}"? Esta ação não pode ser desfeita e pode afetar requisições relacionadas.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      deleteInstitution(id)
      toast({
        title: 'Instituição excluída',
        description: 'A instituição foi excluída com sucesso.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <PageHeader
          title="Gestão de Instituições"
          description="Cadastre e gerencie os colégios e instituições municipais"
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
                      exportInstitutionsToExcel(institutions)
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
                      exportInstitutionsToPDF(institutions)
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
                Nova Instituição
              </Button>
            </div>
          }
        />
        <InstitutionList
          institutions={institutions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <InstitutionForm
          institution={editingInstitution || undefined}
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
