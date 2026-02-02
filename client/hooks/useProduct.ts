import { useEffect, useState } from 'react'
import { productService } from '@/app/services/product.service'
import type { Product } from '@/app/types/product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getAll()
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, refresh: fetchProducts }
}
