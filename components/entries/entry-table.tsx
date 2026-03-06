'use client'

import { useState, useMemo } from 'react'
import { Entry } from '@/lib/data-context'

// Função para capitalizar primeira letra
const capitalizeFirst = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Search, MoreVertical, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface EntryTableProps {
  entries: Entry[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function EntryTable({ entries, onEdit, onDelete }: EntryTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEntries = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return entries
    }

    const query = searchQuery.trim().toLowerCase()
    
    return entries.filter(entry => {
      return (
        entry.materialName.toLowerCase().includes(query) ||
        (entry.supplierName && entry.supplierName.toLowerCase().includes(query)) ||
        entry.responsible.toLowerCase().includes(query) ||
        new Date(entry.entryDate).toLocaleDateString('pt-BR').includes(query)
      )
    })
  }, [entries, searchQuery])

  if (entries.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhuma entrada registrada ainda</p>
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
          placeholder="Pesquisar por material, fornecedor, responsável ou data..."
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
                <TableHead>Data</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhuma entrada encontrada com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {entry.entryDate.includes('T') 
                        ? entry.entryDate.split('T')[0].split('-').reverse().join('/')
                        : entry.entryDate.split('-').reverse().join('/')}
                    </TableCell>
                    <TableCell className="font-medium">{entry.materialName}</TableCell>
                    <TableCell>{entry.quantity}</TableCell>
                    <TableCell>{capitalizeFirst(entry.unit)}</TableCell>
                    <TableCell>R$ {entry.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{entry.supplierName || '-'}</TableCell>
                    <TableCell>{entry.responsible}</TableCell>
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
                            <DropdownMenuItem onClick={() => onEdit(entry.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(entry.id)}
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

      {filteredEntries.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredEntries.length} de {entries.length} entrada(s)
        </div>
      )}
    </div>
  )
}

