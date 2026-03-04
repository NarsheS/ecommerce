"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>
      case "paid":
        return <Badge>Pago</Badge>
      case "shipped":
        return <Badge className="bg-blue-600">Enviado</Badge>
      case "completed":
        return <Badge className="bg-green-600">Concluído</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      )}

      {!loading && orders.length === 0 && (
        <p className="text-muted-foreground">
          Nenhum pedido encontrado.
        </p>
      )}

      {!loading && orders.map(order => (
        <Card key={order.id} className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Pedido #{order.id}</span>
              {getStatusBadge(order.status)}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <p>
              <strong>Cliente:</strong>{" "}
              {order.user?.email ?? "Usuário removido"}
            </p>

            <p>
              <strong>Total:</strong>{" "}
              R$ {Number(order.total).toFixed(2)}
            </p>

            <p>
              <strong>Data:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <Separator />

            {order.status === "paid" && (
              <Button
                onClick={() => markAsShipped(order.id)}
              >
                Marcar como Enviado
              </Button>
            )}

            {order.status === "shipped" && (
              <p className="text-green-600 font-medium">
                ✅ Já enviado
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Paginação */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => fetchOrders(page - 1)}
          >
            Anterior
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {page} de {lastPage}
          </span>

          <Button
            variant="outline"
            disabled={page === lastPage}
            onClick={() => fetchOrders(page + 1)}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}