'use client'

import { useState, useMemo } from 'react'
import { Delivery } from '@/lib/data-context'
import { useDeliveries, Delivery as DeliveryType } from '@/hooks/use-deliveries'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Search, MoreVertical, Trash2 } from 'lucide-react'
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

interface DeliveryTableProps {
  deliveries: Delivery[]
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: 'pending' | 'received' | 'cancelled') => void
}

export function DeliveryTable({ deliveries, onDelete, onUpdateStatus }: DeliveryTableProps) {
  const { deliveries: supabaseDeliveries } = useDeliveries()
  const [searchQuery, setSearchQuery] = useState('')
  const confirmDialog = useConfirmDialog()

  // Criar mapa de deliveries para buscar supplier_name
  const deliveriesMap = useMemo(() => {
    return new Map(supabaseDeliveries.map(d => [d.id, d.supplier_name]))
  }, [supabaseDeliveries])

  const getSupplierName = (supplierId: string, deliveryId: string) => {
    // Buscar pelo deliveryId primeiro (mais confiável)
    const delivery = supabaseDeliveries.find(d => d.id === deliveryId)
    if (delivery) {
      return delivery.supplier_name
    }
    return 'Desconhecido'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      received: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      received: 'Recebida',
      cancelled: 'Cancelada'
    }
    return labels[status] || status
  }

  const filteredDeliveries = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return deliveries
    }

    const query = searchQuery.trim().toLowerCase()
    
    return deliveries.filter(delivery => {
      const supplierName = getSupplierName(delivery.supplier, delivery.id).toLowerCase()
      const statusLabel = getStatusLabel(delivery.status).toLowerCase()
      const deliveryNumber = delivery.deliveryNumber.toLowerCase()
      const deliveryDate = delivery.deliveryDate.includes('T')
        ? delivery.deliveryDate.split('T')[0]
        : delivery.deliveryDate
      const formattedDate = new Date(deliveryDate).toLocaleDateString('pt-BR')
      
      return (
        deliveryNumber.includes(query) ||
        supplierName.includes(query) ||
        statusLabel.includes(query) ||
        formattedDate.includes(query) ||
        delivery.items.some(item => item.materialName.toLowerCase().includes(query))
      )
    })
  }, [deliveries, searchQuery, supabaseDeliveries])

  const handleDelete = async (id: string) => {
    const delivery = deliveries.find(d => d.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Entrega',
      description: `Tem certeza que deseja excluir a entrega "${delivery?.deliveryNumber}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      onDelete(id)
    }
  }

  if (deliveries.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhuma entrega cadastrada ainda</p>
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
          placeholder="Pesquisar por número, fornecedor, status, data ou material..."
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
                <TableHead>Fornecedor</TableHead>
                <TableHead>Data da Entrega</TableHead>
                <TableHead>Materiais</TableHead>
                <TableHead>Qtd. Itens</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.length === 0 && searchQuery.trim() !== '' ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhuma entrega encontrada com o termo "{searchQuery}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeliveries.map(delivery => {
                  const deliveryDate = delivery.deliveryDate.includes('T')
                    ? delivery.deliveryDate.split('T')[0]
                    : delivery.deliveryDate
                  return (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.deliveryNumber}</TableCell>
                    <TableCell>{getSupplierName(delivery.supplier, delivery.id)}</TableCell>
                    <TableCell>{new Date(deliveryDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm space-y-1">
                          {delivery.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                              • {item.materialName} - {item.quantity} un.
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{delivery.items.length}</TableCell>
                    <TableCell className="font-medium">R$ {delivery.totalValue.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(delivery.status)}`}>
                        {getStatusLabel(delivery.status)}
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
                              onClick={() => onUpdateStatus(delivery.id, 'pending')}
                              disabled={delivery.status === 'pending'}
                            >
                              {delivery.status === 'pending' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                              {delivery.status !== 'pending' && <span className="w-4 mr-2" />}
                              Pendente
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(delivery.id, 'received')}
                              disabled={delivery.status === 'received'}
                            >
                              {delivery.status === 'received' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                              {delivery.status !== 'received' && <span className="w-4 mr-2" />}
                              Recebida
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(delivery.id, 'cancelled')}
                              disabled={delivery.status === 'cancelled'}
                            >
                              {delivery.status === 'cancelled' && <CheckCircle2 className="h-4 w-4 mr-2" />}
                              {delivery.status !== 'cancelled' && <span className="w-4 mr-2" />}
                              Cancelada
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(delivery.id)}
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

      {filteredDeliveries.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredDeliveries.length} de {deliveries.length} entrega(s)
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

