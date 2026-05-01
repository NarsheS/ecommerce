"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/app/types/order"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "../services/api"
import Link from "next/link"

// 🔥 CONFIG CENTRALIZADA
const orderStatusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { label: "Pendente", variant: "secondary" },
  RESERVED: { label: "Reservado", variant: "secondary" },
  PAID: { label: "Pago", variant: "default" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
  SHIPPED: { label: "Enviado", variant: "outline" },
  DELIVERED: { label: "Entregue", variant: "default" }
}

const formatPrice = (value: string) => {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

const orderService = {
  async getMyOrders() {
    const { data } = await api.get("/orders")
    return data
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const data = await orderService.getMyOrders()
      setOrders(data)
      setLoading(false)
    }

    fetch()
  }, [])

  if (loading) {
    return <p className="p-6">Carregando pedidos...</p>
  }

  if (!orders.length) {
    return (
      <p className="p-6 text-center text-muted-foreground">
        Você ainda não fez nenhum pedido
      </p>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold">Meus Pedidos</h1>

      {orders.map(order => {
        const normalizedStatus = order.status.toUpperCase()
        const status = orderStatusConfig[normalizedStatus]

        return (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between items-center flex-wrap gap-2">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Pedido #{order.id}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>

                <Badge variant={status?.variant || "outline"}>
                  {status?.label || order.status}
                </Badge>

              </div>

              {/* ITENS */}
              <div className="space-y-3">
                {order.items.map(item => (
                  <Link
                    key={item.id}
                    href={`/products/${item.product.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/40 p-2 rounded-lg transition">

                      <img
                        src={item.product.images?.[0]?.url || "/placeholder.png"}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {item.product.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Quantidade: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        {formatPrice(item.finalPrice)}
                      </p>

                    </div>
                  </Link>
                ))}
              </div>

              {/* ENDEREÇO */}
              <div className="text-xs text-muted-foreground border-t pt-3">
                {order.address ? (
                  <>
                    Entrega em: {order.address.street}, {order.address.number} -{" "}
                    {order.address.city}/{order.address.state} -{" "}
                    {order.address.zipcode}
                  </>
                ) : (
                  "Endereço não informado"
                )}
              </div>

              {/* TOTAL */}
              <div className="flex justify-end border-t pt-3">
                <p className="font-bold text-lg">
                  Total: {formatPrice(order.total)}
                </p>
              </div>

            </CardContent>
          </Card>
        )
      })}

    </div>
  )
}