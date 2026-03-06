'use client'

import { useState, useEffect } from 'react'
import { Material } from '@/lib/data-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'

interface AdjustStockDialogProps {
  material: Material | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (newQuantity: number) => void
}

export function AdjustStockDialog({
  material,
  isOpen,
  onClose,
  onConfirm,
}: AdjustStockDialogProps) {
  const [quantity, setQuantity] = useState<string>('')

  useEffect(() => {
    if (material && isOpen) {
      setQuantity(material.quantity.toString())
    }
  }, [material, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numQuantity = parseFloat(quantity)
    if (isNaN(numQuantity) || numQuantity < 0) {
      return
    }
    onConfirm(numQuantity)
    setQuantity('')
  }

  const handleCancel = () => {
    setQuantity('')
    onClose()
  }

  if (!material) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Ajustar Estoque</DialogTitle>
          </div>
          <DialogDescription>
            Ajuste a quantidade em estoque do material <strong>{material.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Quantidade Atual: <span className="text-muted-foreground">{material.quantity} {material.unit}</span>
            </label>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Quantidade</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Digite a nova quantidade"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Unidade: {material.unit.charAt(0).toUpperCase() + material.unit.slice(1)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Confirmar Ajuste
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

