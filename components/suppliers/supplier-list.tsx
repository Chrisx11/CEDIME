'use client'

import { useState, useMemo } from 'react'
import { Supplier } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { maskCNPJ, maskPhone } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SupplierListProps {
  suppliers: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (id: string) => void
}

export function SupplierList({ suppliers, onEdit, onDelete }: SupplierListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Usar useMemo para garantir que o filtro seja recalculado
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return suppliers
    }

    const query = searchQuery.trim().toLowerCase()
    const queryNumbers = searchQuery.replace(/\D/g, '')

    const result = suppliers.filter(supplier => {
      const nameMatch = supplier.name.toLowerCase().includes(query)
      const cityMatch = supplier.city.toLowerCase().includes(query)
      const stateMatch = supplier.state && supplier.state.toLowerCase().includes(query)
      
      // Buscar por CNPJ (com ou sem máscara) - só se houver números na busca
      let cnpjMatch = false
      if (queryNumbers.length > 0 && supplier.cnpj) {
        const cnpjUnmasked = supplier.cnpj.replace(/\D/g, '')
        cnpjMatch = cnpjUnmasked.includes(queryNumbers)
      }
      if (!cnpjMatch && supplier.cnpj) {
        const cnpjFormatted = maskCNPJ(supplier.cnpj)
        cnpjMatch = cnpjFormatted.toLowerCase().includes(query)
      }
      
      // Buscar por telefone (com ou sem máscara) - só se houver números na busca
      let phoneMatch = false
      if (supplier.phone) {
        if (queryNumbers.length > 0) {
          const phoneUnmasked = supplier.phone.replace(/\D/g, '')
          phoneMatch = phoneUnmasked.includes(queryNumbers)
        }
        if (!phoneMatch) {
          phoneMatch = maskPhone(supplier.phone).toLowerCase().includes(query)
        }
      }
      
      const matches = nameMatch || cityMatch || stateMatch || cnpjMatch || phoneMatch
      
      return matches
    })
    return result
  }, [suppliers, searchQuery])

  if (suppliers.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhum fornecedor cadastrado ainda</p>
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
          placeholder="Pesquisar por nome, CNPJ, cidade, estado ou telefone..."
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
                <TableHead>Estado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody key={`tbody-${filteredSuppliers.length}-${searchQuery}`}>
              {filteredSuppliers.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum fornecedor encontrado com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map(supplier => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{maskCNPJ(supplier.cnpj)}</TableCell>
                    <TableCell>{supplier.phone ? maskPhone(supplier.phone) : '-'}</TableCell>
                    <TableCell>{supplier.city}</TableCell>
                    <TableCell>{supplier.state || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        supplier.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {supplier.status === 'active' ? 'Ativo' : 'Inativo'}
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
                            <DropdownMenuItem onClick={() => onEdit(supplier)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(supplier.id)}
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

      {filteredSuppliers.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredSuppliers.length} de {suppliers.length} fornecedor(es)
        </div>
      )}
    </div>
  )
}
