'use client'

import { useState, useMemo } from 'react'
import { useMaterials, Material as MaterialType } from '@/hooks/use-materials'
import { Material } from '@/lib/data-context'
import { AuthLayout } from '@/components/auth-layout'
import { MaterialForm } from '@/components/materials/material-form'
import { MaterialList } from '@/components/materials/material-list'
import { AdjustStockDialog } from '@/components/materials/adjust-stock-dialog'
import { AdjustPriceDialog } from '@/components/materials/adjust-price-dialog'
import { Button } from '@/components/ui/button'
import { useConfirmDialog } from '@/hooks/use-confirm-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileText, Download, FileSpreadsheet, File, Tag, Ruler, Search, DollarSign, Upload, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { exportMaterialsToExcel, exportMaterialsToPDF } from '@/lib/export-utils'
import { CategoryDialog } from '@/components/materials/category-dialog'
import { UnitDialog } from '@/components/materials/unit-dialog'
import { ImportMaterialsDialog } from '@/components/materials/import-materials-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories } from '@/hooks/use-categories'
import { useEntries } from '@/hooks/use-entries'
import { useOutputs } from '@/hooks/use-outputs'

// Função para converter Material do Supabase para o formato esperado pelos componentes
function convertMaterial(material: MaterialType): Material {
  return {
    id: material.id,
    name: material.name || '',
    category: material.category || '',
    unit: material.unit || '',
    quantity: Number(material.quantity) || 0,
    minQuantity: Number(material.min_quantity) || 0,
    unitPrice: Number(material.unit_price) || 0,
    lastUpdate: material.last_update || new Date().toISOString(),
  }
}

