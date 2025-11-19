'use client'

import { Material, Request } from '@/lib/data-context'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartsProps {
  materials: Material[]
  requests: Request[]
}

export function Charts({ materials, requests }: ChartsProps) {
  // Dados para gráfico de distribuição por categoria
  const categoryData = materials.reduce((acc: any[], material) => {
    const existing = acc.find(item => item.name === material.category)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: material.category || 'Sem categoria', value: 1 })
    }
    return acc
  }, [])

  // Dados para gráfico de valor por fornecedor (top 5)
  const supplierValue = materials.reduce((acc: any[], material) => {
    const existing = acc.find(item => item.name === material.supplier)
    const value = material.quantity * material.unitPrice
    if (existing) {
      existing.value += value
    } else {
      acc.push({ name: material.supplier, value })
    }
    return acc
  }, []).sort((a, b) => b.value - a.value).slice(0, 5)

  // Dados para status de requisições
  const statusData = [
    { name: 'Pendentes', value: requests.filter(r => r.status === 'pending').length },
    { name: 'Aprovadas', value: requests.filter(r => r.status === 'approved').length },
    { name: 'Entregues', value: requests.filter(r => r.status === 'delivered').length },
    { name: 'Canceladas', value: requests.filter(r => r.status === 'cancelled').length },
  ]

  // Dados para valor de requisições por mês
  const monthlyData = requests.reduce((acc: any[], request) => {
    const date = new Date(request.createdAt)
    const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' })
    const existing = acc.find(item => item.month === monthKey)
    if (existing) {
      existing.value += request.totalValue
    } else {
      acc.push({ month: monthKey, value: request.totalValue })
    }
    return acc
  }, []).slice(-6)

  const COLORS = ['#3b82f6', '#06b6d4', '#f97316', '#22c55e', '#8b5cf6']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Distribuição por Categoria */}
      {categoryData.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Distribuição por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Gráfico de Valor por Fornecedor */}
      {supplierValue.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top 5 Fornecedores por Valor em Estoque</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={supplierValue}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={180} />
              <Tooltip formatter={(value) => `R$ ${(value as number).toFixed(2)}`} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Gráfico de Status de Requisições */}
      {statusData.some(s => s.value > 0) && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Status das Requisições</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Gráfico de Valor de Requisições por Mês */}
      {monthlyData.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Valor de Requisições por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${(value as number).toFixed(2)}`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Valor Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
