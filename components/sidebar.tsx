'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Building2, 
  School, 
  Package, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  ArrowRightCircle,
  ArrowDownCircle,
  Truck,
  DollarSign,
  TrendingDown
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Carregar estado do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // Salvar estado no localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/suppliers', label: 'Fornecedores', icon: Building2 },
    { href: '/institutions', label: 'Instituições', icon: School },
    { href: '/materials', label: 'Materiais', icon: Package },
    { href: '/entries', label: 'Entradas', icon: ArrowDownCircle },
    { href: '/outputs', label: 'Saídas', icon: ArrowRightCircle },
    { href: '/requests', label: 'Requisições', icon: FileText },
    { href: '/deliveries', label: 'Entregas', icon: Truck },
    { href: '/expenses-suppliers', label: 'Despesas Fornecedor', icon: DollarSign },
    { href: '/expenses-institutions', label: 'Despesas Instituições', icon: TrendingDown },
    { href: '/expenses-products', label: 'Despesas Produtos', icon: DollarSign },
  ]

  return (
    <aside className={cn(
      'bg-sidebar border-r border-sidebar-border flex flex-col h-screen transition-all duration-300 relative overflow-x-visible z-40',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Botão de recolher/expandir */}
      <button
        onClick={toggleCollapse}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-[9999] h-6 w-6 rounded-full border-2 border-sidebar-primary bg-sidebar-primary shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        style={{ zIndex: 9999 }}
        aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-sidebar-primary-foreground" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-sidebar-primary-foreground" />
        )}
      </button>
      <div className={cn(
        'border-b border-sidebar-border transition-all duration-300 relative flex items-center justify-center',
        isCollapsed ? 'px-4 py-6' : 'px-6 py-6'
      )}>
        {!isCollapsed ? (
          <h1 className="text-xl font-semibold tracking-tight text-sidebar-primary text-center">CEDIME</h1>
        ) : (
          <h1 className="text-xl font-semibold tracking-tight text-sidebar-primary text-center">C</h1>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 mb-1 rounded-md transition-all duration-200 text-sm font-medium group relative',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn(
                'h-4 w-4 flex-shrink-0',
                isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/60'
              )} />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
