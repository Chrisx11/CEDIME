'use client'

import { useState, useEffect } from 'react'
import { useData, Output } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowRightCircle } from 'lucide-react'

interface OutputFormProps {
  outputId: string | null
  isOpen: boolean
  onSubmit: (data: {
    materialId: string
    quantity: number
    institutionId?: string
    reason: string
    responsible: string
    outputDate: string
  }) => void
  onCancel: () => void
}

export function OutputForm({ outputId, isOpen, onSubmit, onCancel }: OutputFormProps) {
  const { materials, institutions, outputs } = useData()
  const output = outputId ? outputs.find(o => o.id === outputId) : null
  
  const [formData, setFormData] = useState({
    materialId: output?.materialId || '',
    quantity: output?.quantity || 1,
    institutionId: output?.institutionId || '',
    reason: output?.reason || '',
    responsible: output?.responsible || '',
    outputDate: output?.outputDate || new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (isOpen && output) {
      setFormData({
        materialId: output.materialId,
        quantity: output.quantity,
        institutionId: output.institutionId || '',
        reason: output.reason,
        responsible: output.responsible,
        outputDate: output.outputDate,
      })
    } else if (isOpen && !output) {
      setFormData({
        materialId: '',
        quantity: 1,
        institutionId: '',
        reason: '',
        responsible: '',
        outputDate: new Date().toISOString().split('T')[0],
      })
    }
  }, [isOpen, output])

  const selectedMaterial = materials.find(m => m.id === formData.materialId)
  const availableQuantity = selectedMaterial ? selectedMaterial.quantity : 0

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
      reason: formData.reason,
      responsible: formData.responsible,
      outputDate: formData.outputDate,
    })
  }

  return (
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
              <select
                name="materialId"
                value={formData.materialId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
                disabled={!!output}
              >
                <option value="">Selecionar material</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Est: {m.quantity} {m.unit})
                  </option>
                ))}
              </select>
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
              <label className="text-sm font-medium">Instituição (Opcional)</label>
              <select
                name="institutionId"
                value={formData.institutionId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Nenhuma</option>
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
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

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Motivo</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={3}
                placeholder="Descreva o motivo da saída do material"
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
  )
}

