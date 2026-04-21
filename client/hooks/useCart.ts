import { api } from "@/app/services/api"
import type { Address } from "@/app/types/Address"
import { Cart } from "@/app/types/cart"
import handleApiError from "@/app/utils/handleApiError"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  const fetchCart = async () => {
    try {
      const response = await api.get("cart")
      setCart(response.data)
    } catch (error) {
      console.error("Carrinho vazio", error)
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await api.get("users/address")
      setAddresses(response.data)

      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id)
      }

    } catch (error) {
      console.error("Sem endereços", error)
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([
      fetchCart(),
      fetchAddresses()
    ])
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const removeItem = async (productId: number) => {
    await api.delete(`cart/${productId}`)
    fetchCart()
  }

  const clearCart = async () => {
    await api.delete("cart")
    fetchCart()
  }

  const updateItemQuantity = async (productId: number, quantity: number) => {
    setCart(prev => {
      if (!prev) return prev

      return {
        ...prev,
        items: prev.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      }
    })

    try {
      await api.patch(`/cart/item/${productId}`, { quantity })
    } catch {
      await fetchCart()
    }
  }

  // ORDER + PAYMENT
  const createOrderPayment = async () => {
    try {

      if (!selectedAddressId) {
        alert("Selecione um endereço antes de continuar")
        return
      }

      const { data } = await api.post("orders/checkout", {
        addressId: selectedAddressId
      })

      const paymentResponse = await api.post(`/payments/create/${data.id}`)

      const paymentUrl = paymentResponse.data.url

      window.location.href = paymentUrl

    } catch (error) {
      handleApiError(error, router, "Erro ao redirecionar para o pagamento")
    }
  }

  return {
    cart,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    loading,
    removeItem,
    clearCart,
    refetch: fetchCart,
    updateItemQuantity,
    createOrderPayment,
  }
}