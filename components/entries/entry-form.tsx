'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Entry, Material, Supplier } from '@/lib/data-context'
import { useEntries } from '@/hooks/use-entries'
import { useMaterials } from '@/hooks/use-materials'
import { useSuppliers } from '@/hooks/use-suppliers'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowDownCircle, Package, Building2 } from 'lucide-react'
import { MaterialSelector } from '@/components/ui/material-selector'
import { SupplierSelectorSimple } from '@/components/ui/supplier-selector-simple'
import { cn } from '@/lib/utils'

interface EntryFormProps {
  entryId: string | null
  isOpen: boolean
  onSubmit: (data: {
    materialId: string
    quantity: number
    unitPrice: number
    supplierId?: string
    responsible: string
    entryDate: string
  }) => void
  onCancel: () => void
}

export function EntryForm({ entryId, isOpen, onSubmit, onCancel }: EntryFormProps) {
  const { materials: supabaseMaterials } = useMaterials()
  const { suppliers: supabaseSuppliers } = useSuppliers()
  const { entries: supabaseEntries } = useEntries()
  
  // Converter materiais do Supabase para o formato esperado
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

  // Converter fornecedores do Supabase para o formato esperado
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
  
  // Converter entradas do Supabase para o formato esperado
  const entries = useMemo(() => {
    return supabaseEntries.map(e => ({
      id: e.id,
      materialId: e.material_id,
      materialName: e.material_name,
      quantity: e.quantity,
      unit: e.unit,
      unitPrice: e.unit_price,
      supplierId: e.supplier_id,
      supplierName: e.supplier_name,
      reason: e.reason,
      responsible: e.responsible,
      entryDate: e.entry_date,
      createdAt: e.created_at,
    }))
  }, [supabaseEntries])
  
  // Função para obter data local no formato YYYY-MM-DD
  const getLocalDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Função para formatar data do Supabase para YYYY-MM-DD
  const formatDateForInput = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return getLocalDateString()
    
    // Se for string, extrair apenas a parte da data
    if (typeof dateValue === 'string') {
      // Se contém T (timestamp), pegar apenas a data
      if (dateValue.includes('T')) {
        return dateValue.split('T')[0]
      }
      // Se já está no formato YYYY-MM-DD, retornar direto
      if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateValue
      }
    }
    
    // Se for Date object, converter para string local
    if (dateValue instanceof Date) {
      const year = dateValue.getFullYear()
      const month = String(dateValue.getMonth() + 1).padStart(2, '0')
      const day = String(dateValue.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    return getLocalDateString()
  }

  // Encontrar a entrada atual baseada no entryId
  const entry = useMemo(() => {
    if (!entryId) return null
    return entries.find(e => e.id === entryId) || null
  }, [entryId, entries])

  const [formData, setFormData] = useState({
    materialId: '',
    quantity: 1,
    unitPrice: 0,
    supplierId: '',
    responsible: '',
    entryDate: getLocalDateString(),
  })

  const [isMaterialSelectorOpen, setIsMaterialSelectorOpen] = useState(false)
  const [isSupplierSelectorOpen, setIsSupplierSelectorOpen] = useState(false)

  // Atualizar campos quando o diálogo abrir ou quando entry mudar
  useEffect(() => {
    if (isOpen) {
      if (entry && entryId) {
        // Preencher campos com dados da entrada
        const formattedDate = formatDateForInput(entry.entryDate)
        setFormData({
          materialId: entry.materialId || '',
          quantity: entry.quantity || 1,
          unitPrice: entry.unitPrice || 0,
          supplierId: entry.supplierId || '',
          responsible: entry.responsible || '',
          entryDate: formattedDate,
        })
      } else if (!entryId) {
        // Limpar campos para nova entrada
        setFormData({
          materialId: '',
          quantity: 1,
          unitPrice: 0,
          supplierId: '',
          responsible: '',
          entryDate: getLocalDateString(),
        })
      }
    }
  }, [isOpen, entry, entryId])

  const selectedMaterial = materials.find(m => m.id === formData.materialId)
  const selectedSupplier = suppliers.find(s => s.id === formData.supplierId)

  const handleMaterialSelect = (material: Material) => {
    setFormData(prev => ({
      ...prev,
      materialId: material.id
    }))
  }

  const handleSupplierSelect = (supplier: Supplier) => {
    setFormData(prev => ({
      ...prev,
      supplierId: supplier.id
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' 
        ? Math.max(1, parseInt(value) || 1) 
        : name === 'unitPrice'
        ? Math.max(0, parseFloat(value) || 0)
        : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.materialId) {
      return
    }

    if (formData.unitPrice <= 0) {
      return
    }

    onSubmit({
      materialId: formData.materialId,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      supplierId: formData.supplierId || undefined,
      responsible: formData.responsible,
      entryDate: formData.entryDate,
    })
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ArrowDownCircle className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {entry ? 'Editar Entrada' : 'Nova Entrada'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Material</label>
              <button
                type="button"
                onClick={() => setIsMaterialSelectorOpen(true)}
                disabled={!!entry}
                className={cn(
                  "w-full px-3 py-2 border border-input rounded-md bg-background text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                  !formData.materialId && "text-muted-foreground",
                  !!entry && "opacity-50 cursor-not-allowed"
                )}
              >
                {selectedMaterial ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{selectedMaterial.name}</span>
                    <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span>Selecionar material</span>
                    <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                )}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              {selectedMaterial && (
                <p className="text-xs text-muted-foreground">
                  Unidade: {selectedMaterial.unit}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preço Unitário (R$)</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fornecedor</label>
              <button
                type="button"
                onClick={() => setIsSupplierSelectorOpen(true)}
                className={cn(
                  "w-full px-3 py-2 border border-input rounded-md bg-background text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                  !formData.supplierId && "text-muted-foreground"
                )}
              >
                {selectedSupplier ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{selectedSupplier.name}</span>
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span>Selecionar fornecedor</span>
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                )}
              </button>
              {formData.supplierId && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, supplierId: '' }))}
                  className="text-xs text-destructive hover:underline"
                >
                  Remover fornecedor
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data da Entrada</label>
              <input
                type="date"
                name="entryDate"
                value={formData.entryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Responsável</label>
              <input
                type="text"
                name="responsible"
                value={formData.responsible}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>

          {selectedMaterial && formData.quantity > 0 && formData.unitPrice > 0 && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Valor Total:</span> R$ {(formData.quantity * formData.unitPrice).toFixed(2)}
              </p>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {entry ? 'Atualizar' : 'Registrar'} Entrada
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <MaterialSelector
      isOpen={isMaterialSelectorOpen}
      onClose={() => setIsMaterialSelectorOpen(false)}
      onSelect={handleMaterialSelect}
      excludeMaterialId={entry?.materialId}
    />

    <SupplierSelectorSimple
      isOpen={isSupplierSelectorOpen}
      onClose={() => setIsSupplierSelectorOpen(false)}
      onSelect={handleSupplierSelect}
      excludeSupplierId={entry?.supplierId}
    />
    </>
  )
}

