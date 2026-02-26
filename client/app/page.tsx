"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import UserMenu from "@/components/UserMenu"
import { api, setAuthToken } from "./services/api"
import { Navbar } from "@/components/ui/shadcn-io/navbar"
import { useEffect, useState, useMemo } from "react"
import handleApiError from "./utils/handleApiError"
import type { Product } from "./types/product"
import LoadingCircle from "@/components/loading-circle"
import { ProductCard } from "@/components/product-card"
import { toast } from "sonner"
import { Cart } from "./types/cart"

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Cart | null>(null)
  const [search, setSearch] = useState("")
  const [fetching, setFetching] = useState(false)
  const { accessToken, refresh, setAccessToken, user } = useAuth()
  const router = useRouter()

  const [sale, setSale] = useState(false)

  const handleSaleClick = () => {
    setSale(prev => !prev)
  }

  const isAuthenticated = !!accessToken

  const handleLoginClick = async () => {
    const ok = await refresh()
    if (!ok) router.push("/login")
  }

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {}
    finally {
      setAccessToken(null)
      setAuthToken(null)
      router.replace("/login")
    }
  }

  const getProducts = async (searchTerm?: string) => {
    try {
      setFetching(true)

      const { data } = await api.get("/products", {
        params: searchTerm ? { search: searchTerm } : {}
      })

      setProducts(data)
    } catch (error) {
      handleApiError(error, router, "Falha ao obter informações sobre os produtos")
    } finally {
      setFetching(false)
    }
  }

  const addToCart = async (productId: number) => {
    try {
      await api.post("/cart", {
        productId,
        quantity: 1
      })
      toast.info("Produto adicionado ao carrinho!")
    } catch (error) {
      handleApiError(error, router, "Erro ao adicionar o produto ao carrinho.")
    } finally {
      getCart()
    }
  }

  const getCart = async () => {
    try {
      if (!accessToken) return
      const response = await api.get("/cart")
      setCart(response.data)
    } catch (error) {
      handleApiError(error, router, "Falha ao obter informações sobre o carrinho")
    }
  }

  // 🔥 Filtro Sale
  const filteredProducts = useMemo(() => {
    if (!sale) return products
    return products.filter(p => p.pricing?.hasDiscount === true)
  }, [products, sale])

  // 1 - Carregamento inicial
  useEffect(() => {
    getProducts()
  }, [])

  // 2 - Busca com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      getProducts(search)
    }, 400)

    return () => clearTimeout(timeout)
  }, [search])

  // 3 - Carrinho quando loga
  useEffect(() => {
    if (accessToken) {
      getCart()
    }
  }, [accessToken])

  return (
    <div className="flex flex-col gap-4">
      <Navbar
        cartText="Carrinho"
        onCartClick={() => router.push("/cart")}
        cartCount={cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0}
        searchPlaceholder="Buscar..."
        searchValue={search}
        onSearchChange={setSearch}
        navigationLinks={[
          { label: "Products" },
          { label: "Categories" },
          { label: "Ofertas" }
        ]}
        onSaleClick={handleSaleClick}
        rightSlot={
          isAuthenticated ? (
            <UserMenu
              role={user?.role}
              onLogout={handleLogout}
            />
          ) : (
            <Button onClick={handleLoginClick} className="cursor-pointer">
              Entrar
            </Button>
          )
        }
      />

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
          <div className="flex flex-row gap-5 p-2">
            {filteredProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                addToCart={() => addToCart(prod.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home