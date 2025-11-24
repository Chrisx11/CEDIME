'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(mapSupabaseUserToUser(session.user))
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUserToUser(session.user))
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message || 'Credenciais inválidas')
      }

      if (data.user) {
        setUser(mapSupabaseUserToUser(data.user))
      } else {
        throw new Error('Falha ao fazer login')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro ao fazer logout:', error)
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Função auxiliar para mapear usuário do Supabase para o formato User
function mapSupabaseUserToUser(supabaseUser: SupabaseUser): User {
  // Extrair nome do email ou usar user_metadata se disponível
  const name = supabaseUser.user_metadata?.name || 
               supabaseUser.user_metadata?.full_name ||
               supabaseUser.email?.split('@')[0] || 
               'Usuário'
  
  // Extrair role do user_metadata ou usar 'admin' como padrão
  const role = (supabaseUser.user_metadata?.role as 'admin' | 'manager' | 'viewer') || 'admin'

  return {
    id: supabaseUser.id,
    name,
    email: supabaseUser.email || '',
    role,
  }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
