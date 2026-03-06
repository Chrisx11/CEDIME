'use client'

import { useState, useMemo } from 'react'
import { Material } from '@/lib/data-context'
import { useMaterials } from '@/hooks/use-materials'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search } from 'lucide-react'

interface MaterialSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (material: Material) => void
  excludeMaterialId?: string
  showStock?: boolean
}

export function MaterialSelector({ isOpen, onClose, onSelect, excludeMaterialId, showStock = false }: MaterialSelectorProps) {
  const { materials: supabaseMaterials } = useMaterials()
  const [searchQuery, setSearchQuery] = useState('')

  // Converter materiais do Supabase para o formato esperado
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

  const filteredMaterials = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return materials.filter(m => m.id !== excludeMaterialId)
    }

    const query = searchQuery.trim().toLowerCase()
    
    return materials.filter(material => {
      if (material.id === excludeMaterialId) return false
      return (
        material.name.toLowerCase().includes(query) ||
        material.category.toLowerCase().includes(query) ||
        material.unit.toLowerCase().includes(query)
      )
    })
  }, [materials, searchQuery, excludeMaterialId])

  const handleSelect = (material: Material) => {
    onSelect(material)
    setSearchQuery('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Material</DialogTitle>
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
                  const stock = showStock ? material.quantity : null
                  return (
                    <button
                      key={material.id}
                      onClick={() => handleSelect(material)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors focus:outline-none focus:bg-accent"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{material.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>{material.category}</span>
                            {stock !== null && (
                              <>
                                <span>•</span>
                                <span>Estoque: {stock} {material.unit.charAt(0).toUpperCase() + material.unit.slice(1)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {stock !== null && (
                          <div className="ml-4 text-sm text-muted-foreground">
                            {material.unit.charAt(0).toUpperCase() + material.unit.slice(1)}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

