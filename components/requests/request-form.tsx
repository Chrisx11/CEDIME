'use client'

import { useState, useEffect } from 'react'
import { Request, RequestItem } from '@/lib/data-context'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { FileText, Trash2, Plus } from 'lucide-react'

interface RequestFormProps {
  request?: Request
  isOpen: boolean
  onSubmit: (data: Omit<Request, 'id' | 'requestNumber' | 'createdAt'>) => void
  onCancel: () => void
}

export function RequestForm({ request, isOpen, onSubmit, onCancel }: RequestFormProps) {
  const { institutions, materials } = useData()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    institution: request?.institution || '',
    requiredDate: request?.requiredDate || new Date().toISOString().split('T')[0],
    status: (request?.status || 'pending') as 'pending' | 'approved' | 'delivered' | 'cancelled',
    items: request?.items || []
  })

  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (isOpen && request) {
      setFormData({
        institution: request.institution,
        requiredDate: request.requiredDate,
        status: request.status,
        items: request.items
      })
    } else if (isOpen && !request) {
      setFormData({
        institution: '',
        requiredDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        items: []
      })
    }
    setSelectedMaterial('')
    setQuantity(1)
  }, [isOpen, request])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    if (!selectedMaterial || quantity <= 0) return

    const material = materials.find(m => m.id === selectedMaterial)
    if (!material) return

    const existingItemIndex = formData.items.findIndex(i => i.materialId === selectedMaterial)
    const newItem: RequestItem = {
      materialId: selectedMaterial,
      materialName: material.name,
      quantity,
      unitPrice: material.unitPrice,
      total: quantity * material.unitPrice
    }

    if (existingItemIndex >= 0) {
      const updatedItems = [...formData.items]
      updatedItems[existingItemIndex].quantity += quantity
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * material.unitPrice
      setFormData(prev => ({ ...prev, items: updatedItems }))
    } else {
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }))
    }

    setSelectedMaterial('')
    setQuantity(1)
  }

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.items.length === 0) {
      toast({
        title: 'Itens necessários',
        description: 'Adicione pelo menos um item à requisição antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    const totalValue = formData.items.reduce((acc, item) => acc + item.total, 0)
    onSubmit({ ...formData, totalValue })
  }

  const totalValue = formData.items.reduce((acc, item) => acc + item.total, 0)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {request ? 'Editar Requisição' : 'Nova Requisição'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Instituição</label>
              <select
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              >
              <option value="">Selecionar instituição</option>
              {institutions.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Necessária</label>
            <input
              type="date"
              name="requiredDate"
              value={formData.requiredDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="pending">Pendente</option>
              <option value="approved">Aprovada</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Itens da Requisição</h3>
          
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Material</label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  min="1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full bg-secondary hover:bg-secondary/90"
                >
                  Adicionar Item
                </Button>
              </div>
            </div>
          </div>

          {formData.items.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm pb-2 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{item.materialName}</div>
                      <div className="text-muted-foreground">{item.quantity} unidades @ R$ {item.unitPrice.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">R$ {item.total.toFixed(2)}</div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="bg-destructive hover:bg-destructive/90 text-xs py-1 px-2"
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-semibold">Valor Total:</span>
                <span className="font-bold text-lg text-primary">R$ {totalValue.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {request ? 'Atualizar' : 'Criar'} Requisição
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
