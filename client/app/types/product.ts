import type { Category } from "./category"

export type ProductImage = {
  id: number
  url: string
}

export type Product = {
  id: number
  name: string
  description: string
  inStock: number
  price: number
  category: Category | null
  images: ProductImage[]
}