"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { api } from "./services/api"
import handleApiError from "./utils/handleApiError"

import type { Product } from "./types/product"

import LoadingCircle from "@/components/loading-circle"
import { ProductCard } from "@/components/product-card"
import { toast } from "sonner"

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // 🔥 estados vindos da URL
  const search = searchParams.get("search") ?? ""
  const sale = searchParams.get("sale") === "true"

  const getProducts = async (searchTerm?: string) => {
    try {
      setFetching(true)

      const { data } = await api.get("/products", {
        params: searchTerm ? { search: searchTerm } : {}
      })

      setProducts(data)
    } catch (error) {
      handleApiError(
        error,
        router,
        "Falha ao obter informações sobre os produtos"
      )
    } finally {
      setFetching(false)
    }
  }

  const addToCart = async (productId: number, quantity: number) => {
    try {
      await api.post("/cart", {
        productId,
        quantity,
      })

      // 🔥 avisa navbar
      window.dispatchEvent(new Event("cartUpdated"))

      toast.info("Produto adicionado ao carrinho!")
    } catch (error) {
      handleApiError(
        error,
        router,
        "Erro ao adicionar o produto ao carrinho."
      )
    }
  }

  // 🔥 filtro sale
  const filteredProducts = useMemo(() => {
    if (!sale) return products
    return products.filter(p => p.pricing?.hasDiscount === true)
  }, [products, sale])

  // 🔥 carregamento inicial + busca por URL
  useEffect(() => {
    const timeout = setTimeout(() => {
      getProducts(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  return (
    <div className="flex flex-col gap-4">

      <section className="m-4">

        {fetching ? (
          <LoadingCircle />
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {sale
              ? "Nenhum produto em promoção no momento"
              : "Nenhum produto disponível no momento"}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-2">
            {filteredProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
              />
            ))}
          </div>
        )}

      </section>
    </div>
  )
}

export default Home