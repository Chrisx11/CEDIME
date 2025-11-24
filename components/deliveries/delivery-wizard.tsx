'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Material, Supplier } from '@/lib/data-context'
import { useMaterials } from '@/hooks/use-materials'
import { useSuppliers } from '@/hooks/use-suppliers'
import { useCategories } from '@/hooks/use-categories'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Truck, ChevronRight, ChevronLeft, CheckCircle2, Package, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MaterialPriceQuantitySelector } from '@/components/ui/material-price-quantity-selector'
import { SupplierSelector } from '@/components/ui/supplier-selector'

interface MaterialSelection {
  quantity: number
  unitPrice: number
}

interface DeliveryWizardProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (deliveries: Array<{
    supplier: string
    deliveryDate: string
    status: 'pending' | 'received' | 'cancelled'
    items: Array<{
      materialId: string
      materialName: string
      quantity: number
      unitPrice: number
      total: number
    }>
    totalValue: number
  }>) => void
}

type Step = 1 | 2 | 3 | 4

export function DeliveryWizard({ isOpen, onClose, onSubmit }: DeliveryWizardProps) {
  const { materials: supabaseMaterials } = useMaterials()
  const { suppliers: supabaseSuppliers } = useSuppliers()
  const { categories: supabaseCategories } = useCategories()
  const { toast } = useToast()

  // Converter materiais e fornecedores para o formato esperado
  const materials = useMemo(() => {
    return supabaseMaterials.map(m => ({
      id: m.id,
      name: m.name,
      category: m.category,
      unit: m.unit,
      quantity: m.quantity,
      minQuantity: m.min_quantity,
      unitPrice: m.unit_price,
      lastUpdate: m.last_update,
    }))
  }, [supabaseMaterials])

  const suppliers = useMemo(() => {
    return supabaseSuppliers.map(s => ({
      id: s.id,
      name: s.name,
      cnpj: s.cnpj,
      city: s.city,
      state: s.state,
      phone: s.phone,
      status: s.status,
      createdAt: s.created_at,
    }))
  }, [supabaseSuppliers])

  const customCategories = useMemo(() => {
    return supabaseCategories.map(c => c.name)
  }, [supabaseCategories])

  // Funções auxiliares para compatibilidade
  const getMaterialStock = (materialId: string) => {
    const material = materials.find(m => m.id === materialId)
    return material ? material.quantity : 0
  }

  const getMaterialAveragePrice = (materialId: string) => {
    const material = materials.find(m => m.id === materialId)
    return material ? material.unitPrice : 0
  }
  
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, MaterialSelection>>({})
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  // Função para obter data local sem conversão de timezone
  const getLocalDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [deliveryDate, setDeliveryDate] = useState(getLocalDateString())
  const [isMaterialSelectorOpen, setIsMaterialSelectorOpen] = useState(false)
  const [isSupplierSelectorOpen, setIsSupplierSelectorOpen] = useState(false)

  // Apenas categorias customizadas
  const allCategories = customCategories.map(cat => ({ value: cat, label: cat }))

  // Materiais filtrados pelas categorias selecionadas
  const availableMaterials = useMemo(() => {
    if (selectedCategories.length === 0) return []
    
    return materials.filter(material => {
      return selectedCategories.includes(material.category)
    })
  }, [materials, selectedCategories])

  // String de IDs dos materiais disponíveis para usar como dependência
  const availableMaterialIdsString = useMemo(() => {
    if (selectedCategories.length === 0) return ''
    const filtered = materials.filter(m => selectedCategories.includes(m.category))
    return filtered.map(m => m.id).sort().join(',')
  }, [materials, selectedCategories])

  // Ref para rastrear a última string de IDs processada
  const lastProcessedIdsRef = useRef<string>('')
  const materialsRef = useRef(materials)
  const selectedCategoriesRef = useRef(selectedCategories)

  // Atualizar refs quando os valores mudarem
  useEffect(() => {
    materialsRef.current = materials
  }, [materials])

  useEffect(() => {
    selectedCategoriesRef.current = selectedCategories
  }, [selectedCategories])

  // Limpar seleções de materiais quando mudar de categoria (mas manter os já selecionados)
  useEffect(() => {
    if (currentStep === 2 && selectedCategoriesRef.current.length > 0) {
      if (availableMaterialIdsString !== lastProcessedIdsRef.current) {
        setSelectedMaterials(prev => {
          const filteredMaterials = materialsRef.current.filter(m => 
            selectedCategoriesRef.current.includes(m.category)
          )
          const filteredIds = new Set(filteredMaterials.map(m => m.id))
          
          const cleanedMaterials: Record<string, MaterialSelection> = {}
          Object.keys(prev).forEach(materialId => {
            if (filteredIds.has(materialId) && prev[materialId].quantity > 0) {
              cleanedMaterials[materialId] = prev[materialId]
            }
          })
          
          lastProcessedIdsRef.current = availableMaterialIdsString
          return cleanedMaterials
        })
      }
    }
  }, [currentStep, availableMaterialIdsString])

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setSelectedCategories([])
      setSelectedMaterials({})
      setSelectedSuppliers([])
      setDeliveryDate(new Date().toISOString().split('T')[0])
      lastProcessedIdsRef.current = ''
    }
  }, [isOpen])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterials(prev => {
      const newState = { ...prev }
      if (newState[materialId] && newState[materialId].quantity > 0) {
        delete newState[materialId]
      } else {
        newState[materialId] = {
          quantity: 1,
          unitPrice: getMaterialAveragePrice(materialId)
        }
      }
      return newState
    })
  }

  const handleQuantityChange = (materialId: string, quantity: number) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [materialId]: {
        ...(prev[materialId] || { quantity: 0, unitPrice: getMaterialAveragePrice(materialId) }),
        quantity: Math.max(0, quantity)
      }
    }))
  }

  const handlePriceChange = (materialId: string, unitPrice: number) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [materialId]: {
        ...(prev[materialId] || { quantity: 0, unitPrice: getMaterialAveragePrice(materialId) }),
        unitPrice: Math.max(0, unitPrice)
      }
    }))
  }

  const handleMaterialSelectorConfirm = (selections: Record<string, MaterialSelection>) => {
    setSelectedMaterials(selections)
  }

  const handleSupplierSelectorConfirm = (selectedIds: string[]) => {
    setSelectedSuppliers(selectedIds)
  }

  const handleSupplierToggle = (supplierId: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    )
  }

  // Materiais selecionados (com quantidade > 0)
  const activeMaterials = useMemo(() => {
    return availableMaterials.filter(m => selectedMaterials[m.id] && selectedMaterials[m.id].quantity > 0)
  }, [availableMaterials, selectedMaterials])

  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedCategories.length === 0) {
        toast({
          title: 'Categorias necessárias',
          description: 'Selecione pelo menos uma categoria para continuar.',
          variant: 'destructive',
        })
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (activeMaterials.length === 0) {
        toast({
          title: 'Materiais necessários',
          description: 'Selecione e defina quantidades e preços para pelo menos um material.',
          variant: 'destructive',
        })
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (selectedSuppliers.length === 0) {
        toast({
          title: 'Fornecedores necessários',
          description: 'Selecione pelo menos um fornecedor para continuar.',
          variant: 'destructive',
        })
        return
      }
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleFinish = () => {
    // Criar entregas para cada fornecedor
    const deliveries = selectedSuppliers.map(supplierId => {
      const items = activeMaterials.map(material => {
        const selection = selectedMaterials[material.id]
        return {
          materialId: material.id,
          materialName: material.name,
          quantity: selection.quantity,
          unitPrice: selection.unitPrice,
          total: selection.quantity * selection.unitPrice
        }
      })

      const totalValue = items.reduce((acc, item) => acc + item.total, 0)

      return {
        supplier: supplierId,
        deliveryDate,
        status: 'pending' as const,
        items,
        totalValue
      }
    })

    onSubmit(deliveries)
    onClose()
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Selecionar Categorias'
      case 2: return 'Selecionar Materiais'
      case 3: return 'Selecionar Fornecedores'
      case 4: return 'Confirmar Entregas'
      default: return ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Nova Entrega - {getStepTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Indicador de progresso */}
        <div className="flex items-center justify-between mb-6 mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <span className="text-xs mt-2 text-center text-muted-foreground">
                  {step === 1 && 'Categorias'}
                  {step === 2 && 'Materiais'}
                  {step === 3 && 'Fornecedores'}
                  {step === 4 && 'Confirmar'}
                </span>
              </div>
              {step < 4 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Conteúdo do passo */}
        <div className="space-y-4">
          {/* Passo 1: Seleção de Categorias */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione as categorias de materiais que participarão desta entrega.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allCategories.map(category => (
                  <Card
                    key={category.value}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedCategories.includes(category.value)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleCategoryToggle(category.value)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.value)}
                        onChange={() => handleCategoryToggle(category.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">{category.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Passo 2: Seleção de Materiais */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {activeMaterials.length > 0 
                    ? 'Materiais selecionados. Você pode editar as quantidades, preços ou remover itens.'
                    : 'Clique no botão abaixo para selecionar os materiais e definir as quantidades e preços.'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMaterialSelectorOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  {activeMaterials.length > 0 ? 'Editar Seleção' : 'Selecionar Materiais'}
                </Button>
              </div>
              {activeMaterials.length > 0 ? (
                <>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {activeMaterials.map(material => {
                      const selection = selectedMaterials[material.id]
                      const quantity = selection?.quantity || 0
                      const unitPrice = selection?.unitPrice || getMaterialAveragePrice(material.id)
                      
                      return (
                        <Card
                          key={material.id}
                          className="p-4 border-primary bg-primary/5 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={() => handleMaterialToggle(material.id)}
                              className="w-4 h-4"
                            />
                            <div className="flex-1">
                              <div className="font-medium">{material.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Estoque: {getMaterialStock(material.id)} {material.unit} | 
                                Preço Médio: R$ {getMaterialAveragePrice(material.id).toFixed(2)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">Qtd:</label>
                                <input
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => handleQuantityChange(material.id, parseInt(e.target.value) || 0)}
                                  min="0"
                                  className="w-20 px-2 py-1 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium">Preço:</label>
                                <input
                                  type="number"
                                  value={unitPrice}
                                  onChange={(e) => handlePriceChange(material.id, parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                  className="w-24 px-2 py-1 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              </div>
                              <span className="text-sm text-muted-foreground pt-5">{material.unit}</span>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activeMaterials.length} material(is) selecionado(s)
                  </div>
                </>
              ) : (
                <div className="p-8 text-center border border-dashed border-border rounded-lg">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum material selecionado ainda. Clique no botão acima para começar.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Passo 3: Seleção de Fornecedores */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data da Entrega</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedSuppliers.length > 0 
                    ? 'Fornecedores selecionados. Você pode editar a seleção.'
                    : 'Clique no botão abaixo para selecionar os fornecedores que farão esta entrega.'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSupplierSelectorOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  {selectedSuppliers.length > 0 ? 'Editar Seleção' : 'Selecionar Fornecedores'}
                </Button>
              </div>
              {selectedSuppliers.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedSuppliers.map(id => {
                    const supplier = suppliers.find(s => s.id === id)
                    if (!supplier) return null
                    
                    return (
                      <Card
                        key={supplier.id}
                        className="p-4 border-primary bg-primary/5 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleSupplierToggle(supplier.id)}
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier.city}{supplier.state ? `, ${supplier.state}` : ''}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-border rounded-lg">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum fornecedor selecionado ainda. Clique no botão acima para começar.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Passo 4: Confirmação */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Materiais Selecionados:</h3>
                  <div className="space-y-2">
                    {activeMaterials.map(material => {
                      const selection = selectedMaterials[material.id]
                      return (
                        <div key={material.id} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                          <span>{material.name}</span>
                          <span>
                            {selection.quantity} {material.unit} × R$ {selection.unitPrice.toFixed(2)} = 
                            R$ {(selection.quantity * selection.unitPrice).toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Fornecedores Selecionados ({selectedSuppliers.length}):</h3>
                  <div className="space-y-1">
                    {selectedSuppliers.map(id => {
                      const supplier = suppliers.find(s => s.id === id)
                      return (
                        <div key={id} className="text-sm p-2 bg-muted/30 rounded">
                          {supplier?.name}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total por Entrega:</span>
                    <span className="font-bold text-lg">
                      R$ {activeMaterials.reduce((acc, m) => {
                        const selection = selectedMaterials[m.id]
                        return acc + (selection.quantity * selection.unitPrice)
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">Total Geral ({selectedSuppliers.length} entrega(s)):</span>
                    <span className="font-bold text-lg">
                      R$ {(activeMaterials.reduce((acc, m) => {
                        const selection = selectedMaterials[m.id]
                        return acc + (selection.quantity * selection.unitPrice)
                      }, 0) * selectedSuppliers.length).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onClose : handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Cancelar' : 'Voltar'}
            </Button>
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">
                Avançar
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleFinish} className="bg-primary hover:bg-primary/90">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar e Criar Entregas
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      <MaterialPriceQuantitySelector
        isOpen={isMaterialSelectorOpen}
        onClose={() => setIsMaterialSelectorOpen(false)}
        onConfirm={handleMaterialSelectorConfirm}
        availableMaterials={availableMaterials}
        initialSelections={selectedMaterials}
      />

      <SupplierSelector
        isOpen={isSupplierSelectorOpen}
        onClose={() => setIsSupplierSelectorOpen(false)}
        onConfirm={handleSupplierSelectorConfirm}
        availableSuppliers={suppliers}
        initialSelections={selectedSuppliers}
      />
    </Dialog>
  )
}

