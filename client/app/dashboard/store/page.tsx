"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function StorePage() {
  const [form, setForm] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    zipcode: "",
  })

  const [loading, setLoading] = useState(false)

  // 🔥 carregar dados atuais
  useEffect(() => {
    async function fetchStore() {
      const res = await fetch("http://localhost:3000/store")
      const data = await res.json()

      if (data?.shippingOrigin) {
        setForm(data.shippingOrigin)
      }
    }

    fetchStore()
  }, [])

  // 🔥 atualizar campos
  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // 🔥 salvar
  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch("http://localhost:3000/store", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingOrigin: form,
        }),
      })

      alert("Endereço salvo com sucesso!")
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar")
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