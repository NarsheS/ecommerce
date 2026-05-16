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
import LoadingCircle from "@/components/loading-circle"
import ProductReviews from "@/components/product-reviews"

import { useCart } from "@/app/context/CartContext"

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const { cart, refreshCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState("1")

  const productId = Array.isArray(id) ? id[0] : id

  const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const addItem = async (productId: number, quantity: number) => {
    try {
      await api.post("/cart", {
        productId,
        quantity,
      })

      await refreshCart()

      const { data } = await api.get(`/products/${productId}`)
      setProduct(data)

    } catch (error: any) {
      handleApiError(
        error,
        router,
        error.response?.data?.message || "Erro ao adicionar ao carrinho"
      )
    }
  }

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

  const images = product?.images ?? []

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingCircle />
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

  const cartItem = cart?.items?.find(
    item => item.product.id === product.id
  )

  const quantityInCart = cartItem?.quantity || 0

  const availableStock = Math.max(
    product.inStock - quantityInCart,
    0
  )

  useEffect(() => {
    const value = Number(quantity)

    if (value > availableStock) {
      setQuantity(String(availableStock))
    }
  }, [availableStock, quantity])

  return (
    <div className="max-w-7xl mx-auto p-6 rounded-md bg-white my-10">

      <div className="grid md:grid-cols-2 gap-34 my-2">

        <div className="w-full bg-black py-4 rounded-xl">
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

        <div className="flex flex-col gap-5 mt-5 max-w-md">

          <div className="ml-5 gap-2 flex flex-col">
            <h1 className="text-2xl font-bold">
              {product.name}
            </h1>

            {product.category?.name && (
              <p className="inline-flex items-center text-white bg-cyan-400 rounded-full px-2 py-0.5 text-xs w-fit self-start">
                {product.category?.name}
              </p>
            )}

            <p className="text-muted-foreground">
              {product.description}
            </p>

            <div className="flex flex-col ">
              {product.pricing?.hasDiscount ? (
                <>
                  <span className="line-through text-sm text-gray-500">
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

            <span
              className={`inline-flex items-center text-white ${
                availableStock > 0 ? "bg-emerald-400" : "bg-red-600"
              } rounded-full px-2 py-0.5 text-xs w-fit self-start mt-2.5`}
            >
              {availableStock > 0
                ? `Disponíveis: ${availableStock}`
                : "Sem estoque disponível"}
            </span>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center border rounded-md overflow-hidden">

              <button
                onClick={() =>
                  setQuantity(q => String(Math.max(1, Number(q) - 1)))
                }
                className="px-3 py-1 hover:bg-muted cursor-pointer"
              >
                -
              </button>

              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value

                  if (!/^\d*$/.test(value)) return

                  setQuantity(value)
                }}
                onBlur={() => {
                  let value = Number(quantity)

                  if (!value || value < 1) value = 1
                  if (value > availableStock) value = availableStock

                  setQuantity(String(value))
                }}
                onFocus={(e) => e.target.select()}
                className="w-12 text-center text-sm outline-none"
              />

              <button
                onClick={() =>
                  setQuantity(q =>
                    String(Math.min(availableStock, Number(q) + 1))
                  )
                }
                className="px-3 py-1 hover:bg-muted cursor-pointer"
              >
                +
              </button>

            </div>

            <button
              onClick={() => addItem(product.id, Number(quantity) || 1)}
              disabled={availableStock <= 0}
              className="flex-1 bg-primary max-w-sm cursor-pointer text-white rounded-md py-2 font-medium hover:opacity-90 disabled:opacity-50"
            >
              {availableStock <= 0
                ? "Quantidade máxima no carrinho"
                : "Adicionar ao carrinho"}
            </button>

          </div>

        </div>

      </div>

      <ProductReviews
        productId={product.id}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
      />

    </div>
  )
}