'use client'

import { useMemo, useState } from 'react'
import { Material } from '@/lib/data-context'
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
import { Edit, Trash2, MoreVertical, ArrowUpDown, ArrowUp, ArrowDown, Package, DollarSign } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MaterialListProps {
  materials: Material[]
  onEdit: (material: Material) => void
  onDelete: (id: string) => void
  onAdjustStock?: (material: Material) => void
  onAdjustPrice?: (material: Material) => void
  searchQuery: string
  selectedCategory: string
}

export function MaterialList({ materials, onEdit, onDelete, onAdjustStock, onAdjustPrice, searchQuery, selectedCategory }: MaterialListProps) {
  const [sortColumn, setSortColumn] = useState<keyof Material | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const getCategoryLabel = (category: string) => {
    // Retorna o próprio nome da categoria (todas são customizadas)
    return category
  }

  const handleSort = (column: keyof Material) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ column }: { column: keyof Material }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />
  }

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = materials

    // Filtro de pesquisa
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(material => {
        const nameMatch = material.name.toLowerCase().includes(query)
        const categoryLabel = getCategoryLabel(material.category).toLowerCase()
        const categoryMatch = categoryLabel.includes(query)
        const unitMatch = material.unit.toLowerCase().includes(query)
        
        return nameMatch || categoryMatch || unitMatch
      })
    }

    // Filtro de categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory)
    }

    // Ordenação
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        
        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        return 0
      })
    }

    return filtered
  }, [materials, searchQuery, selectedCategory, sortColumn, sortDirection])

  if (materials.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhum material cadastrado ainda</p>
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
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Nome
                    <SortIcon column="name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Categoria
                    <SortIcon column="category" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center justify-end">
                    Estoque
                    <SortIcon column="quantity" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort('minQuantity')}
                >
                  <div className="flex items-center justify-end">
                    Mínimo
                    <SortIcon column="minQuantity" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('unit')}
                >
                  <div className="flex items-center">
                    Unidade
                    <SortIcon column="unit" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('unitPrice')}
                >
                  <div className="flex items-center">
                    Valor Médio
                    <SortIcon column="unitPrice" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    {searchQuery.trim() !== '' || selectedCategory !== 'all'
                      ? 'Nenhum material encontrado com os filtros aplicados.'
                      : 'Nenhum material cadastrado ainda'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedMaterials.map(material => {
                  // Usar os dados diretamente do material (já vêm do Supabase atualizados)
                  const stock = material.quantity
                  const averagePrice = material.unitPrice
                  const isLow = stock <= material.minQuantity
                  return (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.name}
                      </TableCell>
                      <TableCell>{getCategoryLabel(material.category)}</TableCell>
                      <TableCell>{stock}</TableCell>
                      <TableCell>{material.minQuantity}</TableCell>
                      <TableCell>
                        {material.unit.charAt(0).toUpperCase() + material.unit.slice(1)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(averagePrice)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isLow
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {isLow ? 'Estoque Baixo' : 'Normal'}
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
                              <DropdownMenuItem onClick={() => onEdit(material)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              {onAdjustStock && (
                                <DropdownMenuItem onClick={() => onAdjustStock(material)}>
                                  <Package className="h-4 w-4 mr-2" />
                                  Ajustar Estoque
                                </DropdownMenuItem>
                              )}
                              {onAdjustPrice && (
                                <DropdownMenuItem onClick={() => onAdjustPrice(material)}>
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Ajustar Preço Médio
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => onDelete(material.id)}
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

      {filteredAndSortedMaterials.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredAndSortedMaterials.length} de {materials.length} material(is)
        </div>
      )}
    </div>
  )
}
