'use client'

import { useState, useMemo } from 'react'
import { useInstitutions, Institution as InstitutionType } from '@/hooks/use-institutions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, School } from 'lucide-react'

interface Institution {
  id: string
  name: string
  city?: string
  state?: string
  phone?: string
}

interface InstitutionSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (institution: Institution) => void
  excludeInstitutionId?: string
}

export function InstitutionSelector({ isOpen, onClose, onSelect, excludeInstitutionId }: InstitutionSelectorProps) {
  const { institutions: supabaseInstitutions } = useInstitutions()
  const [searchQuery, setSearchQuery] = useState('')

  // Converter instituições do Supabase para o formato esperado
  const institutions = useMemo(() => {
    return supabaseInstitutions.map(i => ({
      id: i.id,
      name: i.name,
      city: i.city,
      state: i.state,
      phone: i.phone,
    }))
  }, [supabaseInstitutions])

  const filteredInstitutions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return institutions.filter(i => i.id !== excludeInstitutionId)
    }

    const query = searchQuery.trim().toLowerCase()
    
    return institutions.filter(institution => {
      if (institution.id === excludeInstitutionId) return false
      return (
        institution.name.toLowerCase().includes(query) ||
        (institution.city && institution.city.toLowerCase().includes(query)) ||
        (institution.state && institution.state.toLowerCase().includes(query)) ||
        (institution.phone && institution.phone.toLowerCase().includes(query))
      )
    })
  }, [institutions, searchQuery, excludeInstitutionId])

  const handleSelect = (institution: Institution) => {
    onSelect(institution)
    setSearchQuery('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar Instituição</DialogTitle>
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
                {filteredInstitutions.map(institution => (
                  <button
                    key={institution.id}
                    onClick={() => handleSelect(institution)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors focus:outline-none focus:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
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
                      <School className="h-4 w-4 text-muted-foreground ml-4" />
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
