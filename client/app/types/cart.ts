import { Product } from "./product"

type CartItem = {
  id: number
  quantity: number
  product: Product
}

export type Cart = {
  id: number
  items: CartItem[]
}
