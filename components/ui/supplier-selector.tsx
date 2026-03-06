'use client'

import { useState, useMemo, useEffect } from 'react'
import { Supplier } from '@/lib/data-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Search, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface SupplierSelectorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
  availableSuppliers: Supplier[]
  initialSelections?: string[]
}

export function SupplierSelector({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableSuppliers,
  initialSelections = []
}: SupplierSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selections, setSelections] = useState<string[]>(initialSelections)

  // Reset selections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelections(initialSelections)
      setSearchQuery('')
    }
  }, [isOpen, initialSelections])

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return availableSuppliers
    }

    const query = searchQuery.trim().toLowerCase()
    
    return availableSuppliers.filter(supplier => {
      return (
        supplier.name.toLowerCase().includes(query) ||
        supplier.city.toLowerCase().includes(query) ||
        (supplier.state && supplier.state.toLowerCase().includes(query))
      )
    })
  }, [availableSuppliers, searchQuery])

  const handleToggle = (supplierId: string) => {
    setSelections(prev => {
      if (prev.includes(supplierId)) {
        return prev.filter(id => id !== supplierId)
      } else {
        return [...prev, supplierId]
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

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Selecionar Fornecedores
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
              placeholder="Pesquisar por nome, cidade ou estado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Lista de Fornecedores */}
          <div className="flex-1 overflow-y-auto border border-input rounded-md">
            {filteredSuppliers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery.trim() !== '' 
                  ? `Nenhum fornecedor encontrado com "${searchQuery}"`
                  : 'Nenhum fornecedor disponível'}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredSuppliers.map(supplier => {
                  const isSelected = selections.includes(supplier.id)
                  
                  return (
                    <Card
                      key={supplier.id}
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
                          onChange={() => handleToggle(supplier.id)}
                          className="w-3.5 h-3.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{supplier.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {supplier.city}{supplier.state ? `, ${supplier.state}` : ''}
                            {supplier.phone && ` • ${supplier.phone}`}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {selections.length > 0 && (
            <div className="text-sm text-muted-foreground pt-2 border-t">
              {selections.length} fornecedor(es) selecionado(s)
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
            Confirmar ({selections.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

