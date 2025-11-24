'use client'

import { useState, useMemo } from 'react'
import { useData, Entry } from '@/lib/data-context'
import { useEntries, Entry as EntryType } from '@/hooks/use-entries'
import { useMaterials } from '@/hooks/use-materials'
import { useSuppliers } from '@/hooks/use-suppliers'
import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { EntryTable } from '@/components/entries/entry-table'
import { EntryForm } from '@/components/entries/entry-form'
import { useToast } from '@/hooks/use-toast'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'

// Função para converter Entry do Supabase para o formato esperado pelos componentes
function convertEntry(entry: EntryType): Entry {
  // Garantir que entry_date está no formato YYYY-MM-DD sem conversão de timezone
  // entry_date do Supabase sempre vem como string
  const entryDate = typeof entry.entry_date === 'string' && entry.entry_date.includes('T')
    ? entry.entry_date.split('T')[0]
    : entry.entry_date || new Date().toISOString().split('T')[0]

  return {
    id: entry.id,
    materialId: entry.material_id,
    materialName: entry.material_name,
    quantity: entry.quantity,
    unit: entry.unit,
    unitPrice: entry.unit_price,
    supplierId: entry.supplier_id,
    supplierName: entry.supplier_name,
    reason: entry.reason,
    responsible: entry.responsible,
    entryDate: entryDate,
    createdAt: entry.created_at,
  }
}

export default function EntriesPage() {
  const { entries: supabaseEntries, addEntry, updateEntry, deleteEntry, isLoading } = useEntries()
  const { materials: supabaseMaterials } = useMaterials()
  const { suppliers: supabaseSuppliers } = useSuppliers()
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)

  // Converter entradas do Supabase para o formato esperado
  const entries = useMemo(() => {
    return supabaseEntries.map(convertEntry)
  }, [supabaseEntries])

  // Converter materiais e fornecedores para o formato esperado
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

  const suppliers = useMemo(() => {
    return supabaseSuppliers.map(s => ({
      id: s.id,
      name: s.name,
      cnpj: s.cnpj,
      phone: s.phone,
      city: s.city,
      state: s.state,
      status: s.status,
      createdAt: s.created_at,
    }))
  }, [supabaseSuppliers])

  const handleAddNew = () => {
    setEditingEntry(null)
    setIsFormOpen(true)
  }

  const handleEdit = (id: string) => {
    setEditingEntry(id)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: {
    materialId: string
    quantity: number
    unitPrice: number
    supplierId?: string
    responsible: string
    entryDate: string
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

    const supplier = data.supplierId 
      ? suppliers.find(s => s.id === data.supplierId)
      : null

    try {
      // Converter para o formato do Supabase
      const supabaseData = {
        material_id: data.materialId,
        material_name: material.name,
        quantity: data.quantity,
        unit: material.unit,
        unit_price: data.unitPrice,
        supplier_id: data.supplierId || undefined,
        supplier_name: supplier?.name || undefined,
        reason: '',
        responsible: data.responsible,
        entry_date: data.entryDate,
      }

      if (editingEntry) {
        await updateEntry(editingEntry, supabaseData)
      } else {
        await addEntry(supabaseData)
      }
      setIsFormOpen(false)
      setEditingEntry(null)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingEntry(null)
  }

  const handleDelete = async (id: string) => {
    const entry = entries.find(e => e.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Entrada',
      description: `Tem certeza que deseja excluir a entrada de "${entry?.materialName}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      try {
        await deleteEntry(id)
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
            <p className="text-muted-foreground">Carregando entradas...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <div className="flex gap-2 mb-6 justify-end">
          <Button 
            onClick={handleAddNew} 
            className="bg-primary hover:bg-primary/90 font-medium"
          >
            Nova Entrada
          </Button>
        </div>

        <EntryTable
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <EntryForm
        entryId={editingEntry}
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

