'use client'

import { useState, useMemo } from 'react'
import { Output } from '@/lib/data-context'
import { useMaterials } from '@/hooks/use-materials'

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

interface OutputTableProps {
  outputs: Output[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function OutputTable({ outputs, onEdit, onDelete }: OutputTableProps) {
  const { materials: supabaseMaterials } = useMaterials()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Converter materiais para o formato esperado
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

  const filteredOutputs = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return outputs
    }

    const query = searchQuery.trim().toLowerCase()
    
    return outputs.filter(output => {
      return (
        output.materialName.toLowerCase().includes(query) ||
        (output.institutionName && output.institutionName.toLowerCase().includes(query)) ||
        output.responsible.toLowerCase().includes(query) ||
        new Date(output.outputDate).toLocaleDateString('pt-BR').includes(query)
      )
    })
  }, [outputs, searchQuery])

  if (outputs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhuma saída registrada ainda</p>
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
          placeholder="Pesquisar por material, instituição, responsável ou data..."
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
                <TableHead>Preço Médio</TableHead>
                <TableHead>Instituição</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOutputs.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhuma saída encontrada com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredOutputs.map(output => {
                  const material = materials.find(m => m.id === output.materialId)
                  const averagePrice = material ? material.unitPrice : 0
                  return (
                    <TableRow key={output.id}>
                      <TableCell>{output.outputDate.split('-').reverse().join('/')}</TableCell>
                      <TableCell className="font-medium">{output.materialName}</TableCell>
                      <TableCell>{output.quantity}</TableCell>
                      <TableCell>{capitalizeFirst(output.unit)}</TableCell>
                      <TableCell>R$ {averagePrice.toFixed(2)}</TableCell>
                      <TableCell>{output.institutionName || '-'}</TableCell>
                      <TableCell>{output.responsible}</TableCell>
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
                            <DropdownMenuItem onClick={() => onEdit(output.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(output.id)}
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
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {filteredOutputs.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredOutputs.length} de {outputs.length} saída(s)
        </div>
      )}
    </div>
  )
}

