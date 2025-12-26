"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { api } from "../services/api"

const HomePage = () => {
  const { refresh, accessToken, setAccessToken } = useAuth()
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

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post('/auth/logout');
    } catch {
      // backend pode falhar, mas o logout do client é soberano
    } finally {
      setAccessToken(null);
      router.replace('/login');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1>HomePage</h1>

      <Button onClick={() => router.push("/register")}>
        Criar Conta
      </Button>

      <Button onClick={handleLoginClick} disabled={loading}>
        {loading ? "Verificando sessão..." : "Entrar"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button variant="outline" >Actions</Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => console.log("Perfil")}>
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      
    </div>
  )
}

export default HomePage
