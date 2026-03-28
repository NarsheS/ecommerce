"use client"

import { Navbar } from "@/components/ui/shadcn-io/navbar"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import UserMenu from "@/components/UserMenu"
import { useEffect, useState } from "react"
import { api } from "@/app/services/api"
import { Cart } from "@/app/types/cart"

export default function AppNavbar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { accessToken, user, refresh, setAccessToken } = useAuth()

  const [cart, setCart] = useState<Cart | null>(null)

  const isAuthenticated = !!accessToken

  const search = searchParams.get("search") ?? ""

  const getCart = async () => {
    if (!accessToken) return

    try {
      const res = await api.get("/cart")
      setCart(res.data)
    } catch (e) {
      console.error("Erro ao atualizar carrinho", e)
    }
  }

  // 🔥 atualiza ao logar
  useEffect(() => {
    if (accessToken) {
      getCart()
    }
  }, [accessToken])

  // 🔥 escuta atualização do carrinho
  useEffect(() => {
    const handleCartUpdate = () => {
      getCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [accessToken])

  const handleLoginClick = async () => {
    const ok = await refresh()
    if (!ok) router.push("/login")
  }

  const handleLogout = async () => {
    await api.post("/auth/logout").catch(() => {})
    setAccessToken(null)
    router.replace("/login")
  }

  return (
    <Navbar
      cartText="Carrinho"
      onCartClick={() => router.push("/cart")}
      cartCount={cart?.items?.reduce((t, i) => t + i.quantity, 0) ?? 0}

      searchPlaceholder="Buscar..."
      searchValue={search}
      onSearchChange={(value) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
          params.set("search", value)
        } else {
          params.delete("search")
        }

        router.push(`/?${params.toString()}`)
      }}

      navigationLinks={[
        { label: "Ofertas" },
        { label: "Contato", href: "/contact" },
        { label: "Sobre", href: "/about" },
      ]}

      // 🔥 BOTÃO OFERTAS FUNCIONANDO
      onSaleClick={() => {
        const params = new URLSearchParams(searchParams.toString())

        if (params.get("sale") === "true") {
          params.delete("sale")
        } else {
          params.set("sale", "true")
        }

        router.push(`/?${params.toString()}`)
      }}

      rightSlot={
        isAuthenticated ? (
          <UserMenu role={user?.role} onLogout={handleLogout} />
        ) : (
          <Button onClick={handleLoginClick}>Entrar</Button>
        )
      }
    />
  )
}