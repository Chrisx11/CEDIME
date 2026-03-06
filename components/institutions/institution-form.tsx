'use client'

import { useState, useEffect } from 'react'
import { Institution } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { School } from 'lucide-react'
import { maskPhone, unmaskPhone } from '@/lib/utils'

interface InstitutionFormProps {
  institution?: Institution
  isOpen: boolean
  onSubmit: (data: Omit<Institution, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function InstitutionForm({ institution, isOpen, onSubmit, onCancel }: InstitutionFormProps) {
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    phone: institution?.phone || '',
    city: institution?.city || '',
    state: institution?.state || '',
    principalName: institution?.principalName || '',
    status: (institution?.status || 'active') as 'active' | 'inactive'
  })

  useEffect(() => {
    if (isOpen && institution) {
      setFormData({
        name: institution.name,
        phone: institution.phone ? maskPhone(institution.phone) : '',
        city: institution.city,
        state: institution.state || '',
        principalName: institution.principalName,
        status: institution.status
      })
    } else if (isOpen && !institution) {
      setFormData({
        name: '',
        phone: '',
        city: '',
        state: '',
        principalName: '',
        status: 'active'
      })
    }
  }, [isOpen, institution])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      const masked = maskPhone(value)
      setFormData(prev => ({ ...prev, [name]: masked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Remover máscaras antes de enviar
    const dataToSubmit = {
      name: formData.name,
      phone: unmaskPhone(formData.phone),
      city: formData.city,
      state: formData.state,
      principalName: formData.principalName,
      status: formData.status,
      type: 'school' as const,
      cnpj: '',
      email: '',
      address: '',
    }
    onSubmit(dataToSubmit)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <School className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {institution ? 'Editar Instituição' : 'Nova Instituição'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Instituição</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Responsável</label>
              <input
                type="text"
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {institution ? 'Atualizar' : 'Criar'} Instituição
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
