"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/app/types/order"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "../services/api"

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "pago":
      return "default"

    case "pending":
    case "pendente":
      return "secondary"

    case "reserved":
    case "reservado":
        return "secondary"

    case "cancelled":
    case "cancelado":
      return "destructive"


    default:
      return "outline"
  }
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
    console.log(data)
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

      {orders.map(order => (
        <Card key={order.id}>
          <CardContent className="p-4 space-y-4">

            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center flex-wrap gap-2">

              <div>
                <p className="text-sm text-muted-foreground">
                  Pedido #{order.id}
                </p>

                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>

              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>

            </div>

            {/* 🔥 ITENS */}
            <div className="space-y-3">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >

                  <img
                    src={item.product.images?.[0]?.url}
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
              ))}
            </div>

            {/* 🔥 ENDEREÇO */}
            <div className="text-xs text-muted-foreground border-t pt-3">
              Entrega em:{" "}
              {order.address?.street}, {order.address?.number} -{" "}
              {order.address?.city}/{order.address?.state} -{" "}
              {order.address?.zipcode}
            </div>

            {/* 🔥 TOTAL */}
            <div className="flex justify-end border-t pt-3">
              <p className="font-bold text-lg">
                Total: {formatPrice(order.total)}
              </p>
            </div>

          </CardContent>
        </Card>
      ))}

    </div>
  )
}