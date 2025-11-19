import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Máscara para CNPJ: XX.XXX.XXX/0001-XX
export function maskCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  } else if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  } else {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }
}

// Máscara para telefone: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length === 0) {
    return ''
  } else if (numbers.length <= 2) {
    return `(${numbers}`
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  } else {
    // Telefone com 11 dígitos (celular com 9 dígitos)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

// Remove máscaras para salvar apenas números
export function unmaskCNPJ(value: string): string {
  return value.replace(/\D/g, '')
}

export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '')
}
