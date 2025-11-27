import { useCategoriesUnits, Category } from '@/lib/categories-units-context'

// Re-export Category type for backward compatibility
export type { Category }

export function useCategories() {
  const {
    categories,
    isLoadingCategories: isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  } = useCategoriesUnits()

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  }
}

