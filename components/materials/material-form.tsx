'use client'

import { useState, useEffect } from 'react'
import { Material } from '@/lib/data-context'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Package, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MaterialFormProps {
  material?: Material
  isOpen: boolean
  onSubmit: (data: Omit<Material, 'id' | 'lastUpdate'>) => void
  onCancel: () => void
}

export function MaterialForm({ material, isOpen, onSubmit, onCancel }: MaterialFormProps) {
  const { customCategories, addCustomCategory } = useData()
  const { toast } = useToast()
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  
  const [formData, setFormData] = useState({
    name: material?.name || '',
    category: material?.category || '',
    unit: material?.unit || 'unidade',
    quantity: material?.quantity || 0,
    minQuantity: material?.minQuantity || 0,
    unitPrice: material?.unitPrice || 0
  })

  // Categorias padrão removidas - apenas categorias customizadas serão exibidas
  const standardCategories: Array<{ value: string; label: string }> = []

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim()
    if (!trimmed) {
      toast({
        title: 'Nome inválido',
        description: 'Por favor, informe um nome para a categoria.',
        variant: 'destructive',
      })
      return
    }
    
    if (customCategories.includes(trimmed)) {
      toast({
        title: 'Categoria já existe',
        description: 'Esta categoria customizada já foi cadastrada.',
        variant: 'destructive',
      })
      return
    }

    addCustomCategory(trimmed)
    setFormData(prev => ({ ...prev, category: trimmed }))
    setNewCategoryName('')
    setShowCategoryDialog(false)
    toast({
      title: 'Categoria cadastrada',
      description: `A categoria "${trimmed}" foi cadastrada com sucesso.`,
    })
  }

  useEffect(() => {
    if (isOpen && material) {
      setFormData({
        name: material.name,
        category: material.category,
        unit: material.unit,
        quantity: material.quantity,
        minQuantity: material.minQuantity,
        unitPrice: material.unitPrice
      })
    } else if (isOpen && !material) {
      setFormData({
        name: '',
        category: '',
        unit: 'unidade',
        quantity: 0,
        minQuantity: 0,
        unitPrice: 0
      })
    }
    // Fechar diálogo de categoria quando o formulário principal for fechado
    if (!isOpen) {
      setShowCategoryDialog(false)
      setNewCategoryName('')
    }
  }, [isOpen, material])

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
            <div className="flex gap-2">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              >
                <option value="">Selecionar categoria</option>
                {standardCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
                {customCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCategoryDialog(true)}
                className="px-4"
                title="Registrar nova categoria"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Unidade de Medida</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="unidade">Unidade</option>
              <option value="caixa">Caixa</option>
              <option value="resma">Resma</option>
              <option value="metro">Metro</option>
              <option value="quilograma">Quilograma</option>
              <option value="litro">Litro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantidade em Estoque</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="0"
              required
            />
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Preço Unitário (R$)</label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="0"
              step="0.01"
              required
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

      {/* Dialog para cadastrar nova categoria */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Categoria</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Ex: Mobiliário, Artes, etc."
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowCategoryDialog(false)
                setNewCategoryName('')
              }}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleAddCategory} className="bg-primary hover:bg-primary/90">
                Cadastrar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
