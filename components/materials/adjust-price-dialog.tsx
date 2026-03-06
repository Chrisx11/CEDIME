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
import { DollarSign } from 'lucide-react'

interface AdjustPriceDialogProps {
  material: Material | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (newPrice: number) => void
}

export function AdjustPriceDialog({
  material,
  isOpen,
  onClose,
  onConfirm,
}: AdjustPriceDialogProps) {
  const [price, setPrice] = useState<string>('')

  useEffect(() => {
    if (material && isOpen) {
      setPrice(material.unitPrice.toString())
    }
  }, [material, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice < 0) {
      return
    }
    onConfirm(numPrice)
    setPrice('')
  }

  const handleCancel = () => {
    setPrice('')
    onClose()
  }

  if (!material) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Ajustar Preço Médio</DialogTitle>
          </div>
          <DialogDescription>
            Ajuste o preço médio do material <strong>{material.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Preço Médio Atual: <span className="text-muted-foreground">{formatCurrency(material.unitPrice)}</span>
            </label>
            <div className="space-y-2">
              <label className="text-sm font-medium">Novo Preço Médio</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="0,00"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Preço por {material.unit.charAt(0).toUpperCase() + material.unit.slice(1)}
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

