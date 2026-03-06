'use client'

import { useState, useMemo } from 'react'
import { Request } from '@/lib/data-context'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, MoreVertical, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface RequestListProps {
  requests: Request[]
  onEdit: (request: Request) => void
  onDelete: (id: string) => void
}

export function RequestList({ requests, onEdit, onDelete }: RequestListProps) {
  const { institutions } = useData()
  const [searchTerm, setSearchTerm] = useState('')

  const getInstitutionName = (institutionId: string) => {
    return institutions.find(i => i.id === institutionId)?.name || 'Desconhecido'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      approved: 'Aprovada',
      delivered: 'Entregue',
      cancelled: 'Cancelada'
    }
    return labels[status] || status
  }

  const filteredRequests = useMemo(() => {
    if (searchTerm.trim() === '') {
      return requests
    }
    
    const searchLower = searchTerm.toLowerCase().trim()
    
    return requests.filter(request => {
      const institutionName = getInstitutionName(request.institution).toLowerCase()
      const statusLabel = getStatusLabel(request.status).toLowerCase()
      const requestNumber = request.requestNumber.toLowerCase()
      const requiredDate = new Date(request.requiredDate).toLocaleDateString('pt-BR')
      
      return (
        requestNumber.includes(searchLower) ||
        institutionName.includes(searchLower) ||
        statusLabel.includes(searchLower) ||
        requiredDate.includes(searchTerm) ||
        request.items.some(item => item.materialName.toLowerCase().includes(searchLower))
      )
    })
  }, [requests, searchTerm, institutions])

  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhuma requisição cadastrada ainda</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquisar por número, instituição, status, data ou material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredRequests.length === 0 && searchTerm.trim() !== '' ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Nenhuma requisição encontrada com o termo "{searchTerm}"</p>
        </Card>
      ) : (
        <>
          {filteredRequests.map(request => (
        <Card key={request.id} className="p-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{request.requestNumber}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                <div><strong>Instituição:</strong> {getInstitutionName(request.institution)}</div>
                <div><strong>Data Necessária:</strong> {new Date(request.requiredDate).toLocaleDateString()}</div>
                <div><strong>Itens:</strong> {request.items.length}</div>
                <div><strong>Valor Total:</strong> R$ {request.totalValue.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(request)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(request.id)}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 max-h-40 overflow-y-auto">
            <div className="text-sm font-medium mb-2">Itens:</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              {request.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.materialName} x{item.quantity}</span>
                  <span>R$ {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
      {filteredRequests.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredRequests.length} de {requests.length} requisição(ões)
        </div>
      )}
        </>
      )}
    </div>
  )
}
