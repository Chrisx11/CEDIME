'use client'

import { useState, useEffect } from 'react'
import { Material } from '@/lib/data-context'
import { useCategories } from '@/hooks/use-categories'
import { useUnits } from '@/hooks/use-units'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Package } from 'lucide-react'

interface MaterialFormProps {
  material?: Material
  isOpen: boolean
  onSubmit: (data: Omit<Material, 'id' | 'lastUpdate'>) => void
  onCancel: () => void
}

export function MaterialForm({ material, isOpen, onSubmit, onCancel }: MaterialFormProps) {
  const { categories } = useCategories()
  const { units } = useUnits()
  const [formData, setFormData] = useState({
    name: material?.name || '',
    category: material?.category || '',
    unit: material?.unit || '',
    quantity: material?.quantity || 0,
    minQuantity: material?.minQuantity || 0,
    unitPrice: material?.unitPrice || 0
  })

  useEffect(() => {
    if (isOpen && material) {
      // Encontrar a unidade correspondente (case-insensitive)
      let matchedUnit = material.unit || ''
      if (material.unit && units.length > 0) {
        const foundUnit = units.find(
          u => u.name.toLowerCase() === material.unit?.toLowerCase()
        )
        if (foundUnit) {
          matchedUnit = foundUnit.name
        }
      }
      
      setFormData({
        name: material.name,
        category: material.category,
        unit: matchedUnit,
        quantity: material.quantity,
        minQuantity: material.minQuantity,
        unitPrice: material.unitPrice
      })
    } else if (isOpen && !material) {
      setFormData({
        name: '',
        category: '',
        unit: '',
        quantity: 0,
        minQuantity: 0,
        unitPrice: 0
      })
    }
  }, [isOpen, material])
  
  // Efeito separado para atualizar a unidade quando units for carregado
  useEffect(() => {
    if (isOpen && material && material.unit && units.length > 0) {
      const foundUnit = units.find(
        u => u.name.toLowerCase() === material.unit?.toLowerCase()
      )
      if (foundUnit && formData.unit !== foundUnit.name) {
        setFormData(prev => ({
          ...prev,
          unit: foundUnit.name
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, material?.id, material?.unit, units.length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['quantity', 'minQuantity', 'unitPrice'].includes(name) ? parseFloat(value) || 0 : value 
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {material ? 'Editar Material' : 'Novo Material'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Material</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            >
              <option value="">Selecionar categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Unidade de Medida</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            >
              <option value="">Selecionar unidade</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.name}>
                  {unit.name.charAt(0).toUpperCase() + unit.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantidade Mínima</label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="0"
            />
          </div>
        </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {material ? 'Atualizar' : 'Criar'} Material
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
