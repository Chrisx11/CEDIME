'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import Image from 'next/image'

export function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login')
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="text-xl font-semibold tracking-tight text-foreground mb-2">CEDIME</div>
          <div className="text-sm text-muted-foreground">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="w-full bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 px-6 py-3">
            <div className="flex justify-end">
              <Image
                src="/Inserir um título (800 x 400 px).png"
                alt="CEDIME - Centro de Distribuição de Material Escolar"
                width={300}
                height={150}
                className="h-auto max-w-[300px] object-contain drop-shadow-sm"
                priority
                unoptimized
              />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
