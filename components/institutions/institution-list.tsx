'use client'

import { useMemo } from 'react'
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
import { maskPhone } from '@/lib/utils'
import { Edit, Trash2, MoreVertical } from 'lucide-react'
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
  searchQuery: string
}

export function InstitutionList({ institutions, onEdit, onDelete, searchQuery }: InstitutionListProps) {

  const filteredInstitutions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return institutions
    }

    const query = searchQuery.trim().toLowerCase()
    const queryNumbers = searchQuery.replace(/\D/g, '')

    return institutions.filter(institution => {
      const nameMatch = institution.name.toLowerCase().includes(query)
      const cityMatch = institution.city.toLowerCase().includes(query)
      const stateMatch = institution.state?.toLowerCase().includes(query) || false
      const principalMatch = institution.principalName.toLowerCase().includes(query)
      
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
      
      return nameMatch || cityMatch || stateMatch || principalMatch || phoneMatch
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
      {/* Tabela */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutions.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma instituição encontrada com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredInstitutions.map(institution => (
                  <TableRow key={institution.id}>
                    <TableCell className="font-medium">{institution.name}</TableCell>
                    <TableCell>{institution.phone ? maskPhone(institution.phone) : '-'}</TableCell>
                    <TableCell>{institution.city}</TableCell>
                    <TableCell>{institution.state || '-'}</TableCell>
                    <TableCell>{institution.principalName}</TableCell>
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
