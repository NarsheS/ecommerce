"use client"

import { useEffect, useState } from "react"
import { api } from "@/app/services/api"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type SalesData = {
  date: string
  total: number
}

export default function SalesPage() {
  const [data, setData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState("7")

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  async function fetchData(selectedDays: string) {
    try {
      setLoading(true)

      const { data } = await api.get(`/analytics/sales?days=${selectedDays}`)

      setData(data)
    } catch (err) {
      console.error("Erro ao buscar vendas", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(days)
  }, [days])

  return (
    <div className="container mx-auto py-10 space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vendas</h1>

        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturamento</CardTitle>
        </CardHeader>

        <CardContent className="h-[400px]">

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Carregando...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Nenhuma venda encontrada
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                />

                <YAxis
                  tickFormatter={(value) => `R$ ${value}`}
                />

                <Tooltip
                  formatter={(value) => formatPrice(Number(value ?? 0))}
                  labelFormatter={(label) =>
                    `Data: ${formatDate(label)}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

        </CardContent>
      </Card>
    </div>
  )
}