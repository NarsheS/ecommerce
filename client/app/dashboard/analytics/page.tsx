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

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  const [exporting, setExporting] = useState(false)

  const [days, setDays] = useState("7")
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line")

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

  async function handleExportCsv() {
    try {
      setExporting(true)

      const response = await api.get(
        `/reports/orders/csv?days=${days}`,
        {
          responseType: "blob",
        }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", "vendas.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Erro ao exportar CSV", err)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    fetchData(days)
  }, [days])

  return (
    <div className="container mx-auto py-10 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold">Vendas</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o faturamento da sua loja
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          {/* PERÍODO */}
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Período" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="7">7 dias</SelectItem>
              <SelectItem value="30">30 dias</SelectItem>
              <SelectItem value="90">90 dias</SelectItem>
            </SelectContent>
          </Select>

          {/* TIPO */}
          <Select
            value={chartType}
            onValueChange={(value: "line" | "bar" | "area") =>
              setChartType(value)
            }
          >
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="line">Linha</SelectItem>
              <SelectItem value="bar">Barra</SelectItem>
              <SelectItem value="area">Área</SelectItem>
            </SelectContent>
          </Select>

          {/* EXPORT */}
          <Button
            variant="outline"
            onClick={handleExportCsv}
            disabled={exporting}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            {exporting ? "Exportando..." : "Exportar CSV"}
          </Button>

        </div>
      </div>

      {/* CARD */}
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

              {chartType === "line" && (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis tickFormatter={(v: any) => `R$ ${Number(v || 0)}`} />

                  <Tooltip
                    formatter={(v: any) => formatPrice(Number(v || 0))}
                    labelFormatter={(l) => `Data: ${formatDate(l)}`}
                  />

                  <Line type="monotone" dataKey="total" strokeWidth={3} />
                </LineChart>
              )}

              {chartType === "bar" && (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis tickFormatter={(v: any) => `R$ ${Number(v || 0)}`} />

                  <Tooltip
                    formatter={(v: any) => formatPrice(Number(v || 0))}
                    labelFormatter={(l) => `Data: ${formatDate(l)}`}
                  />

                  <Bar dataKey="total" />
                </BarChart>
              )}

              {chartType === "area" && (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis tickFormatter={(v: any) => `R$ ${Number(v || 0)}`} />

                  <Tooltip
                    formatter={(v: any) => formatPrice(Number(v || 0))}
                    labelFormatter={(l) => `Data: ${formatDate(l)}`}
                  />

                  <Area type="monotone" dataKey="total" />
                </AreaChart>
              )}

            </ResponsiveContainer>
          )}

        </CardContent>
      </Card>
    </div>
  )
}