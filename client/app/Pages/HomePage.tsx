"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

const HomePage = () => {
  const { refresh, accessToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLoginClick = async () => {
    if (loading) return // evita double click

    setLoading(true);

    try {
      if (accessToken) {
        router.push("/");
        return
      }

      const refreshed = await refresh()

      if (refreshed) {
        router.push("/");
      } else {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1>HomePage</h1>

      <Button onClick={() => router.push("/register")}>Criar Conta</Button>

      <Button onClick={handleLoginClick} disabled={loading}>
        {loading ? "Verificando sessão..." : "Entrar"}
      </Button>
    </div>
  )
}

export default HomePage
