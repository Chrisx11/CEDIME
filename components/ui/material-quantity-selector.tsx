'use client'

import { useState, useMemo, useEffect } from 'react'
import { Material } from '@/lib/data-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Search, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface MaterialQuantitySelectorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selections: Record<string, number>) => void
  availableMaterials: Material[]
  initialSelections?: Record<string, number>
}

export function MaterialQuantitySelector({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableMaterials,
  initialSelections = {}
}: MaterialQuantitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selections, setSelections] = useState<Record<string, number>>(initialSelections)

  // Reset selections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelections(initialSelections)
      setSearchQuery('')
    }
  }, [isOpen, initialSelections])

  const filteredMaterials = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return availableMaterials
    }

    const query = searchQuery.trim().toLowerCase()
    
    return availableMaterials.filter(material => {
      return (
        material.name.toLowerCase().includes(query) ||
        material.category.toLowerCase().includes(query) ||
        material.unit.toLowerCase().includes(query)
      )
    })
  }, [availableMaterials, searchQuery])

  const handleQuantityChange = (materialId: string, quantity: number) => {
    setSelections(prev => ({
      ...prev,
      [materialId]: Math.max(0, quantity)
    }))
  }

  const handleToggle = (materialId: string) => {
    setSelections(prev => {
      const current = prev[materialId] || 0
      if (current > 0) {
        // Se já tem quantidade, zera
        const newSelections = { ...prev }
        delete newSelections[materialId]
        return newSelections
      } else {
        // Se está zerado, marca com quantidade 1
        return { ...prev, [materialId]: 1 }
      }
    })
  }

  const handleConfirm = () => {
    onConfirm(selections)
    setSearchQuery('')
    onClose()
  }

  const handleCancel = () => {
    setSelections(initialSelections)
    setSearchQuery('')
    onClose()
  }

  const selectedCount = Object.values(selections).filter(qty => qty > 0).length

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Selecionar Materiais e Quantidades
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, categoria ou unidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Lista de Materiais */}
          <div className="flex-1 overflow-y-auto border border-input rounded-md">
            {filteredMaterials.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery.trim() !== '' 
                  ? `Nenhum material encontrado com "${searchQuery}"`
                  : 'Nenhum material disponível'}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredMaterials.map(material => {
                  const quantity = selections[material.id] || 0
                  const isSelected = quantity > 0
                  // Usar os dados diretamente do objeto material
                  const stock = material.quantity || 0
                  const averagePrice = material.unitPrice || 0
                  
                  return (
                    <Card
                      key={material.id}
                      className={`p-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggle(material.id)}
                          className="w-3.5 h-3.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{material.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {material.category} • Est: {stock} {material.unit} • 
                            R$ {averagePrice.toFixed(2)}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1.5">
                            <label className="text-xs font-medium">Qtd:</label>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(material.id, parseInt(e.target.value) || 0)}
                              min="0"
                              max={stock}
                              className="w-16 px-1.5 py-0.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <span className="text-xs text-muted-foreground">{material.unit}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {selectedCount > 0 && (
            <div className="text-sm text-muted-foreground pt-2 border-t">
              {selectedCount} material(is) selecionado(s)
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
            Confirmar ({selectedCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

