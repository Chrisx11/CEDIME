'use client'

import { useState, useEffect, useMemo } from 'react'
import { Material } from '@/lib/data-context'
import { useOutputs, Output as OutputType } from '@/hooks/use-outputs'
import { useMaterials } from '@/hooks/use-materials'
import { useInstitutions } from '@/hooks/use-institutions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowRightCircle, Package, School } from 'lucide-react'
import { MaterialSelector } from '@/components/ui/material-selector'
import { InstitutionSelector } from '@/components/ui/institution-selector'
import { cn } from '@/lib/utils'

interface OutputFormProps {
  outputId: string | null
  isOpen: boolean
  onSubmit: (data: {
    materialId: string
    quantity: number
    institutionId?: string
    responsible: string
    outputDate: string
  }) => void
  onCancel: () => void
}

// Função para obter data local sem conversão de timezone
function getLocalDateString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Função para formatar data para input
function formatDateForInput(dateString: string): string {
  if (!dateString) return getLocalDateString()
  
  // Se já está no formato YYYY-MM-DD, retornar direto
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  // Se tem T (ISO), extrair apenas a data
  if (dateString.includes('T')) {
    return dateString.split('T')[0]
  }
  
  // Tentar parsear como Date
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return getLocalDateString()
  }
}

export function OutputForm({ outputId, isOpen, onSubmit, onCancel }: OutputFormProps) {
  const { outputs: supabaseOutputs } = useOutputs()
  const { materials: supabaseMaterials } = useMaterials()
  const { institutions: supabaseInstitutions } = useInstitutions()
  
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
      city: i.city,
      state: i.state,
      principalName: i.principal_name,
      phone: i.phone ?? undefined,
      createdAt: i.created_at,
    }))
  }, [supabaseInstitutions])

  // Converter output do Supabase para o formato esperado
  const output = useMemo(() => {
    if (!outputId) return null
    const supabaseOutput = supabaseOutputs.find(o => o.id === outputId)
    if (!supabaseOutput) return null
    
    const outputDate = formatDateForInput(supabaseOutput.output_date)
    
    return {
      id: supabaseOutput.id,
      materialId: supabaseOutput.material_id,
      quantity: supabaseOutput.quantity,
      institutionId: supabaseOutput.institution_id || '',
      responsible: supabaseOutput.responsible,
      outputDate: outputDate,
    }
  }, [outputId, supabaseOutputs])
  
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: 1,
    institutionId: '',
    responsible: '',
    outputDate: getLocalDateString(),
  })

  const [isMaterialSelectorOpen, setIsMaterialSelectorOpen] = useState(false)
  const [isInstitutionSelectorOpen, setIsInstitutionSelectorOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (output) {
        setFormData({
          materialId: output.materialId || '',
          quantity: output.quantity || 1,
          institutionId: output.institutionId || '',
          responsible: output.responsible || '',
          outputDate: formatDateForInput(output.outputDate),
        })
      } else {
        setFormData({
          materialId: '',
          quantity: 1,
          institutionId: '',
          responsible: '',
          outputDate: getLocalDateString(),
        })
      }
    }
  }, [isOpen, output, outputId])

  const selectedMaterial = materials.find(m => m.id === formData.materialId)
  const availableQuantity = selectedMaterial ? selectedMaterial.quantity : 0

  const handleMaterialSelect = (material: Material) => {
    setFormData(prev => ({
      ...prev,
      materialId: material.id
    }))
  }

  const handleInstitutionSelect = (institution: { id: string; name: string }) => {
    setFormData(prev => ({
      ...prev,
      institutionId: institution.id
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value) || 1) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.materialId) {
      return
    }

    if (selectedMaterial && formData.quantity > availableQuantity) {
      return
    }

    onSubmit({
      materialId: formData.materialId,
      quantity: formData.quantity,
      institutionId: formData.institutionId || undefined,
      responsible: formData.responsible,
      outputDate: formData.outputDate,
    })
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ArrowRightCircle className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {output ? 'Editar Saída' : 'Nova Saída'}
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
                disabled={!!output}
                className={cn(
                  "w-full px-3 py-2 border border-input rounded-md bg-background text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                  !formData.materialId && "text-muted-foreground",
                  !!output && "opacity-50 cursor-not-allowed"
                )}
              >
                {selectedMaterial ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{selectedMaterial.name} (Est: {availableQuantity} {selectedMaterial.unit})</span>
                    <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">Selecionar material</span>
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
                max={availableQuantity}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              {selectedMaterial && (
                <p className="text-xs text-muted-foreground">
                  Disponível: {availableQuantity} {selectedMaterial.unit}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data da Saída</label>
              <input
                type="date"
                name="outputDate"
                value={formData.outputDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Instituição</label>
              <button
                type="button"
                onClick={() => setIsInstitutionSelectorOpen(true)}
                className={cn(
                  "w-full px-3 py-2 border border-input rounded-md bg-background text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                  !formData.institutionId && "text-muted-foreground"
                )}
              >
                {formData.institutionId ? (
                  (() => {
                    const selectedInstitution = institutions.find(i => i.id === formData.institutionId)
                    return selectedInstitution ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{selectedInstitution.name}</span>
                        <School className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">Selecionar instituição</span>
                        <School className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    )
                  })()
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">Selecionar instituição</span>
                    <School className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                )}
              </button>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Responsável</label>
              <input
                type="text"
                name="responsible"
                value={formData.responsible}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Nome do responsável pela saída"
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {output ? 'Atualizar' : 'Registrar'} Saída
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>

    <MaterialSelector
      isOpen={isMaterialSelectorOpen}
      onClose={() => setIsMaterialSelectorOpen(false)}
      onSelect={handleMaterialSelect}
      excludeMaterialId={output?.materialId}
      showStock={true}
    />

    <InstitutionSelector
      isOpen={isInstitutionSelectorOpen}
      onClose={() => setIsInstitutionSelectorOpen(false)}
      onSelect={handleInstitutionSelect}
      excludeInstitutionId={output?.institutionId}
    />
    </>
  )
}

