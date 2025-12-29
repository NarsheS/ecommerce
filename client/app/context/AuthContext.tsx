"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { refreshAccessToken } from "../services/authRefresh"

type AuthContextType = {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  refresh: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const token = await refreshAccessToken()
      setAccessToken(token)
      return true
    } catch(err) {
      setAccessToken(null)
      console.error("ACCESS_TOKEN ERROR:", err)
      return false
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando sessão...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}
