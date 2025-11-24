'use client'

import { useState, useMemo } from 'react'
import { Supplier } from '@/lib/data-context'
import { useSuppliers } from '@/hooks/use-suppliers'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, Building2 } from 'lucide-react'

interface SupplierSelectorSimpleProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (supplier: Supplier) => void
  excludeSupplierId?: string
}

export function SupplierSelectorSimple({ isOpen, onClose, onSelect, excludeSupplierId }: SupplierSelectorSimpleProps) {
  const { suppliers: supabaseSuppliers } = useSuppliers()
  const [searchQuery, setSearchQuery] = useState('')

  // Converter fornecedores do Supabase para o formato esperado
  const suppliers = useMemo(() => {
    return supabaseSuppliers.map(s => ({
      id: s.id,
      name: s.name,
      cnpj: s.cnpj,
      phone: s.phone,
      city: s.city,
      state: s.state,
      status: s.status,
      createdAt: s.created_at,
    }))
  }, [supabaseSuppliers])

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return suppliers.filter(s => s.id !== excludeSupplierId)
    }

    const query = searchQuery.trim().toLowerCase()
    
    return suppliers.filter(supplier => {
      if (supplier.id === excludeSupplierId) return false
      return (
        supplier.name.toLowerCase().includes(query) ||
        supplier.city.toLowerCase().includes(query) ||
        (supplier.state && supplier.state.toLowerCase().includes(query)) ||
        (supplier.phone && supplier.phone.toLowerCase().includes(query))
      )
    })
  }, [suppliers, searchQuery, excludeSupplierId])

  const handleSelect = (supplier: Supplier) => {
    onSelect(supplier)
    setSearchQuery('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Fornecedor</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, cidade, estado ou telefone..."
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
                {filteredSuppliers.map(supplier => (
                  <button
                    key={supplier.id}
                    onClick={() => handleSelect(supplier)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors focus:outline-none focus:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{supplier.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{supplier.city}{supplier.state ? `, ${supplier.state}` : ''}</span>
                          {supplier.phone && (
                            <>
                              <span>•</span>
                              <span>{supplier.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Building2 className="h-4 w-4 text-muted-foreground ml-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

