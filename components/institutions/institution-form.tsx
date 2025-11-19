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
import { maskCNPJ, maskPhone, unmaskCNPJ, unmaskPhone } from '@/lib/utils'

interface InstitutionFormProps {
  institution?: Institution
  isOpen: boolean
  onSubmit: (data: Omit<Institution, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function InstitutionForm({ institution, isOpen, onSubmit, onCancel }: InstitutionFormProps) {
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    type: (institution?.type || 'school') as 'school' | 'center' | 'other',
    cnpj: institution?.cnpj || '',
    email: institution?.email || '',
    phone: institution?.phone || '',
    address: institution?.address || '',
    city: institution?.city || '',
    principalName: institution?.principalName || '',
    status: (institution?.status || 'active') as 'active' | 'inactive'
  })

  useEffect(() => {
    if (isOpen && institution) {
      setFormData({
        name: institution.name,
        type: institution.type,
        cnpj: maskCNPJ(institution.cnpj),
        email: institution.email,
        phone: institution.phone ? maskPhone(institution.phone) : '',
        address: institution.address,
        city: institution.city,
        principalName: institution.principalName,
        status: institution.status
      })
    } else if (isOpen && !institution) {
      setFormData({
        name: '',
        type: 'school',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        principalName: '',
        status: 'active'
      })
    }
  }, [isOpen, institution])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'cnpj') {
      const masked = maskCNPJ(value)
      setFormData(prev => ({ ...prev, [name]: masked }))
    } else if (name === 'phone') {
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
      ...formData,
      cnpj: unmaskCNPJ(formData.cnpj),
      phone: unmaskPhone(formData.phone)
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
              <label className="text-sm font-medium">Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="school">Escola</option>
                <option value="center">Centro Educacional</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                maxLength={18}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
              <label className="text-sm font-medium">Diretor/Responsável</label>
              <input
                type="text"
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Endereço</label>
              <input
                type="text"
                name="address"
                value={formData.address}
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
