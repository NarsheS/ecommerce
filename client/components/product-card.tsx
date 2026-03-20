"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Product } from "@/app/types/product"

type Props = {
  dashboard?: boolean
  product: Product
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onImages?: (id: number) => void
}

export function ProductCard({
  product,
  dashboard = false,
  onEdit,
  onDelete,
  onImages,
}: Props) {
  const images = product.images ?? []
  const [zoomOpen, setZoomOpen] = useState(false)

  const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    <>
      <Card className="w-full h-full flex flex-col overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all">

        <CardContent className="p-0 flex flex-col h-full">

          {/* CARROSSEL */}
          {images.length > 0 ? (
            <Carousel className="w-full relative">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={img.id}>
                    <div
                      className="relative aspect-square w-full cursor-zoom-in pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        setZoomOpen(true)
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} imagem ${index + 1}`}
                        fill
                        className="object-cover pointer-events-none"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                className="cursor-pointer left-1 scale-90 pointer-events-auto z-10"
              />
              <CarouselNext
                className="cursor-pointer right-1 scale-90 pointer-events-auto z-10"
              />
            </Carousel>
          ) : (
            <div className="aspect-square w-full bg-muted flex items-center justify-center text-[11px] text-muted-foreground">
              Sem imagens
            </div>
          )}

          {/* LINK APENAS NO CONTEÚDO */}
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            <div className="p-3 flex flex-col flex-1 cursor-pointer">

              {/* NOME */}
              <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                {product.name}
              </h3>

              {/* PREÇO + ESTOQUE */}
              <div className="mt-auto flex justify-between items-center text-xs pt-2">
                {product.pricing.hasDiscount ? (
                  <div className="flex flex-col">
                    <span className="line-through text-gray-500 text-xs">
                      {priceFormatter.format(product.pricing.originalPrice)}
                    </span>
                    <span className="font-semibold text-sm">
                      {priceFormatter.format(product.pricing.finalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold text-sm">
                    {priceFormatter.format(product.pricing.originalPrice)}
                  </span>
                )}

                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    product.inStock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.inStock > 0
                    ? `${product.inStock} un.`
                    : "Sem estoque"}
                </span>
              </div>

            </div>
          </Link>

        </CardContent>

        {/* DASHBOARD */}
        {dashboard && (
          <CardFooter className="grid grid-cols-3 gap-1.5 px-3 pb-3 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                onImages?.(product.id)
              }}
            >
              Imagens
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(product.id)
              }}
            >
              Editar
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(product.id)
              }}
            >
              Excluir
            </Button>
          </CardFooter>
        )}

      </Card>

      {/* ZOOM */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="w-screen h-screen max-w-none p-0 bg-black border-none">

          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 z-50 text-white text-xl"
          >
            ✕
          </button>

          <Carousel className="w-full h-full">
            <CarouselContent>
              {images.map(img => (
                <CarouselItem key={img.id}>
                  <div className="relative w-full h-screen flex items-center justify-center">
                    <Image
                      src={img.url}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4 cursor-pointer" />
            <CarouselNext className="right-4 cursor-pointer" />
          </Carousel>

        </DialogContent>
      </Dialog>
    </>
  )
}