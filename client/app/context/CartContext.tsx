"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { api } from "@/app/services/api"
import type { Cart } from "@/app/types/cart"

type CartContextType = {
  cart: Cart | null
  refreshCart: () => Promise<void>
}

const CartContext = createContext({} as CartContextType)

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [cart, setCart] = useState<Cart | null>(null)

  const refreshCart = async () => {
    try {
      const { data } = await api.get("/cart")
      setCart(data)
    } catch {
      setCart(null)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider value={{ cart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)