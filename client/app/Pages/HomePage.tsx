"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "../services/api"

const HomePage = () => {
  const { accessToken, refresh, setAccessToken } = useAuth()
  const router = useRouter()

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
      router.replace("/login")
    }
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1>HomePage</h1>

      {!isAuthenticated && (
        <Button onClick={handleLoginClick}>
          Entrar
        </Button>
      )}

      {isAuthenticated && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default HomePage
