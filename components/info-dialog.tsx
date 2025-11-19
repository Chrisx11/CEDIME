'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface InfoDialogProps {
  isOpen: boolean
  title: string
  description: string
  buttonText?: string
  variant?: 'info' | 'warning' | 'success'
  onClose: () => void
}

export function InfoDialog({
  isOpen,
  title,
  description,
  buttonText = 'Entendi',
  variant = 'info',
  onClose,
}: InfoDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  const getIconBg = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-500/10'
      case 'success':
        return 'bg-green-500/10'
      default:
        return 'bg-primary/10'
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getIconBg()}`}>
              {getIcon()}
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full sm:w-auto">
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

