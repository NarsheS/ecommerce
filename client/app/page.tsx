"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { api } from "./services/api"
import handleApiError from "./utils/handleApiError"

import type { Product } from "./types/product"

import LoadingCircle from "@/components/loading-circle"
import { ProductCard } from "@/components/product-card"
import { HighlightCarousel } from "@/components/highlight-carousel"
import WhyBuy from "@/components/why-buy"

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [fetching, setFetching] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  // estados vindos da URL
  const search = searchParams.get("search") ?? ""
  const sale = searchParams.get("sale") === "true"

  const getProducts = async (searchTerm?: string) => {
    try {
      setFetching(true)

      const { data } = await api.get("/products", {
        params: searchTerm ? { search: searchTerm } : {}
      })

      setProducts(data)
      console.log(data)
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

  // filtro sale
  const filteredProducts = useMemo(() => {
    if (!sale) return products
    return products.filter(p => p.pricing?.hasDiscount === true)
  }, [products, sale])

  const productsByCategory = useMemo(() => {
  const grouped: Record<string, Product[]> = {}

  for (const product of filteredProducts) {
    const categoryName = product.category?.name || "Outros"

    if (!grouped[categoryName]) {
      grouped[categoryName] = []
    }

    grouped[categoryName].push(product)
  }

  return grouped
}, [filteredProducts])

  // carregamento inicial + busca por URL
  useEffect(() => {
    const timeout = setTimeout(() => {
      getProducts(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  return (
    <div className="flex flex-col gap-4">

      {/* CAROUSEL */}
      <div className="m-4">
        <HighlightCarousel />
      </div>

      <section className="m-4 space-y-10">

        {fetching ? (
          <LoadingCircle />
        ) : Object.keys(productsByCategory).length === 0 ? (
          <p className="text-center text-muted-foreground">
            {sale
              ? "Nenhum produto em promoção no momento"
              : "Nenhum produto disponível no momento"}
          </p>
        ) : (
          Object.entries(productsByCategory).map(([category, products]) => (
            
            <div key={category} className="space-y-4">

              {/* TÍTULO DA CATEGORIA */}
              <h2 className="text-2xl font-bold px-2">
                {category}
              </h2>

              {/* GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-2">
                {products.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                  />
                ))}
              </div>

            </div>
          ))
        )}

      </section>

      <WhyBuy />
    </div>
  )
}

export default Home