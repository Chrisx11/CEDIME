'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface Supplier {
  id: string
  name: string
  cnpj: string
  phone: string
  city: string
  state: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Institution {
  id: string
  name: string
  type: 'school' | 'center' | 'other'
  cnpj: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  principalName: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Material {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  minQuantity: number
  unitPrice: number
  lastUpdate: string
}

export interface Request {
  id: string
  requestNumber: string
  institution: string
  requiredDate: string
  status: 'pending' | 'approved' | 'delivered' | 'cancelled'
  items: RequestItem[]
  totalValue: number
  createdAt: string
}

export interface RequestItem {
  materialId: string
  materialName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Delivery {
  id: string
  deliveryNumber: string
  supplier: string
  deliveryDate: string
  status: 'pending' | 'received' | 'cancelled'
  items: DeliveryItem[]
  totalValue: number
  createdAt: string
}

export interface DeliveryItem {
  materialId: string
  materialName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Entry {
  id: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  unitPrice: number
  supplierId?: string
  supplierName?: string
  reason: string
  responsible: string
  entryDate: string
  createdAt: string
}

export interface Output {
  id: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  institutionId?: string
  institutionName?: string
  reason: string
  responsible: string
  outputDate: string
  createdAt: string
}

interface DataContextType {
  suppliers: Supplier[]
  institutions: Institution[]
  materials: Material[]
  requests: Request[]
  deliveries: Delivery[]
  entries: Entry[]
  outputs: Output[]
  customCategories: string[]
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  addInstitution: (institution: Omit<Institution, 'id' | 'createdAt'>) => void
  updateInstitution: (id: string, institution: Partial<Institution>) => void
  deleteInstitution: (id: string) => void
  addMaterial: (material: Omit<Material, 'id' | 'lastUpdate'>) => void
  updateMaterial: (id: string, material: Partial<Material>) => void
  deleteMaterial: (id: string) => void
  addRequest: (request: Omit<Request, 'id' | 'requestNumber' | 'createdAt'>) => void
  addRequests: (requests: Array<Omit<Request, 'id' | 'requestNumber' | 'createdAt'>>) => void
  updateRequest: (id: string, request: Partial<Request>) => void
  deleteRequest: (id: string) => void
  addDelivery: (delivery: Omit<Delivery, 'id' | 'deliveryNumber' | 'createdAt'>) => void
  addDeliveries: (deliveries: Array<Omit<Delivery, 'id' | 'deliveryNumber' | 'createdAt'>>) => void
  updateDelivery: (id: string, delivery: Partial<Delivery>) => void
  deleteDelivery: (id: string) => void
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => void
  updateEntry: (id: string, entry: Partial<Entry>) => void
  deleteEntry: (id: string) => void
  deleteAllEntries: () => void
  addOutput: (output: Omit<Output, 'id' | 'createdAt'>) => void
  updateOutput: (id: string, output: Partial<Output>) => void
  deleteOutput: (id: string) => void
  deleteAllOutputs: () => void
  getMaterialStock: (materialId: string) => number
  getMaterialAveragePrice: (materialId: string) => number
  addCustomCategory: (category: string) => void
  seedInitialData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [entries, setEntries] = useState<Entry[]>([])
  const [outputs, setOutputs] = useState<Output[]>([])
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Dados iniciais (seed data)
  const getInitialData = () => {
    // Fornecedores
    const initialSuppliers: Supplier[] = [
      { id: 'supplier-1', name: 'BOM BEEF-MENDEL', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-2', name: 'ALPHES', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-3', name: 'ALMERINDO', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-4', name: 'BR-LIFE', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-5', name: 'CMR - THIERRY', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-6', name: 'COMERCIAL-DESTAQUE', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-7', name: 'COPAFI', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-8', name: 'DELBA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-9', name: 'DO FILHO - DDG', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-10', name: 'FABIANA-BANANA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-11', name: 'GÉLSON - AGRICULTURA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-12', name: 'GUIMARÃES PADARIA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-13', name: 'HLL-IGOR', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-14', name: 'IMPA-BILINHO', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-15', name: 'LEONILDO-AGRICULTURA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-16', name: 'LINDOMAR', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-17', name: 'M.A APARECIDA - BILINHO', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-18', name: 'MA-MARQUINHO', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-19', name: 'MARIANA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-20', name: 'MILENA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-21', name: 'PETRO QUEIROZ-GÁS', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-22', name: 'PICA - PAU', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-23', name: 'RO-SACOMAN', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-24', name: 'SÃO FRANCISCANA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-25', name: 'TONINHO RESENDE', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-26', name: 'T-SOARES-MARQUINHO', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-27', name: 'ÚNICA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-28', name: 'UTIBRINK-JOSELMO', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-29', name: 'VANDERSON ROCHA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-30', name: 'WILSON RICARDO', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
      { id: 'supplier-31', name: 'WS-CALDEIRA', cnpj: '00.000.000/0000-00', phone: '(00) 00000-0000', city: 'ITALVA', state: 'RJ', status: 'active', createdAt: new Date().toISOString() },
    ]

    // Instituições
    const initialInstitutions: Institution[] = [
      { id: 'institution-1', name: 'GLYCERIO SALLES', type: 'school', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-2', name: 'SÃO PEDRO', type: 'school', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-3', name: 'SECRETARIA DE EDUCAÇÃO', type: 'other', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-4', name: 'SEVERINO', type: 'school', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-5', name: 'TRANSPORTE ESCOLAR', type: 'other', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-6', name: 'VOVÓ CELITA', type: 'school', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-7', name: 'CRECHE', type: 'center', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-8', name: 'DR MATTOS', type: 'school', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-9', name: 'JOÃO BARCELOS', type: 'school', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
      { id: 'institution-10', name: 'ANTÔNIO FERREIRA', type: 'school', cnpj: '00.000.000/0000-00', email: '', phone: '(00) 00000-0000', address: '', city: 'ITALVA', state: 'RJ', principalName: '', status: 'active', createdAt: new Date().toISOString() },
    ]

    // Produtos cadastrados
    const initialMaterials: Material[] = [
      // ALIMENTO PERECÍVEL
      { id: 'mat-1', name: 'AIPIM', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-2', name: 'ABÓBORA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-3', name: 'ABACATE', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-4', name: 'ABOBRINHA VERDE', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-5', name: 'ALFACE', category: 'ALIMENTO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-6', name: 'ALHO', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-7', name: 'BANANA PRATA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-8', name: 'BATATA INGLESA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-9', name: 'BATATA DOCE', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-10', name: 'BETERRABA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-11', name: 'CEBOLA BRANCA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-12', name: 'CEBOLINHA', category: 'ALIMENTO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-13', name: 'CENOURA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-14', name: 'CHUCHU', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-15', name: 'COLORAL', category: 'ALIMENTO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-16', name: 'COUVE VERDE', category: 'ALIMENTO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-17', name: 'INHAME', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-18', name: 'LARANJA LIMA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-19', name: 'MAÇA VERMELHA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-20', name: 'MAMÃO FORMOSA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-21', name: 'MANGA', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-22', name: 'MELANCIA', category: 'ALIMENTO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-23', name: 'PIMENTÃO', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-24', name: 'REPOLHO', category: 'ALIMENTO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-25', name: 'SALSA', category: 'ALIMENTO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-26', name: 'TOMATE', category: 'ALIMENTO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      
      // ALIMENTO NÃO PERECÍVEL
      { id: 'mat-27', name: 'ARROZ BRANCO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-28', name: 'AMIDO DE MILHO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-29', name: 'AÇUCAR', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-30', name: 'MUCILAGEM', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-31', name: 'AVEIA EM FLOCOS', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-32', name: 'AZEITE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-33', name: 'AZEITONA VERDE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-34', name: 'BISCOITO SAL', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-35', name: 'BISCOITO DOCE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-36', name: 'CANJICA AMARELO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-37', name: 'CANJICA BRANCA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-38', name: 'CREME DE LEITE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-39', name: 'EXTRATO TOMATE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-40', name: 'FARINHA MANDIOCA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-41', name: 'FARINHA QUIBE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-42', name: 'FARINHA DE TRIGO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-43', name: 'FARINHA LACTEA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-44', name: 'FEIJÃO PRETO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-45', name: 'FEIJÃOVERMELHO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-46', name: 'FUBÁ', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-47', name: 'MACARRÃO PARAFUSO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-48', name: 'MACARRÃO ESPAGUETE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-49', name: 'MACARRÃO ARGOLINHA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-50', name: 'MILHO PIPOCA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-51', name: 'MILHO VERDE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-52', name: 'MOLHO TOMATE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-53', name: 'MULTI CEREAIS', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-54', name: 'OLEO SOJA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-55', name: 'PÓ CAFÉ', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-56', name: 'SAL', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-57', name: 'SUCO MARACUJA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-58', name: 'SUCO CAJU', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-59', name: 'SUCO PESSEGO', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-60', name: 'SUCO DE MANGA', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-61', name: 'SUCO DE UVA INTEGRAL', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-62', name: 'VINAGRE', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-63', name: 'SUPLEMENTO INFANTIL', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-64', name: 'FERMENTO EM PÓ', category: 'ALIMENTO NÃO PERECÍVEL', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      
      // LATICÍNIOS
      { id: 'mat-65', name: 'IOGURTE', category: 'LATICÍNIOS', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-66', name: 'LEITE EM PÓ', category: 'LATICÍNIOS', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-67', name: 'LEITE PASTEURIZADO', category: 'LATICÍNIOS', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-68', name: 'MANTEIGA', category: 'LATICÍNIOS', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-69', name: 'MARGARINA VEGETAL', category: 'LATICÍNIOS', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      
      // PROTEÍNAS
      { id: 'mat-70', name: 'FRANGO', category: 'PROTEÍNAS', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-71', name: 'PATINHO PICADO', category: 'PROTEÍNAS', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-72', name: 'PATINHO MOÍDO', category: 'PROTEÍNAS', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-73', name: 'PEIXE', category: 'PROTEÍNAS', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-74', name: 'OVOS', category: 'PROTEÍNAS', unit: 'dúzia', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      
      // MATERIAL LIMPEZA
      { id: 'mat-75', name: 'AMACIANTE', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-76', name: 'ÁLCOOL 70%', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-77', name: 'ÁGUA SANITÁRIA', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-78', name: 'ÁLCOOL GEL', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-79', name: 'CERA LÍQUIDA INCOLOR', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-80', name: 'CLORO', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-81', name: 'CONDICIONADOR INFANTIL', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-82', name: 'CREME DENTAL', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-83', name: 'CREME DERMATOLÓGICO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-84', name: 'DESINFETANTE', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-85', name: 'DETERGENTE', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-86', name: 'ESPONJA DE AÇO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-87', name: 'ESPONJA MULTIUSO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-88', name: 'FLANELA', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-89', name: 'FÓSFORO', category: 'MATERIAL LIMPEZA', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-90', name: 'FRALDA G', category: 'MATERIAL LIMPEZA', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-91', name: 'FRALDA GG', category: 'MATERIAL LIMPEZA', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-92', name: 'FRALDA M', category: 'MATERIAL LIMPEZA', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-93', name: 'FRALDA P', category: 'MATERIAL LIMPEZA', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-94', name: 'FRALDA XG', category: 'MATERIAL LIMPEZA', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-95', name: 'FRALDA XXG', category: 'MATERIAL LIMPEZA', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-96', name: 'INSETICIDA', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-97', name: 'LÂMPADA LED 50W', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-98', name: 'LENÇO UMEDECIDO', category: 'MATERIAL LIMPEZA', unit: 'pacote', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-99', name: 'LIMPADOR MULTIUSO', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-100', name: 'LIXEIRA 10L', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-101', name: 'LIXEIRA 120L', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-102', name: 'LIXEIRA 240 L', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-103', name: 'LIXEIRA 50L', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-104', name: 'LUVA LIMPEZA', category: 'MATERIAL LIMPEZA', unit: 'par', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-105', name: 'OLÉO INFANTIL', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-106', name: 'PA DE LIXO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-107', name: 'PANO CHÃO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-108', name: 'PANO DE PRATO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-109', name: 'PANO LIMPEZA', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-110', name: 'PAPEL ALUMÍNIO', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-111', name: 'PAPEL HIGIENICO', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-112', name: 'PAPEL INTERFOLHADO', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-113', name: 'PAPEL TOALHA BANHEIRO', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-114', name: 'PAPEL TOALHA COZINHA', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-115', name: 'PLAFONIER', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-116', name: 'PREGADOR DE ROUPA', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-117', name: 'REGULADOR DE GÁS', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-118', name: 'RODO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-119', name: 'ROLO SACOLA ALIMENTO', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-120', name: 'SABÃO DE COCO', category: 'MATERIAL LIMPEZA', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-121', name: 'SABÃO EM BARRA', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-122', name: 'SABÃO EM PO', category: 'MATERIAL LIMPEZA', unit: 'kg', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-123', name: 'SABONETE LÍQUIDO', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-124', name: 'SACO LIXO 100L', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-125', name: 'SACO LIXO 200L', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-126', name: 'SACO LIXO 50L', category: 'MATERIAL LIMPEZA', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-127', name: 'SHAMPOO', category: 'MATERIAL LIMPEZA', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-128', name: 'TALCO', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-129', name: 'TOUCA', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-130', name: 'VASSOURA', category: 'MATERIAL LIMPEZA', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      
      // MATERIAL ESCOLAR
      { id: 'mat-131', name: 'APLICADOR DE COLA QUENTE', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-132', name: 'A4 COLORIDO', category: 'MATERIAL ESCOLAR', unit: 'resma', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-133', name: 'A4 BRANCO', category: 'MATERIAL ESCOLAR', unit: 'resma', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-134', name: 'APAGADOR P/ QUADRO BRANCO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-135', name: 'APONTADOR', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-136', name: 'APONTADOR COM DEPOSITO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-137', name: 'BARBANTE', category: 'MATERIAL ESCOLAR', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-138', name: 'BASTÃO COLA QUENTE FINA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-139', name: 'BASTÃO COLA QUENTE GROSSA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-140', name: 'BLOCO PEDIDO COMERCIAL', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-141', name: 'BORRACHA BRANCA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-142', name: 'CADERNO BROCHURA PEQUENO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-143', name: 'CADERNO DE CALIGRAFIA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-144', name: 'CADERNO UNIVERSITARIO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-145', name: 'CAIXA P/ ARQUIVO MORTO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-146', name: 'CANETA BPS', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-147', name: 'CANETA ESFEROGRÁFICA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-148', name: 'CANETA QUADRO AZUL', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-149', name: 'CANETA QUADRO PRETA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-150', name: 'CANETA QUADRO VERMELHA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-151', name: 'CANETINHA HIDROCOR', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-152', name: 'CAPA ENCADERNAÇÃO PRETA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-153', name: 'CAPA ENCADERNAÇÃO TRANSPARENTE', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-154', name: 'CARTOLINA DUPLA FACE', category: 'MATERIAL ESCOLAR', unit: 'folha', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-155', name: 'CLIPS 1/0', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-156', name: 'CLIPS 2/0', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-157', name: 'CLIPS 3/0', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-158', name: 'CLIPS 4/0', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-159', name: 'COLA BASTÃO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-160', name: 'COLA BRANCA 500G', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-161', name: 'COLA BRANCA 90G', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-162', name: 'COLA COLORIDA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-163', name: 'COLA GLITTER', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-164', name: 'COLA ISOPOR', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-165', name: 'COLOR JET BRANCO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-166', name: 'COLOR JET CINZA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-167', name: 'COLOR JET DOURADO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-168', name: 'COLOR JET PRATA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-169', name: 'COLOR JET PRETO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-170', name: 'COLOR JET VERMELHO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-171', name: 'CORRETIVO FITA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-172', name: 'ENVELOPE A4 BRANCO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-173', name: 'ENVELOPE A4 OURO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-174', name: 'ENVELOPE PLASTICO A4', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-175', name: 'EVA FOSCO', category: 'MATERIAL ESCOLAR', unit: 'folha', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-176', name: 'EVA GLITTER', category: 'MATERIAL ESCOLAR', unit: 'folha', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-177', name: 'FITA ADESIVA 12MM', category: 'MATERIAL ESCOLAR', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-178', name: 'FITA ADESIVA 48MM', category: 'MATERIAL ESCOLAR', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-179', name: 'FITA ADESIVA 48MM MARROM', category: 'MATERIAL ESCOLAR', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-180', name: 'FITA ADESIVA COLORIDA', category: 'MATERIAL ESCOLAR', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-181', name: 'FITA CREPE BRANCA', category: 'MATERIAL ESCOLAR', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-182', name: 'FOLHA A4 ADESIVA', category: 'MATERIAL ESCOLAR', unit: 'folha', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-183', name: 'GIZ DE CERA', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-184', name: 'GRAMPEADOR ALICATE', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-185', name: 'GRAMPEADOR ROCAMA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-186', name: 'GRAMPO 106/6', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-187', name: 'GRAMPO 23/13', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-188', name: 'GRAMPO 26/6', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-189', name: 'GRAMPO DE PASTA', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-190', name: 'LÁPIS DE COR', category: 'MATERIAL ESCOLAR', unit: 'caixa', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-191', name: 'LÁPIS JUMBO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-192', name: 'LÁPIS PRETO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-193', name: 'LIVRO DE ATA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-194', name: 'LIVRO DE PONTO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-195', name: 'MARCA TEXTO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-196', name: 'MASSA MODELAR', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-197', name: 'PAPEL BRANCO 40KG', category: 'MATERIAL ESCOLAR', unit: 'resma', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-198', name: 'PAPEL MICRO ONDULADO', category: 'MATERIAL ESCOLAR', unit: 'rolo', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-199', name: 'PAPEL OURO 40K', category: 'MATERIAL ESCOLAR', unit: 'resma', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-200', name: 'PASTA CATÁLOGO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-201', name: 'PASTA COM GRAMPO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-202', name: 'PASTA LISA TRANSPARENTE', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-203', name: 'PASTA PAPELÃO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-204', name: 'PASTA USPENSA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-205', name: 'PEN DRIVE 16G', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-206', name: 'PEN DRIVE 32G', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-207', name: 'PENAS COLORIDAS', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-208', name: 'PERFURADOR DE PAPEL', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-209', name: 'PINCEL 08', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-210', name: 'PINCEL 12', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-211', name: 'PINCEL 20', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-212', name: 'PINCEL PERMANENTE AZUL', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-213', name: 'PINCEL PERMANENTE PRETO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-214', name: 'PINCEL PERMANENTE VERMELHO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-215', name: 'PORTA DOCUMENTOS', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-216', name: 'RÉGUA', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-217', name: 'TESOURA ESCOLAR', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-218', name: 'TESOURA ESCRITÓRIO', category: 'MATERIAL ESCOLAR', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-219', name: 'TINTA QUADRO AZUL', category: 'MATERIAL ESCOLAR', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-220', name: 'TINTA QUADRO PRETA', category: 'MATERIAL ESCOLAR', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-221', name: 'TINTA QUADRO VERMELHA', category: 'MATERIAL ESCOLAR', unit: 'litro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-222', name: 'TNT', category: 'MATERIAL ESCOLAR', unit: 'metro', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      
      // GÁS
      { id: 'mat-223', name: 'P13', category: 'GÁS', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
      { id: 'mat-224', name: 'P45', category: 'GÁS', unit: 'unidade', quantity: 0, minQuantity: 0, unitPrice: 0, lastUpdate: new Date().toISOString() },
    ]

    return { initialSuppliers, initialMaterials, initialInstitutions }
  }

  // Carregar categorias customizadas
  useEffect(() => {
    const storedCategories = localStorage.getItem('cedim_custom_categories')
    if (storedCategories) {
      try {
        setCustomCategories(JSON.parse(storedCategories))
      } catch (e) {
        console.error('Erro ao carregar categorias customizadas:', e)
      }
    } else {
      // Adicionar categorias padrão se não existirem
      const defaultCategories = [
        'ALIMENTO PERECÍVEL',
        'ALIMENTO NÃO PERECÍVEL',
        'LATICÍNIOS',
        'PROTEÍNAS',
        'MATERIAL LIMPEZA',
        'MATERIAL ESCOLAR',
        'GÁS'
      ]
      setCustomCategories(defaultCategories)
    }
  }, [])

  // Salvar categorias customizadas
  useEffect(() => {
    if (customCategories.length > 0 || localStorage.getItem('cedim_custom_categories')) {
      localStorage.setItem('cedim_custom_categories', JSON.stringify(customCategories))
    }
  }, [customCategories])

  // Carregar dados do localStorage ou usar dados iniciais
  useEffect(() => {
    if (isInitialized) return
    
    const stored = localStorage.getItem('cedim_data')
    const { initialSuppliers, initialMaterials, initialInstitutions } = getInitialData()
    
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Verificar se já tem dados ou se precisa popular
        const hasSuppliers = data.suppliers && Array.isArray(data.suppliers) && data.suppliers.length > 0
        const hasMaterials = data.materials && Array.isArray(data.materials) && data.materials.length > 0
        const hasInstitutions = data.institutions && Array.isArray(data.institutions) && data.institutions.length > 0
        
        // Sempre popular se não tiver dados
        if (!hasSuppliers) {
          setSuppliers(initialSuppliers)
        } else {
          // Remover emails e addresses de fornecedores antigos (compatibilidade)
          const cleanedSuppliers = data.suppliers.map((s: any) => {
            const { email, address, ...rest } = s
            // Se não tiver state, tentar inferir da cidade ou usar vazio
            if (!rest.state) {
              rest.state = ''
            }
            return rest
          })
          setSuppliers(cleanedSuppliers)
        }
        
        if (!hasMaterials) {
          setMaterials(initialMaterials)
        } else {
          // Remover description e supplier de materiais antigos (compatibilidade)
          const cleanedMaterials = data.materials.map((m: any) => {
            const { description, supplier, ...rest } = m
            return rest
          })
          setMaterials(cleanedMaterials)
        }
        
        if (!hasInstitutions) {
          setInstitutions(initialInstitutions)
        } else {
          setInstitutions(data.institutions)
        }
        
        setRequests(data.requests || [])
        setDeliveries(data.deliveries || [])
        setEntries(data.entries || [])
        setOutputs(data.outputs || [])
      } catch (e) {
        console.error('Erro ao carregar dados:', e)
        // Se houver erro, usar dados iniciais
        setSuppliers(initialSuppliers)
        setMaterials(initialMaterials)
        setInstitutions(initialInstitutions)
        setRequests([])
        setDeliveries([])
        setEntries([])
      }
    } else {
      // Se não houver dados salvos, usar dados iniciais
      setSuppliers(initialSuppliers)
      setMaterials(initialMaterials)
      setInstitutions(initialInstitutions)
      setRequests([])
      setEntries([])
    }
    
    setIsInitialized(true)
  }, [isInitialized])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('cedim_data', JSON.stringify({
      suppliers,
      institutions,
      materials,
      requests,
      deliveries,
      entries,
      outputs
    }))
  }, [suppliers, institutions, materials, requests, deliveries, entries, outputs])

  const addCustomCategory = (category: string) => {
    const trimmedCategory = category.trim()
    if (trimmedCategory && !customCategories.includes(trimmedCategory)) {
      setCustomCategories([...customCategories, trimmedCategory])
    }
  }

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
    // Remover email e address se existirem (compatibilidade com dados antigos)
    const { email, address, ...supplierCleaned } = supplier as any
    setSuppliers([...suppliers, { ...supplierCleaned, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString() }])
  }

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    // Remover email e address se existirem (compatibilidade com dados antigos)
    const { email, address, ...cleanedUpdates } = updates as any
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...cleanedUpdates } : s))
  }

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id))
  }

  const addInstitution = (institution: Omit<Institution, 'id' | 'createdAt'>) => {
    setInstitutions([...institutions, { ...institution, id: Math.random().toString(36).substring(7), createdAt: new Date().toISOString() }])
  }

  const updateInstitution = (id: string, updates: Partial<Institution>) => {
    setInstitutions(institutions.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  const deleteInstitution = (id: string) => {
    setInstitutions(institutions.filter(i => i.id !== id))
  }

  const addMaterial = (material: Omit<Material, 'id' | 'lastUpdate'>) => {
    setMaterials([...materials, { ...material, id: Math.random().toString(36).substring(7), lastUpdate: new Date().toISOString() }])
  }

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, ...updates, lastUpdate: new Date().toISOString() } : m))
  }

  const deleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id))
  }

  const addRequest = (request: Omit<Request, 'id' | 'requestNumber' | 'createdAt'>) => {
    // Garantir número único usando timestamp + número aleatório
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const requestNumber = `REQ-${timestamp}-${random}`
    const id = Math.random().toString(36).substring(7)
    
    setRequests(prev => {
      // Verificar se já existe uma requisição com o mesmo número (muito improvável, mas seguro)
      const exists = prev.some(r => r.requestNumber === requestNumber)
      if (exists) {
        // Se existir, gerar novo número
        const newRandom = Math.random().toString(36).substring(2, 8)
        const newRequestNumber = `REQ-${timestamp}-${newRandom}`
        return [...prev, { 
          ...request, 
          id, 
          requestNumber: newRequestNumber, 
          createdAt: new Date().toISOString() 
        }]
      }
      return [...prev, { 
        ...request, 
        id, 
        requestNumber, 
        createdAt: new Date().toISOString() 
      }]
    })
  }

  const addRequests = (requestsData: Array<Omit<Request, 'id' | 'requestNumber' | 'createdAt'>>) => {
    // Criar múltiplas requisições de uma vez para garantir que todas sejam adicionadas
    const baseTimestamp = Date.now()
    const newRequests: Request[] = requestsData.map((request, index) => {
      const random = Math.random().toString(36).substring(2, 8)
      // Adicionar um pequeno offset ao timestamp para garantir unicidade
      const requestNumber = `REQ-${baseTimestamp + index}-${random}`
      const id = Math.random().toString(36).substring(7)
      
      return {
        ...request,
        id,
        requestNumber,
        createdAt: new Date().toISOString()
      }
    })
    
    setRequests(prev => [...prev, ...newRequests])

    // Criar saídas individuais para cada item de cada requisição
    const newOutputs: Output[] = []
    const materialQuantityUpdates: Record<string, number> = {} // materialId -> quantidade total a subtrair
    
    newRequests.forEach(request => {
      const institution = institutions.find(i => i.id === request.institution)
      
      request.items.forEach(item => {
        const material = materials.find(m => m.id === item.materialId)
        if (material) {
          // Acumular quantidade total a subtrair por material
          if (!materialQuantityUpdates[item.materialId]) {
            materialQuantityUpdates[item.materialId] = 0
          }
          materialQuantityUpdates[item.materialId] += item.quantity

          // Criar saída individual para este item
          const outputId = Math.random().toString(36).substring(7)
          newOutputs.push({
            id: outputId,
            materialId: item.materialId,
            materialName: item.materialName,
            quantity: item.quantity,
            unit: material.unit,
            institutionId: request.institution,
            institutionName: institution?.name,
            reason: `Requisição ${request.requestNumber}`,
            responsible: institution?.principalName || 'Sistema',
            outputDate: request.requiredDate,
            createdAt: new Date().toISOString()
          })
        }
      })
    })

    // Adicionar todas as saídas de uma vez
    setOutputs(prev => [...prev, ...newOutputs])

    // Atualizar estoque de todos os materiais afetados
    Object.entries(materialQuantityUpdates).forEach(([materialId, totalQuantity]) => {
      const material = materials.find(m => m.id === materialId)
      if (material) {
        const newQuantity = Math.max(0, material.quantity - totalQuantity)
        setMaterials(prev => prev.map(m => 
          m.id === materialId 
            ? { ...m, quantity: newQuantity, lastUpdate: new Date().toISOString() }
            : m
        ))
      }
    })
  }

  const updateRequest = (id: string, updates: Partial<Request>) => {
    setRequests(requests.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const addDelivery = (deliveryData: Omit<Delivery, 'id' | 'deliveryNumber' | 'createdAt'>) => {
    const random = Math.random().toString(36).substring(2, 8)
    const deliveryNumber = `DEL-${Date.now()}-${random}`
    const id = Math.random().toString(36).substring(7)
    
    setDeliveries(prev => [...prev, {
      ...deliveryData,
      id,
      deliveryNumber,
      createdAt: new Date().toISOString()
    }])
  }

  const addDeliveries = (deliveriesData: Array<Omit<Delivery, 'id' | 'deliveryNumber' | 'createdAt'>>) => {
    // Criar múltiplas entregas de uma vez
    const baseTimestamp = Date.now()
    const newDeliveries: Delivery[] = deliveriesData.map((delivery, index) => {
      const random = Math.random().toString(36).substring(2, 8)
      const deliveryNumber = `DEL-${baseTimestamp + index}-${random}`
      const id = Math.random().toString(36).substring(7)
      
      return {
        ...delivery,
        id,
        deliveryNumber,
        createdAt: new Date().toISOString()
      }
    })
    
    setDeliveries(prev => [...prev, ...newDeliveries])

    // Criar entradas individuais para cada item de cada entrega
    const newEntries: Entry[] = []
    
    newDeliveries.forEach(delivery => {
      const supplier = suppliers.find(s => s.id === delivery.supplier)
      
      delivery.items.forEach(item => {
        const material = materials.find(m => m.id === item.materialId)
        if (material) {
          newEntries.push({
            id: Math.random().toString(36).substring(7),
            materialId: item.materialId,
            materialName: item.materialName,
            quantity: item.quantity,
            unit: material.unit,
            unitPrice: item.unitPrice,
            supplierId: delivery.supplier,
            supplierName: supplier?.name,
            reason: `Entrega ${delivery.deliveryNumber}`,
            responsible: supplier?.name || 'Sistema',
            entryDate: delivery.deliveryDate,
            createdAt: new Date().toISOString()
          })
        }
      })
    })

    // Adicionar todas as entradas de uma vez
    setEntries(prev => [...prev, ...newEntries])
  }

  const updateDelivery = (id: string, updates: Partial<Delivery>) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, ...updates } : d))
  }

  const deleteDelivery = (id: string) => {
    const delivery = deliveries.find(d => d.id === id)
    if (!delivery) return

    // Encontrar todas as entradas relacionadas a esta entrega
    const relatedEntries = entries.filter(e => 
      e.reason.includes(delivery.deliveryNumber)
    )

    // Excluir as entradas relacionadas
    setEntries(prev => prev.filter(e => !relatedEntries.some(re => re.id === e.id)))

    // Excluir a entrega
    setDeliveries(prev => prev.filter(d => d.id !== id))
  }

  const deleteRequest = (id: string) => {
    const request = requests.find(r => r.id === id)
    if (!request) return

    // Encontrar todas as saídas relacionadas a esta requisição
    const relatedOutputs = outputs.filter(o => 
      o.reason.includes(request.requestNumber)
    )

    // Calcular quantidades totais a restaurar por material
    const materialQuantityRestores: Record<string, number> = {} // materialId -> quantidade total a restaurar
    
    relatedOutputs.forEach(output => {
      if (!materialQuantityRestores[output.materialId]) {
        materialQuantityRestores[output.materialId] = 0
      }
      materialQuantityRestores[output.materialId] += output.quantity
    })

    // Restaurar estoque de todos os materiais afetados de uma vez
    Object.entries(materialQuantityRestores).forEach(([materialId, totalQuantity]) => {
      setMaterials(prev => prev.map(m => 
        m.id === materialId 
          ? { ...m, quantity: m.quantity + totalQuantity, lastUpdate: new Date().toISOString() }
          : m
      ))
    })

    // Excluir as saídas relacionadas
    const relatedOutputIds = relatedOutputs.map(o => o.id)
    setOutputs(prev => prev.filter(o => !relatedOutputIds.includes(o.id)))

    // Excluir a requisição
    setRequests(requests.filter(r => r.id !== id))
  }

  // Função para calcular estoque: total de entradas - total de saídas
  const getMaterialStock = (materialId: string): number => {
    const totalEntries = entries
      .filter(e => e.materialId === materialId)
      .reduce((sum, e) => sum + e.quantity, 0)
    
    const totalOutputs = outputs
      .filter(o => o.materialId === materialId)
      .reduce((sum, o) => sum + o.quantity, 0)
    
    return Math.max(0, totalEntries - totalOutputs)
  }

  // Função para calcular valor médio ponderado baseado nas entradas
  const getMaterialAveragePrice = (materialId: string): number => {
    const materialEntries = entries.filter(e => e.materialId === materialId)
    
    if (materialEntries.length === 0) {
      // Se não houver entradas, retorna o preço unitário do material (valor padrão)
      const material = materials.find(m => m.id === materialId)
      return material?.unitPrice || 0
    }
    
    // Calcular média ponderada: soma(quantidade * preço) / soma(quantidade)
    const totalValue = materialEntries.reduce((sum, e) => sum + (e.quantity * e.unitPrice), 0)
    const totalQuantity = materialEntries.reduce((sum, e) => sum + e.quantity, 0)
    
    if (totalQuantity === 0) return 0
    
    return totalValue / totalQuantity
  }

  const addEntry = (entry: Omit<Entry, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(7)
    setEntries(prev => [...prev, {
      ...entry,
      id,
      createdAt: new Date().toISOString()
    }])
  }

  const updateEntry = (id: string, updates: Partial<Entry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const deleteAllEntries = () => {
    setEntries([])
  }

  const addOutput = (output: Omit<Output, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(7)
    setOutputs(prev => [...prev, {
      ...output,
      id,
      createdAt: new Date().toISOString()
    }])
  }

  const updateOutput = (id: string, updates: Partial<Output>) => {
    setOutputs(outputs.map(o => o.id === id ? { ...o, ...updates } : o))
  }

  const deleteOutput = (id: string) => {
    setOutputs(outputs.filter(o => o.id !== id))
  }

  const deleteAllOutputs = () => {
    // Calcular quantidades totais a restaurar por material
    const materialQuantityRestores: Record<string, number> = {}
    
    outputs.forEach(output => {
      if (!materialQuantityRestores[output.materialId]) {
        materialQuantityRestores[output.materialId] = 0
      }
      materialQuantityRestores[output.materialId] += output.quantity
    })

    // Restaurar estoque de todos os materiais afetados
    Object.entries(materialQuantityRestores).forEach(([materialId, totalQuantity]) => {
      setMaterials(prev => prev.map(m => 
        m.id === materialId 
          ? { ...m, quantity: m.quantity + totalQuantity, lastUpdate: new Date().toISOString() }
          : m
      ))
    })

    // Excluir todas as saídas
    setOutputs([])
  }

  const seedInitialData = useCallback(() => {
    const { initialSuppliers, initialMaterials, initialInstitutions } = getInitialData()
    // Adicionar apenas se não existirem
    setSuppliers(prev => {
      if (prev.length === 0) {
        return initialSuppliers
      }
      return prev
    })
    setMaterials(prev => {
      if (prev.length === 0) {
        return initialMaterials
      }
      return prev
    })
    setInstitutions(prev => {
      if (prev.length === 0) {
        return initialInstitutions
      }
      return prev
    })
  }, [])

  return (
    <DataContext.Provider value={{
      suppliers,
      institutions,
      materials,
      requests,
      deliveries,
      entries,
      outputs,
      customCategories,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addInstitution,
      updateInstitution,
      deleteInstitution,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      addRequest,
      addRequests,
      updateRequest,
      deleteRequest,
      addDelivery,
      addDeliveries,
      updateDelivery,
      deleteDelivery,
      addEntry,
      updateEntry,
      deleteEntry,
      deleteAllEntries,
      addOutput,
      updateOutput,
      deleteOutput,
      deleteAllOutputs,
      getMaterialStock,
      getMaterialAveragePrice,
      addCustomCategory,
      seedInitialData
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData deve ser usado dentro de DataProvider')
  }
  return context
}
