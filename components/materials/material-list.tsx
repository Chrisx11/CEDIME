'use client'

import { useState, useMemo } from 'react'
import { Material } from '@/lib/data-context'
import { useData } from '@/lib/data-context'
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
import { Edit, Trash2, MoreVertical, Search } from 'lucide-react'
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
}

export function MaterialList({ materials, onEdit, onDelete }: MaterialListProps) {
  const [searchQuery, setSearchQuery] = useState('')

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
      {/* Barra de Pesquisa */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por nome, categoria ou unidade..."
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
                <TableHead>Categoria</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum material encontrado com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map(material => {
                  const isLow = material.quantity <= material.minQuantity
                  return (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.name}
                      </TableCell>
                      <TableCell>{getCategoryLabel(material.category)}</TableCell>
                      <TableCell>{material.quantity} {material.unit}</TableCell>
                      <TableCell>{material.minQuantity} {material.unit}</TableCell>
                      <TableCell>R$ {material.unitPrice.toFixed(2)}</TableCell>
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
