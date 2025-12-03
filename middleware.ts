import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Permitir acesso público a login e raiz sem verificar autenticação
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Se não há variáveis de ambiente, permitir acesso (desenvolvimento)
    return response
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Se há erro de autenticação (ex: refresh token inválido), limpar cookies e redirecionar
    if (error) {
      // Limpar todos os cookies de autenticação do Supabase
      const allCookies = request.cookies.getAll()
      allCookies.forEach((cookie) => {
        if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
          response.cookies.delete(cookie.name)
        }
      })
      
      // Se for erro de refresh token, redirecionar para login
      if (error.message?.includes('Refresh Token') || 
          error.message?.includes('JWT') ||
          error.message?.includes('refresh_token_not_found')) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // Se não há usuário em rota protegida, redirecionar para login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error: any) {
    // Em caso de erro de refresh token, limpar cookies e redirecionar
    if (error?.message?.includes('Refresh Token') || 
        error?.message?.includes('JWT') ||
        error?.message?.includes('refresh_token_not_found')) {
      // Limpar todos os cookies de autenticação do Supabase
      const allCookies = request.cookies.getAll()
      allCookies.forEach((cookie) => {
        if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
          response.cookies.delete(cookie.name)
        }
      })
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Para outros erros, apenas logar e continuar
    console.error('Erro no middleware:', error)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
