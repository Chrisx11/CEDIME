'use client'

import Image from 'next/image'
import { ReactNode, useState } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-1.5">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-1.5">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {/* Logo e Botão */}
        {!imageError && (
          <div className="flex-shrink-0 flex flex-col items-end gap-3">
            <Image
              src="/Inserir um título (800 x 400 px).png"
              alt="CEDIME - Centro de Distribuição de Material Escolar"
              width={300}
              height={150}
              className="h-auto max-w-[300px] object-contain drop-shadow-sm"
              priority
              unoptimized
              onError={() => setImageError(true)}
            />
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        )}
        {imageError && action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

