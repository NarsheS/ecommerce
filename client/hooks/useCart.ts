"use client"

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
      const response = await api.get("/cart")

      setCart(response.data)

    } catch (error) {
      console.error("Carrinho vazio", error)

      setCart(null)
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/users/address")

      setAddresses(response.data)

      if (response.data.length > 0) {
        setSelectedAddressId(prev =>
          prev ?? response.data[0].id
        )
      }

    } catch (error) {
      console.error("Sem endereços", error)
    }
  }

  const fetchAll = async () => {
    try {
      setLoading(true)

      await Promise.all([
        fetchCart(),
        fetchAddresses(),
      ])

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // REMOVE ITEM
  const removeItem = async (productId: number) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`)

      setCart(data)

    } catch (error) {
      handleApiError(error, router, "Erro ao remover item")
    }
  }

  // LIMPAR CARRINHO
  const clearCart = async () => {
    try {
      const { data } = await api.delete("/cart")

      setCart(data)

    } catch (error) {
      handleApiError(error, router, "Erro ao limpar carrinho")
    }
  }

  // ALTERAR QUANTIDADE
  const updateItemQuantity = async (
    productId: number,
    quantity: number
  ) => {

    // atualização otimista
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

      // backend retorna carrinho atualizado
      setCart(data)

    } catch (error) {

      // rollback
      await fetchCart()

      handleApiError(
        error,
        router,
        "Erro ao atualizar quantidade"
      )
    }
  }

  // REFRESH MANUAL
  const refetch = async () => {
    await fetchCart()
  }

  // ORDER + PAYMENT
  const createOrderPayment = async () => {
    try {

      if (!selectedAddressId) {
        alert("Selecione um endereço antes de continuar")
        return
      }

      const { data } = await api.post("/orders/checkout", {
        addressId: selectedAddressId
      })

      const paymentResponse = await api.post(
        `/payments/create/${data.id}`
      )

      const paymentUrl = paymentResponse.data.url

      window.location.href = paymentUrl

    } catch (error) {
      handleApiError(
        error,
        router,
        "Erro ao redirecionar para o pagamento"
      )
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

    refetch,

    updateItemQuantity,

    createOrderPayment,
  }
}