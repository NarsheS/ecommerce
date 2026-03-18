"use client"

import { useState } from "react"
import Image from "next/image"
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
  addToCart?: (id: number, quantity: number) => void
}

export function ProductCard({
  product,
  dashboard = false,
  onEdit,
  onDelete,
  onImages,
  addToCart
}: Props) {
  const images = product.images ?? []

  const [quantity, setQuantity] = useState("1")
  const [zoomOpen, setZoomOpen] = useState(false)

  const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const increase = () => {
    const value = Number(quantity) || 1
    if (value < product.inStock) {
      setQuantity(String(value + 1))
    }
  }

  const decrease = () => {
    const value = Number(quantity) || 1
    if (value > 1) {
      setQuantity(String(value - 1))
    }
  }

  return (
    <>
      <Card className="w-full max-w-65 flex flex-col overflow-visible">

        <CardContent className="flex-1 pt-0 px-0 space-y-2">

          {/* CARROSSEL */}
          {images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={img.id}>
                    <div
                      className="relative aspect-4/3 w-full cursor-zoom-in"
                      onClick={() => setZoomOpen(true)}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} imagem ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="260px"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="cursor-pointer left-1 scale-90" />
              <CarouselNext className="cursor-pointer right-1 scale-90" />
            </Carousel>
          ) : (
            <div className="aspect-4/3 w-full bg-muted flex items-center justify-center text-[11px] text-muted-foreground">
              Sem imagens
            </div>
          )}

          {/* NOME */}
          <div className="px-3 pt-1">
            <h3 className="text-sm font-semibold leading-tight line-clamp-1">
              {product.name}
            </h3>
          </div>

          {/* PREÇO */}
          <div className="px-3 space-y-1">
            <div className="flex justify-between items-center text-xs">

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

            <p className="text-[11px] text-muted-foreground line-clamp-2">
              {product.description || "Sem descrição disponível."}
            </p>
          </div>

        </CardContent>

        {/* FOOTER */}
        {!dashboard && (
          <CardFooter className="px-3 pb-3 pt-2 flex gap-2">

            {/* QUANTIDADE */}
            <div className="flex items-center border rounded-md overflow-hidden">

              <button
                onClick={decrease}
                className="px-2 py-1 text-sm hover:bg-muted cursor-pointer"
              >
                -
              </button>

              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                placeholder="1"
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const value = e.target.value

                  // permite só números
                  if (!/^\d*$/.test(value)) return

                  setQuantity(value)
                }}
                onBlur={() => {
                  let value = Number(quantity)

                  if (!value || value < 1) value = 1
                  if (value > product.inStock) value = product.inStock

                  setQuantity(String(value))
                }}
                className="w-12 text-center text-sm font-medium outline-none appearance-none"
              />

              <button
                onClick={increase}
                className="px-2 py-1 text-sm hover:bg-muted cursor-pointer"
              >
                +
              </button>

            </div>

            {/* BOTÃO */}
            <Button
              className="flex-1 cursor-pointer"
              disabled={product.inStock === 0}
              onClick={() => addToCart?.(product.id, Number(quantity) || 1)}
            >
              Adicionar
            </Button>

          </CardFooter>
        )}

        {/* DASHBOARD */}
        {dashboard && (
          <CardFooter className="grid grid-cols-3 gap-1.5 px-3 pb-3 pt-2">
            <Button size="sm" variant="outline" onClick={() => onImages?.(product.id)}>
              Imagens
            </Button>

            <Button size="sm" variant="secondary" onClick={() => onEdit?.(product.id)}>
              Editar
            </Button>

            <Button size="sm" variant="destructive" onClick={() => onDelete?.(product.id)}>
              Excluir
            </Button>
          </CardFooter>
        )}

      </Card>

      {/* ZOOM FULLSCREEN */}
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

            <CarouselPrevious className="left-4 text-white" />
            <CarouselNext className="right-4 text-white" />
          </Carousel>

        </DialogContent>
      </Dialog>
    </>
  )
}