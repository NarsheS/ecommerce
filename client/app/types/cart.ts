import { Product } from "./product"

type Pricing = {
  originalPrice: number
  finalPrice: number
  discountAmount: number
  discountPercentage: number
  hasDiscount: boolean
}

type CartItem = {
  id: number
  quantity: number
  product: Product
  pricing: Pricing
  subtotal: number
}

export type Cart = {
  id: number
  items: CartItem[]
  total: number
}