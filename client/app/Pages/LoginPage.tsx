"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { api } from "../services/api"

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { accessToken, setAccessToken } = useAuth()
  const router = useRouter()

  // 👇 AQUI
  useEffect(() => {
    if (accessToken) {
      router.replace("/")
    }
  }, [accessToken, router])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await api.post("/auth/login", {
        identifier,
        password,
      })

      const { accessToken } = response.data
      setAccessToken(accessToken)

      router.replace("/")
    } catch (err) {
      console.error("Erro no login:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="min-h-screen flex items-center justify-center bg-gray-200"
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Acesse sua conta usando seu email ou nome de usuário
          </CardDescription>
          <CardAction className="mt-4">
            <Button type="button" variant="outline">
              Criar conta
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label>Email ou usuário</Label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default LoginPage
