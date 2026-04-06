"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { Banner } from "@/app/types/banner"
import { bannerService } from "@/app/services/banner.service"

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchBanners = async () => {
    const data = await bannerService.getAll()
    setBanners(data)
  }

  useEffect(() => {
    fetchBanners()
  }, [])


  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    await bannerService.create(file, title, link)
    await fetchBanners()
    setLoading(false)
  }

  const handleToggle = async (id: number) => {
    await bannerService.toggle(id)
    fetchBanners()
  }

  const handleUpdate = async (id: number, banner: Banner) => {
    await bannerService.update(id, banner)
    fetchBanners()
  }

  const handleDelete = async (id: number) => {
    await bannerService.remove(id)
    fetchBanners()
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Banners do Carrossel</h1>

      {/* 🔥 FORM */}
      <Card>
        <CardContent className="p-4 space-y-4">

          <div className="space-y-3">

            {/* 🔥 PREVIEW */}
            {file && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border">
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover"
                />

                {/* remover imagem */}
                <button
                  onClick={() => setFile(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs"
                >
                  Remover
                </button>
              </div>
            )}

            {/* 🔥 BOTÃO BONITO */}
            <label className="block">
              <div className="flex items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-muted transition">

                <span className="text-sm text-muted-foreground">
                  {file ? "Trocar imagem" : "Clique para selecionar uma imagem"}
                </span>

              </div>

              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

          </div>

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
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-3 space-y-3">

              <img
                src={banner.url}
                className={`w-full h-32 object-cover rounded-lg ${
                  !banner.isActive ? "opacity-40" : ""
                }`}
              />

              <Input
                value={banner.title || ""}
                onChange={(e) => {
                  const newBanners = banners.map(b =>
                    b.id === banner.id ? { ...b, title: e.target.value } : b
                  )
                  setBanners(newBanners)
                }}
                placeholder="Título"
              />

              <Input
                value={banner.link || ""}
                onChange={(e) => {
                  const newBanners = banners.map(b =>
                    b.id === banner.id ? { ...b, link: e.target.value } : b
                  )
                  setBanners(newBanners)
                }}
                placeholder="Link"
              />

              <div className="flex gap-2">

                <Button
                  size="sm"
                  onClick={() => handleUpdate(banner.id, banner)}
                >
                  Salvar
                </Button>

                <Button
                  size="sm"
                  variant={banner.isActive ? "secondary" : "default"}
                  onClick={() => handleToggle(banner.id)}
                >
                  {banner.isActive ? "Desativar" : "Ativar"}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(banner.id)}
                >
                  Remover
                </Button>

              </div>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}