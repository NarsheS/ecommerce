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

  useEffect(() => {
    if (accessToken) getCart()
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
      cartCount={cart?.items?.reduce((t, i) => t + i.quantity, 0) ?? 0}
      onCartClick={() => router.push("/cart")}

      searchPlaceholder="Buscar..."
      searchValue={search}
      onSearchChange={(value) => {
        if (!value) return router.push("/")
        router.push(`/?search=${value}`)
      }}

      navigationLinks={[
        { label: "Ofertas", action: "sale" },
        { label: "Contato", href: "/contact" },
        { label: "Sobre", href: "/about" },
      ]}

      onSaleClick={() => {
        router.push("/?sale=true")
      }}

      rightSlot={
        accessToken ? (
          <UserMenu role={user?.role} onLogout={handleLogout} />
        ) : (
          <Button onClick={handleLoginClick}>Entrar</Button>
        )
      }
    />
  )
}