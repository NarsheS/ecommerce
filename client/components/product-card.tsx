"use client"

import Image from "next/image"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import type { Product } from "@/app/types/product"


type Props = {
  dashboard?: boolean
  product: Product
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onImages?: (id: number) => void
  addToCart?: (id: number) => void
}

export function ProductCard({ product, dashboard = false, onEdit, onDelete, onImages, addToCart }: Props) {
  const images = product.images ?? []

  const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })

  return (
    <Card className="w-full max-w-65 flex flex-col overflow-visible">

      <CardContent className="flex-1 pt-0 px-0 space-y-2">
        {/* Carrossel */}
        {images.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={img.id}>
                  <div className="relative aspect-4/3 w-full">
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

        {/* Nome */}
        <div className="px-3 pt-1">
          <h3 className="text-sm font-semibold leading-tight line-clamp-1">
              {product.name}
          </h3>
        </div>

        {/* Info */}
        <div className="px-3 space-y-1">
          <div className="flex justify-between items-center text-xs"> 
            {product.pricing.hasDiscount ? 
            (<span className="font-semibold">{priceFormatter.format(product.pricing.finalPrice)}</span>) 
            : (<span className="font-semibold">{priceFormatter.format(product.pricing.originalPrice)}</span>)
            }
            

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

      {dashboard ?
       (
        <CardFooter className="grid grid-cols-3 gap-1.5 px-3 pb-3 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer h-8 text-[11px] px-2"
            onClick={() => onImages?.(product.id)}
          >
            Imagens
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="cursor-pointer h-8 text-[11px] px-2"
            onClick={() => onEdit?.(product.id)}
          >
            Editar
          </Button>

          <Button
            size="sm"
            variant="destructive"
            className="cursor-pointer h-8 text-[11px] px-2"
            onClick={() => onDelete?.(product.id)}
          >
            Excluir
          </Button>
        </CardFooter>
       ) : (
        <CardFooter className="px-3 pb-3 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer h-8 text-[12px] w-full"
            onClick={() => addToCart?.(product.id)}
          >
            Adicionar ao carrinho
          </Button>
        </CardFooter>

       )
      }

    </Card>
  )
}
