import type { Category } from "./category"

export type ProductImage = {
  id: number
  url: string
}

type Pricing = {
  originalPrice: number
  finalPrice: number
  discountAmount: number
  disocuntPercentage: number
  hasDiscount: boolean
}

export type Product = {
  id: number
  name: string
  description?: string
  inStock: number
  price: number
  pricing: Pricing
  category?: Category | null
  images?: ProductImage[]
}