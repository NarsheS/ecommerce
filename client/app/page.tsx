"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import UserMenu from "@/components/UserMenu"
import { api, setAuthToken } from "./services/api"
import { Navbar } from "@/components/ui/shadcn-io/navbar"
import { useEffect, useState } from "react"
import handleApiError from "./utils/handleApiError"
import type { Product } from "./types/product"
import LoadingCircle from "@/components/loading-circle"
import { ProductCard } from "@/components/product-card"



const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false)
  const { accessToken, refresh, setAccessToken, user } = useAuth();
  const router = useRouter();

  const isAuthenticated = !!accessToken

  const handleLoginClick = async () => {
    const ok = await refresh()
    if (!ok) router.push("/login");
  }

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    finally {
      setAccessToken(null);
      setAuthToken(null);
      router.replace("/login");
    }
  }

  /*
    - GET - api/products                                (Lista todos os produtos)
    - GET - api/products/:id                            (Lista um produto)
  */
  const getProducts = async () => {
    try {
      setFetching(true)
      const response = await api.get("/products")
      setProducts(response.data)
    } catch (error) {
      handleApiError(error, router, "Falha ao obter informações sobre os produtos")
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      await getProducts()
    }

    fetchProducts()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <Navbar
        cartText="Carrinho"
        searchPlaceholder="Buscar..."
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


      {/* mapping here */}
      <section className="m-4">
        {fetching ? (
          <LoadingCircle />
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum produto disponível no momento
          </p>
        ) : (
          <div className="grid gap-4">
            {products.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                // addToCart={}
              />
            ))}
          </div>
        )}
      </section>

      
    </div>
  )
}

export default Home