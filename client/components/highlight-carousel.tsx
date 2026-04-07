"use client"

import { useEffect, useState } from "react"
import { api } from "@/app/services/api"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Banner = {
  id: number
  url: string
  title?: string
  link?: string
}

export const HighlightCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get("/banners")
      setBanners(data)
    }
    fetch()
  }, [])

  // autoplay
  useEffect(() => {
    if (!banners.length) return

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners])

  if (!banners.length) return null

  const prev = () => {
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  const next = () => {
    setIndex((prev) => (prev + 1) % banners.length)
  }

  return (
  <div className="relative w-[96%] max-w-6xl mx-auto aspect-[16/5] rounded-2xl overflow-hidden shadow-md">

    {/* 🔥 IMAGENS COM FADE */}
    <div className="relative w-full h-full">

      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === index
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105 pointer-events-none"
          }`}
        >

          {/* background blur */}
          <img
            src={banner.url}
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
          />

          {/* imagem principal */}
          {banner.link ? (
            <Link href={banner.link}>
              <img
                src={banner.url}
                className="relative w-full h-full object-contain cursor-pointer transition-transform duration-700 ease-in-out"
              />
            </Link>
          ) : (
            <img
              src={banner.url}
              className="relative w-full h-full object-contain transition-transform duration-700 ease-in-out"
            />
          )}

        </div>
      ))}

    </div>

    {/* 🔥 BOTÃO ESQUERDA */}
    <Button
      size="icon"
      variant="secondary"
      onClick={prev}
      className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/70 text-white transition"
    >
      <ChevronLeft />
    </Button>

    {/* 🔥 BOTÃO DIREITA */}
    <Button
      size="icon"
      variant="secondary"
      onClick={next}
      className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/70 text-white transition"
    >
      <ChevronRight />
    </Button>

    {/* 🔥 INDICADORES */}
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
      {banners.map((_, i) => (
        <div
          key={i}
          onClick={() => setIndex(i)}
          className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
            i === index
              ? "bg-white scale-125"
              : "bg-white/40 hover:bg-white/70"
          }`}
        />
      ))}
    </div>

  </div>
)
}