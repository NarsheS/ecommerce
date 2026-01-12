"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { refreshAccessToken } from "../services/authRefresh"
import { api, setAuthToken } from "../services/api"

type User = {
  id: number,
  role: string
}

type AuthContextType = {
  accessToken: string | null
  user: User | null
  setAccessToken: (token: string | null) => void
  refresh: () => Promise<boolean>
}


const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const refresh = async () => {
    try {
      // obtain a new access token using the refresh cookie
      const token = await refreshAccessToken()
      // accept the token as success even if /auth/me fails
      setAccessToken(token)
      setAuthToken(token)

      // try to fetch user info, but DON'T treat failure here as overall failure
      try {
        const me = await api.get("/auth/me")
        setUser(me.data)
      } catch (meErr) {
        console.warn("failed to fetch /auth/me after refresh — continuing with token", meErr)
        // don't clear token/user — we still consider user authenticated by token
      }

      return true
    } catch(err) {
      // refresh token failed -> clear client state
      setAccessToken(null)
      setUser(null)
      setAuthToken(null)
      console.error("ACCESS_TOKEN ERROR:", err);
      return false;
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
