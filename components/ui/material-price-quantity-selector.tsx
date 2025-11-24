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

interface MaterialSelection {
  quantity: number
  unitPrice: number
}

interface MaterialPriceQuantitySelectorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selections: Record<string, MaterialSelection>) => void
  availableMaterials: Material[]
  initialSelections?: Record<string, MaterialSelection>
}

export function MaterialPriceQuantitySelector({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableMaterials,
  initialSelections = {}
}: MaterialPriceQuantitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selections, setSelections] = useState<Record<string, MaterialSelection>>(initialSelections)

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
    const material = availableMaterials.find(m => m.id === materialId)
    const averagePrice = material ? material.unitPrice : 0
    
    setSelections(prev => ({
      ...prev,
      [materialId]: {
        ...(prev[materialId] || { quantity: 0, unitPrice: averagePrice }),
        quantity: Math.max(0, quantity)
      }
    }))
  }

  const handlePriceChange = (materialId: string, unitPrice: number) => {
    const material = availableMaterials.find(m => m.id === materialId)
    const averagePrice = material ? material.unitPrice : 0
    
    setSelections(prev => ({
      ...prev,
      [materialId]: {
        ...(prev[materialId] || { quantity: 0, unitPrice: averagePrice }),
        unitPrice: Math.max(0, unitPrice)
      }
    }))
  }

  const handleToggle = (materialId: string) => {
    const material = availableMaterials.find(m => m.id === materialId)
    const averagePrice = material ? material.unitPrice : 0
    
    setSelections(prev => {
      const current = prev[materialId]
      if (current && current.quantity > 0) {
        // Se já tem quantidade, zera
        const newSelections = { ...prev }
        delete newSelections[materialId]
        return newSelections
      } else {
        // Se está zerado, marca com quantidade 1 e preço médio
        return {
          ...prev,
          [materialId]: {
            quantity: 1,
            unitPrice: averagePrice
          }
        }
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

  const selectedCount = Object.values(selections).filter(s => s.quantity > 0).length

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Selecionar Materiais, Quantidades e Preços
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
                  const selection = selections[material.id]
                  const quantity = selection?.quantity || 0
                  const unitPrice = selection?.unitPrice || material.unitPrice
                  const isSelected = quantity > 0
                  const stock = material.quantity
                  
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
                            {material.category} • Est: {stock} {material.unit}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1.5">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium">Qtd:</label>
                              <input
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(material.id, parseInt(e.target.value) || 0)}
                                min="0"
                                max={stock}
                                className="w-16 px-1.5 py-0.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium">Preço:</label>
                              <input
                                type="number"
                                value={unitPrice}
                                onChange={(e) => handlePriceChange(material.id, parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                                className="w-20 px-1.5 py-0.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            <span className="text-xs text-muted-foreground pt-5">{material.unit}</span>
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

