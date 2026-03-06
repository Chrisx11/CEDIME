'use client'

import { useAuth } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

const pageTitles: Record<string, { title: string; description?: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Dashboard operacional do CEDIME' },
  '/materials': { title: 'Gestão de Materiais', description: 'Cadastre, atualize e controle o estoque de materiais' },
  '/suppliers': { title: 'Gestão de Fornecedores', description: 'Cadastre e gerencie os fornecedores de materiais escolares' },
  '/institutions': { title: 'Gestão de Instituições', description: 'Cadastre e gerencie os colégios e instituições municipais' },
  '/entries': { title: 'Entradas de Materiais', description: 'Registre entradas de materiais no estoque' },
  '/outputs': { title: 'Saídas de Materiais', description: 'Registre saídas de materiais do estoque' },
  '/requests': { title: 'Requisições de Materiais', description: 'Gerencie as requisições de saída de materiais das instituições' },
  '/deliveries': { title: 'Entregas de Materiais', description: 'Gerencie as entregas de entrada de materiais dos fornecedores' },
  '/expenses-suppliers': { title: 'Despesas Fornecedor', description: 'Visualize e gerencie as despesas organizadas por fornecedor' },
  '/expenses-institutions': { title: 'Despesas Instituições', description: 'Visualize e gerencie as despesas organizadas por instituição' },
  '/expenses-products': { title: 'Despesas Produtos', description: 'Visualize e gerencie as despesas organizadas por produto' },
}

export function TopBar() {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const pageInfo = pageTitles[pathname] || { title: 'CEDIME' }

  return (
    <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 shadow-sm flex-shrink-0 relative z-30">
      <div className="flex h-[75px] items-center justify-between px-6">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            {pathname === '/dashboard' && user ? `Bem-vindo, ${user.name}` : pageInfo.title}
          </h1>
          {pageInfo.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{pageInfo.description}</p>
          )}
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  )
}

