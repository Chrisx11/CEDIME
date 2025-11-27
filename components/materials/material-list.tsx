'use client'

import { useMemo } from 'react'
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
import { Edit, Trash2, MoreVertical } from 'lucide-react'
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
  searchQuery: string
}

export function MaterialList({ materials, onEdit, onDelete, searchQuery }: MaterialListProps) {

  const getCategoryLabel = (category: string) => {
    // Retorna o próprio nome da categoria (todas são customizadas)
    return category
  }

  const filteredMaterials = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return materials
    }

    const query = searchQuery.trim().toLowerCase()
    
    return materials.filter(material => {
      const nameMatch = material.name.toLowerCase().includes(query)
      const categoryLabel = getCategoryLabel(material.category).toLowerCase()
      const categoryMatch = categoryLabel.includes(query)
      const unitMatch = material.unit.toLowerCase().includes(query)
      
      return nameMatch || categoryMatch || unitMatch
    })
  }, [materials, searchQuery])

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
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Valor Médio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum material encontrado com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map(material => {
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

      {filteredMaterials.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredMaterials.length} de {materials.length} material(is)
        </div>
      )}
    </div>
  )
}
