'use client'

import { Material } from '@/lib/data-context'
import { useData } from '@/lib/data-context'
import { Card } from '@/components/ui/card'

interface StockAnalysisProps {
  materials: Material[]
}

export function StockAnalysis({ materials }: StockAnalysisProps) {
  const { suppliers } = useData()

  const lowStockItems = materials.filter(m => m.quantity <= m.minQuantity).sort((a, b) => a.quantity - b.quantity)
  const getSupplierName = (supplierId: string) => suppliers.find(s => s.id === supplierId)?.name || 'Desconhecido'

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Análise de Estoque - Itens com Estoque Baixo</h3>
      {lowStockItems.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Todos os itens estão com estoque adequado</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2">Material</th>
                <th className="text-left py-2 px-2">Categoria</th>
                <th className="text-center py-2 px-2">Estoque Atual</th>
                <th className="text-center py-2 px-2">Mínimo</th>
                <th className="text-center py-2 px-2">Diferença</th>
                <th className="text-left py-2 px-2">Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map(item => {
                const diff = item.minQuantity - item.quantity
                return (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-2 px-2">{item.name}</td>
                    <td className="py-2 px-2">{item.category}</td>
                    <td className="text-center py-2 px-2 font-medium">{item.quantity}</td>
                    <td className="text-center py-2 px-2">{item.minQuantity}</td>
                    <td className="text-center py-2 px-2">
                      <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-semibold">
                        -{diff}
                      </span>
                    </td>
                    <td className="py-2 px-2">{getSupplierName(item.supplier)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
