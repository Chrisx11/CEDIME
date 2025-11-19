'use client'

import { useState, useMemo } from 'react'
import { Institution } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { maskCNPJ, maskPhone } from '@/lib/utils'
import { Edit, Trash2, MoreVertical, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface InstitutionListProps {
  institutions: Institution[]
  onEdit: (institution: Institution) => void
  onDelete: (id: string) => void
}

export function InstitutionList({ institutions, onEdit, onDelete }: InstitutionListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      school: 'Escola',
      center: 'Centro Educacional',
      other: 'Outro'
    }
    return types[type] || type
  }

  const filteredInstitutions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return institutions
    }

    const query = searchQuery.trim().toLowerCase()
    const queryNumbers = searchQuery.replace(/\D/g, '')

    return institutions.filter(institution => {
      const nameMatch = institution.name.toLowerCase().includes(query)
      const cityMatch = institution.city.toLowerCase().includes(query)
      const principalMatch = institution.principalName.toLowerCase().includes(query)
      const typeLabel = getTypeLabel(institution.type).toLowerCase()
      const typeMatch = typeLabel.includes(query)
      
      // Buscar por CNPJ (com ou sem máscara) - só se houver números na busca
      let cnpjMatch = false
      if (queryNumbers.length > 0 && institution.cnpj) {
        const cnpjUnmasked = institution.cnpj.replace(/\D/g, '')
        cnpjMatch = cnpjUnmasked.includes(queryNumbers)
      }
      if (!cnpjMatch && institution.cnpj) {
        const cnpjFormatted = maskCNPJ(institution.cnpj)
        cnpjMatch = cnpjFormatted.toLowerCase().includes(query)
      }
      
      // Buscar por telefone (com ou sem máscara) - só se houver números na busca
      let phoneMatch = false
      if (institution.phone) {
        if (queryNumbers.length > 0) {
          const phoneUnmasked = institution.phone.replace(/\D/g, '')
          phoneMatch = phoneUnmasked.includes(queryNumbers)
        }
        if (!phoneMatch) {
          phoneMatch = maskPhone(institution.phone).toLowerCase().includes(query)
        }
      }
      
      return nameMatch || cityMatch || principalMatch || typeMatch || cnpjMatch || phoneMatch
    })
  }, [institutions, searchQuery])

  if (institutions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhuma instituição cadastrada ainda</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por nome, CNPJ, cidade, diretor, tipo ou telefone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          autoComplete="off"
        />
      </div>

      {/* Tabela */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Diretor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutions.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhuma instituição encontrada com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredInstitutions.map(institution => (
                  <TableRow key={institution.id}>
                    <TableCell className="font-medium">{institution.name}</TableCell>
                    <TableCell>{maskCNPJ(institution.cnpj)}</TableCell>
                    <TableCell>{institution.phone ? maskPhone(institution.phone) : '-'}</TableCell>
                    <TableCell>{institution.city}</TableCell>
                    <TableCell>{institution.principalName}</TableCell>
                    <TableCell>{getTypeLabel(institution.type)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        institution.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {institution.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(institution)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(institution.id)}
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {filteredInstitutions.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredInstitutions.length} de {institutions.length} instituição(ões)
        </div>
      )}
    </div>
  )
}
