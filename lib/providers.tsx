'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DataProvider } from '@/lib/data-context'
import { CategoriesUnitsProvider } from '@/lib/categories-units-context'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <CategoriesUnitsProvider>
          {children}
        </CategoriesUnitsProvider>
      </DataProvider>
    </AuthProvider>
  )
}
