"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { api, setAuthToken } from "../services/api"
import { Navbar04 } from "@/components/ui/shadcn-io/navbar-04"
import UserMenu from "@/components/UserMenu"

const HomePage = () => {
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

  return (
    <div className="flex flex-col gap-4">
      <Navbar04
        cartText="Carrinho"
        searchPlaceholder="Buscar..."
        rightSlot={
          isAuthenticated ? (
            <UserMenu
              role={user?.role}
              onLogout={handleLogout}
            />
          ) : (
            <Button onClick={handleLoginClick}>
              Entrar
            </Button>
          )
        }
      />

      
    </div>
  )
}

export default HomePage
