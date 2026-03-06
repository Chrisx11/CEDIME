import { useCategoriesUnits, Unit } from '@/lib/categories-units-context'

// Re-export Unit type for backward compatibility
export type { Unit }

export function useUnits() {
  const {
    units,
    isLoadingUnits: isLoading,
    addUnit,
    updateUnit,
    deleteUnit,
    refreshUnits,
  } = useCategoriesUnits()

  return {
    units,
    isLoading,
    addUnit,
    updateUnit,
    deleteUnit,
    refreshUnits,
  }
}

