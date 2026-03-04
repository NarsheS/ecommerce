import { api } from "@/app/services/api"
import { Cart } from "@/app/types/cart"
import handleApiError from "@/app/utils/handleApiError"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchCart = async () => {
    try {
      const response = await api.get("cart")
      setCart(response.data)
    } catch (error) {
      handleApiError(error, router, "Erro ao buscar o carrinho")
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

  const updateItemQuantity = async (productId: number, quantity: number) => {
    const { data } = await api.patch(`/cart/item/${productId}`, {
      quantity,
    });

    setCart(data);
  }

  // Order & Payments
  const createOrderPayment = async () => {
    try{
      const { data } = await api.post("orders/checkout")
      const paymentResponse = await api.post(`/payments/create/${data.id}`)
      const paymentUrl = paymentResponse.data.url

      window.location.href = paymentUrl

      console.log(paymentResponse)

    }catch(error){
      handleApiError(error, router, "Erro ao redirecionar para o pagamento")
    }
  }

  return {
    cart,
    loading,
    removeItem,
    clearCart,
    refetch: fetchCart,
    updateItemQuantity,
    createOrderPayment,
  }
}