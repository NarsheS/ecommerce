"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "../services/api"
import handleApiError from "../utils/handleApiError"
import type { Order, OrdersResponse } from "../types/order"


export default function Dashboard() {
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchOrders = async (currentPage = 1) => {
    try {
      setLoading(true)

      const { data } = await api.get<OrdersResponse>(
        `/orders/admin?page=${currentPage}&limit=10`
      )

      setOrders(data.data)
      setPage(data.page)
      setLastPage(data.lastPage)

    } catch (error) {
      handleApiError(error, router, "Erro ao buscar pedidos", {
        redirectOn401: true
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsShipped = async (orderId: number) => {
    try {
      await api.patch(`/orders/admin/${orderId}/status`, {
        status: "shipped",
      })

      fetchOrders(page)

    } catch (error) {
      handleApiError(error, router, "Erro ao atualizar status")
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard Admin</h1>

      {loading && <p>Carregando...</p>}

      {!loading && orders.length === 0 && (
        <p>Nenhum pedido encontrado.</p>
      )}

      {!loading && orders.map(order => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        >
          <p><strong>Pedido:</strong> #{order.id}</p>
          <p><strong>Cliente:</strong> {order.user.email}</p>
          <p><strong>Total:</strong> R$ {Number(order.total).toFixed(2)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p>
            <strong>Data:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          {order.status === "paid" && (
            <button
              onClick={() => markAsShipped(order.id)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                cursor: "pointer"
              }}
            >
              Marcar como Enviado
            </button>
          )}

          {order.status === "shipped" && (
            <p style={{ color: "green", marginTop: "10px" }}>
              ✅ Já enviado
            </p>
          )}
        </div>
      ))}

      {/* Paginação */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => fetchOrders(page - 1)}
        >
          Anterior
        </button>

        <span style={{ margin: "0 10px" }}>
          Página {page} de {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => fetchOrders(page + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  )
}