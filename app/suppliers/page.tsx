'use client'

import { useState } from 'react'
import { useData, Supplier } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { SupplierForm } from '@/components/suppliers/supplier-form'
import { SupplierList } from '@/components/suppliers/supplier-list'
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
import { exportSuppliersToExcel, exportSuppliersToPDF } from '@/lib/export-utils'

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useData()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()

  const handleAddNew = () => {
    setEditingSupplier(null)
    setIsFormVisible(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setIsFormVisible(true)
  }

  const handleSubmit = (data: Omit<Supplier, 'id' | 'createdAt'>) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, data)
      toast({
        title: 'Fornecedor atualizado',
        description: 'Os dados do fornecedor foram atualizados com sucesso.',
      })
    } else {
      addSupplier(data)
      toast({
        title: 'Fornecedor cadastrado',
        description: 'O fornecedor foi cadastrado com sucesso.',
      })
    }
    setIsFormVisible(false)
    setEditingSupplier(null)
  }

  const handleCancel = () => {
    setIsFormVisible(false)
    setEditingSupplier(null)
  }

  const handleDelete = async (id: string) => {
    const supplier = suppliers.find(s => s.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Fornecedor',
      description: `Tem certeza que deseja excluir o fornecedor "${supplier?.name}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      deleteSupplier(id)
      toast({
        title: 'Fornecedor excluído',
        description: 'O fornecedor foi excluído com sucesso.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <PageHeader
          title="Gestão de Fornecedores"
          description="Cadastre e gerencie os fornecedores de materiais escolares"
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
                      exportSuppliersToExcel(suppliers)
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
                      exportSuppliersToPDF(suppliers)
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
                Novo Fornecedor
              </Button>
            </div>
          }
        />
        <SupplierList
          suppliers={suppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <SupplierForm
          supplier={editingSupplier || undefined}
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
