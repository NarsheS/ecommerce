"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { refreshAccessToken } from "../services/auth.refresh"
import { api, setAuthToken } from "../services/api"
import type { AuthContextType, User } from "../types/auth-context"



const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      // pega novo access token usando refresh token via cookie
      const token = await refreshAccessToken()

      setAccessToken(token)
      setAuthToken(token) // injeta no axios

      // busca dados do usuário, mas não quebra se falhar
      try {
        const me = await api.get("/auth/me")
        setUser(me.data)
      } catch (err) {
        console.warn("Falha ao buscar /auth/me — mantendo token", err)
      }

      return true
    } catch (err) {
      setAccessToken(null)
      setUser(null)
      setAuthToken(null)
      console.error("Falha no refresh do token", err)
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
    <AuthContext.Provider value={{ accessToken, user, setAccessToken, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}
