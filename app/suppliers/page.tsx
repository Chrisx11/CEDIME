'use client'

import { useState, useMemo } from 'react'
import { useSuppliers, Supplier as SupplierType } from '@/hooks/use-suppliers'
import { Supplier } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { SupplierForm } from '@/components/suppliers/supplier-form'
import { SupplierList } from '@/components/suppliers/supplier-list'
import { Button } from '@/components/ui/button'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileText, Download, FileSpreadsheet, File, Search, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { exportSuppliersToExcel, exportSuppliersToPDF } from '@/lib/export-utils'

// Função para converter Supplier do Supabase para o formato esperado pelos componentes
function convertSupplier(supplier: SupplierType): Supplier {
  return {
    id: supplier.id,
    name: supplier.name,
    cnpj: supplier.cnpj,
    phone: supplier.phone,
    city: supplier.city,
    state: supplier.state,
    status: supplier.status,
    createdAt: supplier.created_at,
  }
}

export default function SuppliersPage() {
  const { suppliers: supabaseSuppliers, addSupplier, updateSupplier, deleteSupplier, isLoading } = useSuppliers()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()

  // Converter fornecedores do Supabase para o formato esperado
  const suppliers = useMemo(() => {
    return supabaseSuppliers.map(convertSupplier)
  }, [supabaseSuppliers])

  const handleAddNew = () => {
    setEditingSupplier(null)
    setIsFormVisible(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setIsFormVisible(true)
  }

  const handleSubmit = async (data: Omit<Supplier, 'id' | 'createdAt'>) => {
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, data)
      } else {
        await addSupplier(data)
      }
      setIsFormVisible(false)
      setEditingSupplier(null)
    } catch (error) {
      // Erro já foi tratado no hook
    }
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
      try {
        await deleteSupplier(id)
      } catch (error) {
        // Erro já foi tratado no hook
      }
    }
  }

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando fornecedores...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <div className="flex gap-2 mb-6 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, CNPJ, cidade, estado ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>
          <Link href="/expenses-suppliers">
            <Button variant="outline" className="font-medium">
              <DollarSign className="h-4 w-4 mr-2" />
              Despesas
            </Button>
          </Link>
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
        <SupplierList
          suppliers={suppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchQuery={searchQuery}
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
