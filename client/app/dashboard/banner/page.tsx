"use client"

import { useEffect, useState } from "react"
import { api } from "@/app/services/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { Banner } from "@/app/types/banner"

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchBanners = async () => {
    const { data } = await api.get("/banners")
    setBanners(data)
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleUpload = async () => {
    if (!file) return alert("Selecione uma imagem")

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("link", link)

      await api.post("/banners", formData)

      setFile(null)
      setTitle("")
      setLink("")
      fetchBanners()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    await api.delete(`/banners/${id}`)
    fetchBanners()
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Banners do Carrossel</h1>

      {/* 🔥 FORM */}
      <Card>
        <CardContent className="p-4 space-y-4">

          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

          <Input
            placeholder="Título (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Link (ex: /produto/1)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Enviando..." : "Adicionar Banner"}
          </Button>

        </CardContent>
      </Card>

      {/* 🔥 LISTA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {banners.map(banner => (
          <Card key={banner.id}>
            <CardContent className="p-2 space-y-2">

              <img
                src={banner.url}
                className="w-full h-32 object-cover rounded-lg"
              />

              <p className="text-sm truncate">
                {banner.title || "Sem título"}
              </p>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(banner.id)}
              >
                Remover
              </Button>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}