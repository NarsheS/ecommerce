import { api } from "@/app/services/api"
import { Cart } from "@/app/types/cart"
import { useEffect, useState } from "react"

export default function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const response = await api.get("cart")
      setCart(response.data)
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const removeItem = async (productId: number) => {
    await api.delete(`cart/${productId}`)
    fetchCart()
  }

  const clearCart = async () => {
    await api.delete("cart")
    fetchCart()
  }

  return {
    cart,
    loading,
    removeItem,
    clearCart,
    refetch: fetchCart,
  }
}