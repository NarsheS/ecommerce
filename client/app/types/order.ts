import { Product } from "./product"

type Address = {
  street: string
  number: string
  city: string
  state: string
  zipcode: string
}

type User = {
  id: number
  username: string
  email: string
}

export type OrderItem = {
  id: number
  quantity: number
  finalPrice: string
  product: Product
}

export type Order = {
  id: number
  total: string
  status: string
  createdAt: string
  user: User
  address: Address
  items: OrderItem[]
}

export type OrdersApiResponse = {
  data: Order[]
  total: number
  page: number
  lastPage: number
}