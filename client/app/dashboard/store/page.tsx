"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/app/services/api"
import handleApiError from "@/app/utils/handleApiError"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function StorePage() {
  const [form, setForm] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    zipcode: "",
  })

  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // carregar dados atuais
  useEffect(() => {
    async function fetchStore() {
      try {
        const { data } = await api.get("/store/settings") // 👈 usa axios

        if (data?.shippingOrigin) {
          setForm(data.shippingOrigin)
        }
      } catch (err) {
        console.error("Erro ao carregar loja", err)
      }
    }

    fetchStore()
  }, [])

  // atualizar campos
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // salvar
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put("/store/address", form)

      toast.success("Endereço salvo com sucesso!")
    } catch (err) {
      handleApiError(err, router, "Erro ao salvar endereço da loja")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-bold">
            Endereço da loja
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input name="street" placeholder="Rua" value={form.street} onChange={handleChange} />
            <Input name="number" placeholder="Número" value={form.number} onChange={handleChange} />
            <Input name="city" placeholder="Cidade" value={form.city} onChange={handleChange} />
            <Input name="state" placeholder="Estado" value={form.state} onChange={handleChange} />
            <Input name="zipcode" placeholder="CEP" value={form.zipcode} onChange={handleChange} />

            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}