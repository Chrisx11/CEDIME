'use client'

import { useState, useMemo } from 'react'
import { useInstitutions, Institution as InstitutionType } from '@/hooks/use-institutions'
import { Institution } from '@/lib/data-context'
import { unmaskPhone } from '@/lib/utils'
import { AuthLayout } from '@/components/auth-layout'
import { InstitutionForm } from '@/components/institutions/institution-form'
import { InstitutionList } from '@/components/institutions/institution-list'
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
import { FileText, Download, FileSpreadsheet, File, Search, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { exportInstitutionsToExcel, exportInstitutionsToPDF } from '@/lib/export-utils'

// Função para converter Institution do Supabase para o formato esperado pelos componentes
function convertInstitution(institution: InstitutionType): Institution {
  return {
    id: institution.id,
    name: institution.name,
    type: 'school',
    cnpj: '',
    email: '',
    phone: institution.phone || '',
    address: '',
    city: institution.city,
    state: institution.state,
    principalName: institution.principal_name,
    status: institution.status,
    createdAt: institution.created_at,
  }
}

export default function InstitutionsPage() {
  const { institutions: supabaseInstitutions, addInstitution, updateInstitution, deleteInstitution, isLoading } = useInstitutions()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()

  // Converter instituições do Supabase para o formato esperado
  const institutions = useMemo(() => {
    return supabaseInstitutions.map(convertInstitution)
  }, [supabaseInstitutions])

  const handleAddNew = () => {
    setEditingInstitution(null)
    setIsFormVisible(true)
  }

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution)
    setIsFormVisible(true)
  }

  const handleSubmit = async (data: Omit<Institution, 'id' | 'createdAt'>) => {
    try {
      // Converter para o formato do Supabase (remover máscaras)
      const supabaseData = {
        name: data.name.trim(),
        phone: data.phone ? unmaskPhone(data.phone) : undefined,
        city: data.city.trim(),
        state: data.state.trim().toUpperCase(),
        principal_name: data.principalName.trim(),
        status: data.status,
      }

      if (editingInstitution) {
        await updateInstitution(editingInstitution.id, supabaseData)
      } else {
        await addInstitution(supabaseData)
      }
      setIsFormVisible(false)
      setEditingInstitution(null)
    } catch (error) {
      // Erro já foi tratado no hook
    }
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
      try {
        await deleteInstitution(id)
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
            <p className="text-muted-foreground">Carregando instituições...</p>
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
              placeholder="Pesquisar por nome, cidade, estado, responsável ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>
          <Link href="/expenses-institutions">
            <Button variant="outline" className="font-medium">
              <TrendingDown className="h-4 w-4 mr-2" />
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
        <InstitutionList
          institutions={institutions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchQuery={searchQuery}
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
