"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

import { api } from "@/app/services/api"
import handleApiError from "@/app/utils/handleApiError"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import type { Product } from "@/app/types/product"

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const productId = Array.isArray(id) ? id[0] : id

  const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true)

        const { data } = await api.get(`/products/${productId}`)
        setProduct(data)

      } catch (error) {
        handleApiError(error, router, "Erro ao carregar produto")
      } finally {
        setLoading(false)
      }
    }

    if (productId) getProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Carregando...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center mt-10">
        Produto não encontrado
      </div>
    )
  }

  const images = product.images ?? []

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-8">

        {/* 🔥 CAROUSEL DE IMAGENS */}
        <div className="w-full">
          {images.length > 0 ? (
            <Carousel className="w-full relative">
              <CarouselContent>
                {images.map((img) => (
                  <CarouselItem key={img.id}>
                    <div className="relative aspect-square w-full">
                      <Image
                        src={img.url}
                        alt={product.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-2 z-10 cursor-pointer" />
              <CarouselNext className="right-2 z-10 cursor-pointer" />
            </Carousel>
          ) : (
            <div className="aspect-square bg-muted flex items-center justify-center">
              Sem imagem
            </div>
          )}
        </div>

        {/* 🔥 INFO */}
        <div className="flex flex-col gap-5">

          <h1 className="text-2xl font-bold">
            {product.name}
          </h1>

          <p className="text-muted-foreground">
            {product.description}
          </p>

          {/* PREÇO */}
          <div className="flex flex-col gap-1">
            {product.pricing?.hasDiscount ? (
              <>
                <span className="line-through text-gray-500">
                  {priceFormatter.format(product.pricing.originalPrice)}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {priceFormatter.format(product.pricing.finalPrice)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {priceFormatter.format(product.pricing.originalPrice)}
              </span>
            )}
          </div>

          {/* ESTOQUE */}
          <span className="text-sm">
            Estoque: {product.inStock}
          </span>

        </div>

      </div>

    </div>
  )
}