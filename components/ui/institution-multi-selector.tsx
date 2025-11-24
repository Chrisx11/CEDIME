'use client'

import { useState, useMemo, useEffect } from 'react'
import { Institution } from '@/lib/data-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Search, School, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface InstitutionMultiSelectorProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedIds: string[]) => void
  availableInstitutions: Institution[]
  initialSelections?: string[]
}

export function InstitutionMultiSelector({ 
  isOpen, 
  onClose, 
  onConfirm, 
  availableInstitutions,
  initialSelections = []
}: InstitutionMultiSelectorProps) {
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selections, setSelections] = useState<string[]>(initialSelections)

  // Reset selections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelections(initialSelections)
      setSearchQuery('')
    }
  }, [isOpen, initialSelections])

  const filteredInstitutions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return availableInstitutions
    }

    const query = searchQuery.trim().toLowerCase()
    
    return availableInstitutions.filter(institution => {
      return (
        institution.name.toLowerCase().includes(query) ||
        (institution.city && institution.city.toLowerCase().includes(query)) ||
        (institution.state && institution.state.toLowerCase().includes(query)) ||
        (institution.phone && institution.phone.toLowerCase().includes(query))
      )
    })
  }, [availableInstitutions, searchQuery])

  const handleToggle = (institutionId: string) => {
    setSelections(prev => {
      if (prev.includes(institutionId)) {
        return prev.filter(id => id !== institutionId)
      } else {
        return [...prev, institutionId]
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

  const selectedCount = selections.length

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Instituições</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, cidade ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Contador de selecionados */}
          {selectedCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedCount} instituição(ões) selecionada(s)
            </div>
          )}

          {/* Lista de Instituições */}
          <div className="flex-1 overflow-y-auto border border-input rounded-md">
            {filteredInstitutions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery.trim() !== '' 
                  ? `Nenhuma instituição encontrada com "${searchQuery}"`
                  : 'Nenhuma instituição disponível'}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredInstitutions.map(institution => {
                  const isSelected = selections.includes(institution.id)
                  return (
                    <button
                      key={institution.id}
                      onClick={() => handleToggle(institution.id)}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition-colors focus:outline-none focus:bg-accent flex items-center gap-3"
                    >
                      <div className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center ${
                        isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-input'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{institution.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{institution.city}{institution.state ? `, ${institution.state}` : ''}</span>
                          {institution.phone && (
                            <>
                              <span>•</span>
                              <span>{institution.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <School className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
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