export default function MaterialsPage() {
  // Flag para mostrar/ocultar botões temporários
  const SHOW_TEMP_BUTTONS = false
  
  const { materials: supabaseMaterials, addMaterial, updateMaterial, deleteMaterial, isLoading, refreshMaterials } = useMaterials()
  const { categories } = useCategories()
  const { addEntry } = useEntries()
  const { addOutput } = useOutputs()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false)
  const [isAdjustPriceDialogOpen, setIsAdjustPriceDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [adjustingStockMaterial, setAdjustingStockMaterial] = useState<Material | null>(null)
  const [adjustingPriceMaterial, setAdjustingPriceMaterial] = useState<Material | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { toast } = useToast()
  const confirmDialog = useConfirmDialog()

  // Converter materiais do Supabase para o formato esperado
  const materials = useMemo(() => {
    return supabaseMaterials.map(convertMaterial)
  }, [supabaseMaterials])

  const handleAddNew = () => {
    setEditingMaterial(null)
    setIsFormVisible(true)
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
    setIsFormVisible(true)
  }

  const handleSubmit = async (data: Omit<Material, 'id' | 'lastUpdate'>) => {
    try {
      // Converter para o formato do Supabase
      const supabaseData = {
        name: data.name,
        category: data.category,
        unit: data.unit,
        quantity: data.quantity,
        min_quantity: data.minQuantity,
        unit_price: data.unitPrice,
      }

      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, supabaseData)
      } else {
        await addMaterial(supabaseData)
      }
      setIsFormVisible(false)
      setEditingMaterial(null)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleCancel = () => {
    setIsFormVisible(false)
    setEditingMaterial(null)
  }

  const handleDelete = async (id: string) => {
    const material = materials.find(m => m.id === id)
    const confirmed = await confirmDialog.confirm({
      title: 'Excluir Material',
      description: `Tem certeza que deseja excluir o material "${material?.name}"? Esta ação não pode ser desfeita e pode afetar requisições relacionadas.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      try {
        await deleteMaterial(id)
      } catch (error) {
        // Erro já foi tratado no hook
      }
    }
  }

  const handleAdjustStock = (material: Material) => {
    setAdjustingStockMaterial(material)
    setIsAdjustStockDialogOpen(true)
  }

  const handleConfirmAdjustStock = async (newQuantity: number) => {
    if (!adjustingStockMaterial) return

    const currentQuantity = adjustingStockMaterial.quantity
    const quantityDifference = newQuantity - currentQuantity
    const entryDate = new Date().toISOString().split('T')[0]

    try {
      // Se a quantidade diminuiu, criar saída automática
      if (quantityDifference < 0) {
        const outputQuantity = Math.abs(quantityDifference)
        try {
          await addOutput({
            material_id: adjustingStockMaterial.id,
            material_name: adjustingStockMaterial.name,
            quantity: outputQuantity,
            unit: adjustingStockMaterial.unit,
            institution_id: null,
            institution_name: null,
            reason: 'Ajuste de estoque',
            responsible: 'Sistema',
            output_date: entryDate
          })
          toast({
            title: 'Ajuste realizado',
            description: `Saída de ${outputQuantity} ${adjustingStockMaterial.unit} criada automaticamente. O estoque será atualizado.`,
          })
        } catch (error) {
          console.error('Erro ao criar saída automática:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar a saída automaticamente.',
            variant: 'destructive',
          })
          return
        }
      }
      // Se a quantidade aumentou, criar entrada automática
      else if (quantityDifference > 0) {
        try {
          const entryPrice = adjustingStockMaterial.unitPrice || 0
          await addEntry({
            material_id: adjustingStockMaterial.id,
            material_name: adjustingStockMaterial.name,
            quantity: quantityDifference,
            unit: adjustingStockMaterial.unit,
            unit_price: entryPrice,
            supplier_id: undefined,
            supplier_name: undefined,
            reason: 'Ajuste de estoque',
            responsible: 'Sistema',
            entry_date: entryDate
          })
          toast({
            title: 'Ajuste realizado',
            description: `Entrada de ${quantityDifference} ${adjustingStockMaterial.unit} criada automaticamente. O estoque será atualizado.`,
          })
        } catch (error) {
          console.error('Erro ao criar entrada automática:', error)
          toast({
            title: 'Erro',
            description: 'Não foi possível criar a entrada automaticamente.',
            variant: 'destructive',
          })
          return
        }
      }
      // Se a quantidade não mudou, apenas informar
      else {
        toast({
          title: 'Sem alteração',
          description: 'A quantidade informada é igual à quantidade atual.',
        })
      }

      setIsAdjustStockDialogOpen(false)
      setAdjustingStockMaterial(null)
      
      // Atualizar materiais após um delay para garantir que os triggers processaram
      setTimeout(() => {
        refreshMaterials()
        window.dispatchEvent(new CustomEvent('entriesUpdated'))
        window.dispatchEvent(new CustomEvent('outputsUpdated'))
      }, 1000)
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível realizar o ajuste de estoque.',
        variant: 'destructive',
      })
    }
  }

  const handleAdjustPrice = (material: Material) => {
    setAdjustingPriceMaterial(material)
    setIsAdjustPriceDialogOpen(true)
  }

  const handleConfirmAdjustPrice = async (newPrice: number) => {
    if (!adjustingPriceMaterial) return

    try {
      await updateMaterial(adjustingPriceMaterial.id, {
        unit_price: newPrice,
      })
      setIsAdjustPriceDialogOpen(false)
      setAdjustingPriceMaterial(null)
    } catch (error) {
      // Erro já foi tratado no hook
    }
  }

  const handleZeroStock = async () => {
    const confirmed = await confirmDialog.confirm({
      title: 'Zerar Estoque',
      description: `Tem certeza que deseja zerar o estoque de TODOS os materiais? Esta ação não pode ser desfeita.`,
      confirmText: 'Zerar Estoque',
      cancelText: 'Cancelar',
      variant: 'destructive',
    })

    if (confirmed) {
      try {
        // Zerar estoque de todos os materiais
        const promises = materials.map(material => 
          updateMaterial(material.id, { quantity: 0 })
        )
        await Promise.all(promises)
        toast({
          title: 'Sucesso',
          description: 'Estoque de todos os materiais foi zerado.',
        })
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível zerar o estoque de todos os materiais.',
          variant: 'destructive',
        })
      }
    }
  }

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando materiais...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="p-6 lg:p-8">
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome, categoria ou unidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              autoComplete="off"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link href="/expenses-products">
            <Button variant="outline" className="font-medium">
              <DollarSign className="h-4 w-4 mr-2" />
              Despesas
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="font-medium">
                <FileText className="h-4 w-4 mr-2" />
                Relatório
                <Download className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  exportMaterialsToExcel(materials)
                  toast({
                    title: 'Exportação concluída',
                    description: 'Relatório Excel gerado com sucesso.',
                  })
                }}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exportar para Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  exportMaterialsToPDF(materials)
                  toast({
                    title: 'Exportação concluída',
                    description: 'Relatório PDF gerado com sucesso.',
                  })
                }}
              >
                <File className="h-4 w-4 mr-2" />
                Exportar para PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => setIsCategoryDialogOpen(true)}
            className="font-medium"
          >
            <Tag className="h-4 w-4 mr-2" />
            Categorias
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsUnitDialogOpen(true)}
            className="font-medium"
          >
            <Ruler className="h-4 w-4 mr-2" />
            Unidades
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            className="font-medium"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 font-medium">
            Novo Material
          </Button>
          {SHOW_TEMP_BUTTONS && (
            <Button 
              onClick={handleZeroStock} 
              variant="destructive"
              className="font-medium"
              title="TEMPORÁRIO - Zerar estoque de todos os materiais"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              TEMPORÁRIO: Zerar Estoque
            </Button>
          )}
        </div>
        <MaterialList
          materials={materials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdjustStock={handleAdjustStock}
          onAdjustPrice={handleAdjustPrice}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />

        <MaterialForm
          material={editingMaterial || undefined}
          isOpen={isFormVisible}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>

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

      <CategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
      />

      <UnitDialog
        isOpen={isUnitDialogOpen}
        onClose={() => setIsUnitDialogOpen(false)}
      />

      <ImportMaterialsDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImportComplete={() => {
          refreshMaterials()
        }}
      />

      <AdjustStockDialog
        material={adjustingStockMaterial}
        isOpen={isAdjustStockDialogOpen}
        onClose={() => {
          setIsAdjustStockDialogOpen(false)
          setAdjustingStockMaterial(null)
        }}
        onConfirm={handleConfirmAdjustStock}
      />

      <AdjustPriceDialog
        material={adjustingPriceMaterial}
        isOpen={isAdjustPriceDialogOpen}
        onClose={() => {
          setIsAdjustPriceDialogOpen(false)
          setAdjustingPriceMaterial(null)
        }}
        onConfirm={handleConfirmAdjustPrice}
      />
    </AuthLayout>
  )
}
