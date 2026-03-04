type User = {
  id: number
  email: string
}

export type Order = {
  id: number
  total: string
  status: string
  createdAt: string
  user: User
}

export type OrdersResponse = {
  data: Order[]
  total: number
  page: number
  lastPage: number
}