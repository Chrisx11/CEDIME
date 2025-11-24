'use client'

import { useState, useMemo } from 'react'
import { Request } from '@/lib/data-context'
import { useInstitutions } from '@/hooks/use-institutions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Search, MoreVertical, Trash2, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CheckCircle2 } from 'lucide-react'

interface RequestTableProps {
  requests: Request[]
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: 'pending' | 'approved' | 'delivered' | 'cancelled') => void
  onGenerateReceipt: (request: Request) => void
}

export function RequestTable({ requests, onDelete, onUpdateStatus, onGenerateReceipt }: RequestTableProps) {
  const { institutions: supabaseInstitutions } = useInstitutions()
  const [searchQuery, setSearchQuery] = useState('')
  const confirmDialog = useConfirmDialog()

  // Converter instituições para o formato esperado
  const institutions = useMemo(() => {
    return supabaseInstitutions.map(i => ({
      id: i.id,
      name: i.name,
      type: 'school' as const,
      cnpj: '',
      email: '',
      phone: i.phone || '',
      address: '',
      city: i.city,
      state: i.state,
      principalName: i.principal_name,
      status: i.status,
      createdAt: i.created_at,
    }))
  }, [supabaseInstitutions])

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
    if (!searchQuery || searchQuery.trim() === '') {
      return requests
    }

    const query = searchQuery.trim().toLowerCase()
    
    return requests.filter(request => {
      const institutionName = getInstitutionName(request.institution).toLowerCase()
      const statusLabel = getStatusLabel(request.status).toLowerCase()
      const requestNumber = request.requestNumber.toLowerCase()
      const requiredDate = new Date(request.requiredDate).toLocaleDateString('pt-BR')
      
      return (
        requestNumber.includes(query) ||
        institutionName.includes(query) ||
        statusLabel.includes(query) ||
        requiredDate.includes(query) ||
        request.items.some(item => item.materialName.toLowerCase().includes(query))
      )
    })
  }, [requests, searchQuery, institutions])

  const handleDelete = async (id: string) => {
    const request = requests.find(r => r.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Requisição',
      description: `Tem certeza que deseja excluir a requisição "${request?.requestNumber}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      onDelete(id)
    }
  }

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
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por número, instituição, status, data ou material..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          autoComplete="off"
        />
      </div>

      {/* Tabela */}
      <Card className="overflow-visible">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Instituição</TableHead>
                <TableHead>Data Necessária</TableHead>
                <TableHead>Materiais</TableHead>
                <TableHead>Qtd. Itens</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhuma requisição encontrada com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.requestNumber}</TableCell>
                    <TableCell>{getInstitutionName(request.institution)}</TableCell>
                    <TableCell>{new Date(request.requiredDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm space-y-1">
                          {request.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                              • {item.materialName} - {item.quantity} un.
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{request.items.length}</TableCell>
                    <TableCell className="font-medium">R$ {request.totalValue.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
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
                          <DropdownMenuContent align="end" className="z-50">
                            <DropdownMenuItem
                              onClick={() => onGenerateReceipt(request)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Gerar Canhoto
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(request.id, 'pending')}
                              disabled={request.status === 'pending'}
                            >
                              {request.status === 'pending' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                              {request.status !== 'pending' && <span className="w-4 mr-2" />}
                              Pendente
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(request.id, 'approved')}
                              disabled={request.status === 'approved'}
                            >
                              {request.status === 'approved' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                              {request.status !== 'approved' && <span className="w-4 mr-2" />}
                              Aprovada
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(request.id, 'delivered')}
                              disabled={request.status === 'delivered'}
                            >
                              {request.status === 'delivered' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                              {request.status !== 'delivered' && <span className="w-4 mr-2" />}
                              Entregue
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(request.id, 'cancelled')}
                              disabled={request.status === 'cancelled'}
                            >
                              {request.status === 'cancelled' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                              {request.status !== 'cancelled' && <span className="w-4 mr-2" />}
                              Cancelada
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(request.id)}
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

      {filteredRequests.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredRequests.length} de {requests.length} requisição(ões)
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.options.title}
        description={confirmDialog.options.description}
        confirmText={confirmDialog.options.confirmText}
        cancelText={confirmDialog.options.cancelText}
        variant={confirmDialog.options.variant}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />
    </div>
  )
}

