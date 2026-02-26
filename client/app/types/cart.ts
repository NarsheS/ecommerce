type Pricing = {
  basePrice: number
  finalPrice: number
  discount?: number
}

type Product = {
  id: number
  name: string
  image?: string
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