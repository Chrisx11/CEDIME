'use client'

import { useState } from 'react'
import { useUnits, Unit } from '@/hooks/use-units'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Plus, X } from 'lucide-react'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface UnitDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function UnitDialog({ isOpen, onClose }: UnitDialogProps) {
  const { units, addUnit, updateUnit, deleteUnit, isLoading } = useUnits()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newName, setNewName] = useState('')
  const confirmDialog = useConfirmDialog()

  const handleAdd = async () => {
    if (!newName.trim()) {
      return
    }

    try {
      await addUnit(newName)
      setNewName('')
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleStartEdit = (unit: Unit) => {
    setEditingId(unit.id)
    setEditName(unit.name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) {
      return
    }

    try {
      await updateUnit(editingId, editName)
      setEditingId(null)
      setEditName('')
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleDelete = async (unit: Unit) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Unidade',
      description: `Tem certeza que deseja excluir a unidade "${unit.name}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      try {
        await deleteUnit(unit.id)
      } catch (error) {
        // Erro já foi tratado no hook
      }
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Gerenciar Unidades</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Formulário para adicionar nova unidade */}
            <div className="flex gap-2">
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAdd()
                  }
                }}
                placeholder="Nome da nova unidade"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {/* Lista de unidades */}
            <div className="border border-input rounded-md divide-y divide-border">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Carregando unidades...
                </div>
              ) : units.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhuma unidade cadastrada
                </div>
              ) : (
                units.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    {editingId === unit.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleSaveEdit()
                            } else if (e.key === 'Escape') {
                              handleCancelEdit()
                            }
                          }}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={!editName.trim()}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Salvar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 font-medium">
                          {unit.name.charAt(0).toUpperCase() + unit.name.slice(1)}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(unit)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(unit)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </>
  )
}

