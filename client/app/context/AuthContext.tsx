"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { refreshAccessToken } from "../services/authRefresh"

type AuthContextType = {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  refresh: () => Promise<boolean>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const refresh = async () => {
    try {
      const token = await refreshAccessToken()
      setAccessToken(token)
      setIsAuthenticated(true)
      return true
    } catch {
      setAccessToken(null)
      setIsAuthenticated(false)
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
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, refresh, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}
