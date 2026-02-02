import { useEffect, useState } from 'react'
import { categoryService } from '@/app/services/category.service'
import type { Category } from '@/app/types/category'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    refresh: fetchCategories,
  }
}
