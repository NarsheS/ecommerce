"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { api } from "@/app/services/api"
import type { Cart } from "@/app/types/cart"
import type { Address } from "@/app/types/Address"

type CartContextType = {
  cart: Cart | null

  addresses: Address[]

  selectedAddressId: number | null

  setSelectedAddressId: React.Dispatch<
    React.SetStateAction<number | null>
  >

  loading: boolean

  refreshCart: () => Promise<void>

  removeItem: (productId: number) => Promise<void>

  clearCart: () => Promise<void>

  updateItemQuantity: (
    productId: number,
    quantity: number
  ) => Promise<void>
}

const CartContext = createContext({} as CartContextType)

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const [cart, setCart] = useState<Cart | null>(null)

  const [addresses, setAddresses] = useState<Address[]>([])

  const [selectedAddressId, setSelectedAddressId] =
    useState<number | null>(null)

  const [loading, setLoading] = useState(true)

  const refreshCart = async () => {
    try {

      const { data } = await api.get("/cart")

      setCart(data)

    } catch {
      setCart(null)
    }
  }

  const fetchAddresses = async () => {
    try {

      const { data } = await api.get("/users/address")

      setAddresses(data)

      if (data.length > 0) {
        setSelectedAddressId(prev =>
          prev ?? data[0].id
        )
      }

    } catch {
      setAddresses([])
    }
  }

  const fetchAll = async () => {
    try {

      setLoading(true)

      await Promise.all([
        refreshCart(),
        fetchAddresses(),
      ])

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const removeItem = async (productId: number) => {
    const { data } = await api.delete(`/cart/${productId}`)

    setCart(data)
  }

  const clearCart = async () => {
    const { data } = await api.delete("/cart")

    setCart(data)
  }

  const updateItemQuantity = async (
    productId: number,
    quantity: number
  ) => {

    setCart(prev => {
      if (!prev) return prev

      return {
        ...prev,
        items: prev.items
          .map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
          .filter(item => item.quantity > 0)
      }
    })

    try {

      const { data } = await api.patch(
        `/cart/item/${productId}`,
        { quantity }
      )

      setCart(data)

    } catch {

      await refreshCart()
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,

        addresses,

        selectedAddressId,
        setSelectedAddressId,

        loading,

        refreshCart,

        removeItem,

        clearCart,

        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)