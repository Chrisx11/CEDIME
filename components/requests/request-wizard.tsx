'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Material, Institution } from '@/lib/data-context'
import { useMaterials } from '@/hooks/use-materials'
import { useInstitutions } from '@/hooks/use-institutions'
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
import { FileText, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Package, School } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MaterialQuantitySelector } from '@/components/ui/material-quantity-selector'
import { InstitutionMultiSelector } from '@/components/ui/institution-multi-selector'

interface RequestWizardProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (requests: Array<{
    institution: string
    requiredDate: string
    status: 'pending' | 'approved' | 'delivered' | 'cancelled'
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

export function RequestWizard({ isOpen, onClose, onSubmit }: RequestWizardProps) {
  const { materials: supabaseMaterials } = useMaterials()
  const { institutions: supabaseInstitutions } = useInstitutions()
  const { categories: supabaseCategories } = useCategories()
  const { toast } = useToast()

  // Converter materiais e instituições para o formato esperado
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

  const institutions = useMemo(() => {
    return supabaseInstitutions.map(i => ({
      id: i.id,
      name: i.name,
      type: 'school' as const,
      cnpj: '',
      email: '',
      phone: (i.phone ?? '') || '',
      address: '',
      city: i.city,
      state: i.state,
      principalName: i.principal_name,
      status: i.status,
      createdAt: i.created_at,
    }))
  }, [supabaseInstitutions])

  const customCategories = useMemo(() => {
    return supabaseCategories.map(c => c.name)
  }, [supabaseCategories])

  // Funções auxiliares para compatibilidade (usadas em outros lugares)
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
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({})
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0])
  const [isMaterialSelectorOpen, setIsMaterialSelectorOpen] = useState(false)
  const [isInstitutionSelectorOpen, setIsInstitutionSelectorOpen] = useState(false)

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
      // Verifica se precisa atualizar comparando com a última string processada
      if (availableMaterialIdsString !== lastProcessedIdsRef.current) {
        setSelectedMaterials(prev => {
          // Remove materiais que não estão mais nas categorias selecionadas
          const filteredMaterials = materialsRef.current.filter(m => 
            selectedCategoriesRef.current.includes(m.category)
          )
          const filteredIds = new Set(filteredMaterials.map(m => m.id))
          
          const cleanedMaterials: Record<string, number> = {}
          Object.keys(prev).forEach(materialId => {
            // Mantém apenas os materiais que ainda estão nas categorias selecionadas e com quantidade > 0
            if (filteredIds.has(materialId) && prev[materialId] > 0) {
              cleanedMaterials[materialId] = prev[materialId]
            }
          })
          
          lastProcessedIdsRef.current = availableMaterialIdsString
          return cleanedMaterials
        })
      }
    }
  }, [currentStep, availableMaterialIdsString]) // Apenas dependências primitivas

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setSelectedCategories([])
      setSelectedMaterials({})
      setSelectedInstitutions([])
      setRequiredDate(new Date().toISOString().split('T')[0])
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
      if (newState[materialId] !== undefined && newState[materialId] > 0) {
        // Se já tem quantidade, desmarca (zera)
        newState[materialId] = 0
      } else {
        // Se está zerado, marca com quantidade 1
        newState[materialId] = 1
      }
      return newState
    })
  }

  const handleQuantityChange = (materialId: string, quantity: number) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [materialId]: Math.max(0, quantity)
    }))
  }

  const handleMaterialSelectorConfirm = (selections: Record<string, number>) => {
    setSelectedMaterials(selections)
  }

  const handleInstitutionSelectorConfirm = (selectedIds: string[]) => {
    setSelectedInstitutions(selectedIds)
  }

  const handleInstitutionToggle = (institutionId: string) => {
    setSelectedInstitutions(prev =>
      prev.includes(institutionId)
        ? prev.filter(id => id !== institutionId)
        : [...prev, institutionId]
    )
  }

  // Materiais selecionados (com quantidade > 0)
  const activeMaterials = useMemo(() => {
    return availableMaterials.filter(m => selectedMaterials[m.id] > 0)
  }, [availableMaterials, selectedMaterials])

  // Verificar estoque
  const stockIssues = useMemo(() => {
    if (currentStep !== 4) return []
    
    const issues: Array<{ materialName: string; requested: number; available: number }> = []
    
    activeMaterials.forEach(material => {
      const requested = selectedMaterials[material.id] || 0
      const available = getMaterialStock(material.id)
      const totalRequested = requested * selectedInstitutions.length
      
      if (totalRequested > available) {
        issues.push({
          materialName: material.name,
          requested: totalRequested,
          available: available
        })
      }
    })
    
    return issues
  }, [currentStep, activeMaterials, selectedMaterials, selectedInstitutions, getMaterialStock])

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
          description: 'Selecione e defina quantidades para pelo menos um material.',
          variant: 'destructive',
        })
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (selectedInstitutions.length === 0) {
        toast({
          title: 'Instituições necessárias',
          description: 'Selecione pelo menos uma instituição para continuar.',
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
    if (stockIssues.length > 0) {
      toast({
        title: 'Estoque insuficiente',
        description: 'Não há estoque suficiente para atender todas as requisições. Verifique os materiais em falta.',
        variant: 'destructive',
      })
      return
    }

    // Criar requisições para cada instituição
    const requests = selectedInstitutions.map(institutionId => {
      const items = activeMaterials.map(material => {
        const quantity = selectedMaterials[material.id]
        const unitPrice = getMaterialAveragePrice(material.id)
        return {
          materialId: material.id,
          materialName: material.name,
          quantity: quantity,
          unitPrice: unitPrice,
          total: quantity * unitPrice
        }
      })

      const totalValue = items.reduce((acc, item) => acc + item.total, 0)

      return {
        institution: institutionId,
        requiredDate,
        status: 'pending' as const,
        items,
        totalValue
      }
    })

    onSubmit(requests)
    onClose()
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Selecionar Categorias'
      case 2: return 'Selecionar Materiais'
      case 3: return 'Selecionar Instituições'
      case 4: return 'Confirmar Requisições'
      default: return ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Nova Requisição - {getStepTitle()}</DialogTitle>
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
                  {step === 3 && 'Instituições'}
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
                Selecione as categorias de materiais que participarão desta requisição.
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
                    ? 'Materiais selecionados. Você pode editar as quantidades ou remover itens.'
                    : 'Clique no botão abaixo para selecionar os materiais e definir as quantidades.'}
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
                      const quantity = selectedMaterials[material.id] || 0
                      
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
                            Estoque: {material.quantity} {material.unit} | 
                            Preço: R$ {material.unitPrice.toFixed(2)}
                          </div>
                        </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium">Qtd:</label>
                              <input
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(material.id, parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-20 px-2 py-1 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                              <span className="text-sm text-muted-foreground">{material.unit}</span>
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

          {/* Passo 3: Seleção de Instituições */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Necessária</label>
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedInstitutions.length > 0 
                    ? 'Instituições selecionadas. Você pode editar a seleção.'
                    : 'Clique no botão abaixo para selecionar as instituições que receberão esta requisição.'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInstitutionSelectorOpen(true)}
                  className="flex items-center gap-2"
                >
                  <School className="h-4 w-4" />
                  {selectedInstitutions.length > 0 ? 'Editar Seleção' : 'Selecionar Instituições'}
                </Button>
              </div>
              {selectedInstitutions.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedInstitutions.map(id => {
                    const institution = institutions.find(i => i.id === id)
                    if (!institution) return null
                    
                    return (
                      <Card
                        key={institution.id}
                        className="p-4 border-primary bg-primary/5 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleInstitutionToggle(institution.id)}
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-medium">{institution.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {institution.city}{institution.state ? `, ${institution.state}` : ''}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-border rounded-lg">
                  <School className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma instituição selecionada ainda. Clique no botão acima para começar.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Passo 4: Confirmação */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {stockIssues.length > 0 && (
                <Card className="p-4 border-destructive bg-destructive/5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-destructive mb-2">
                        Estoque Insuficiente
                      </div>
                      <div className="text-sm space-y-1">
                        {stockIssues.map((issue, idx) => (
                          <div key={idx}>
                            <strong>{issue.materialName}:</strong> Solicitado {issue.requested}, 
                            Disponível {issue.available}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Materiais Selecionados:</h3>
                  <div className="space-y-2">
                    {activeMaterials.map(material => {
                      const quantity = selectedMaterials[material.id]
                      const unitPrice = getMaterialAveragePrice(material.id)
                      return (
                        <div key={material.id} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                          <span>{material.name}</span>
                          <span>
                            {quantity} {material.unit} × R$ {unitPrice.toFixed(2)} = 
                            R$ {(quantity * unitPrice).toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Instituições Selecionadas ({selectedInstitutions.length}):</h3>
                  <div className="space-y-1">
                    {selectedInstitutions.map(id => {
                      const institution = institutions.find(i => i.id === id)
                      return (
                        <div key={id} className="text-sm p-2 bg-muted/30 rounded">
                          {institution?.name}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total por Requisição:</span>
                    <span className="font-bold text-lg">
                      R$ {activeMaterials.reduce((acc, m) => {
                        const quantity = selectedMaterials[m.id]
                        const unitPrice = getMaterialAveragePrice(m.id)
                        return acc + (quantity * unitPrice)
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">Total Geral ({selectedInstitutions.length} requisições):</span>
                    <span className="font-bold text-lg">
                      R$ {(activeMaterials.reduce((acc, m) => {
                        const quantity = selectedMaterials[m.id]
                        const unitPrice = getMaterialAveragePrice(m.id)
                        return acc + (quantity * unitPrice)
                      }, 0) * selectedInstitutions.length).toFixed(2)}
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
                Confirmar e Criar Requisições
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>

      <MaterialQuantitySelector
        isOpen={isMaterialSelectorOpen}
        onClose={() => setIsMaterialSelectorOpen(false)}
        onConfirm={handleMaterialSelectorConfirm}
        availableMaterials={availableMaterials}
        initialSelections={selectedMaterials}
      />

      <InstitutionMultiSelector
        isOpen={isInstitutionSelectorOpen}
        onClose={() => setIsInstitutionSelectorOpen(false)}
        onConfirm={handleInstitutionSelectorConfirm}
        availableInstitutions={institutions}
        initialSelections={selectedInstitutions}
      />
    </Dialog>
  )
}

