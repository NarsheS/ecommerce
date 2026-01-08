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
import { FormEvent, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { api } from "../services/api"
import axios from "axios"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export default function Login() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const { refresh } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      // 1️⃣ login → seta cookie httpOnly
      await api.post("/auth/login", {
        identifier,
        password,
      })

      // 2️⃣ sincroniza estado React com cookie
      await refresh()

      // 3️⃣ UI agora sabe que está logado
      router.replace("/")
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = "Senha e/ou usuário inválidos.";

        if (status === 400) {
          setFormError(message)
          return
        }

        if (status === 401){
          // modal ou toast informando que precisa ativar a conta
          setFormError("Conta não ativada. Verifique seu email.");
          return
        }
    }

    setFormError("Ocorreu um erro ao tentar fazer login.");
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-200"
    >

      { formError && (
                  <div className="grid w-full max-w-sm items-start gap-4">
                    <Alert variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle>{formError}</AlertTitle>
                    </Alert>
                  </div>
                  ) }

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Acesse sua conta usando seu email ou nome de usuário
          </CardDescription>

          <CardAction className="mt-4">
            <Button
              className="cursor-pointer"
              onClick={() => router.push("/register")}
              type="button"
              variant="outline"
            >
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
              
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFormError(null)
                  }}
                  placeholder='************'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    // eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                ) : (
                    // eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A3 3 0 0113.42 13.42M9.88 5.75A9.97 9.97 0 003 12c2.5 3.5 5.5 6 9 6a9.97 9.97 0 006.25-2.88M15 12a3 3 0 00-3-3" />
                    </svg>
                )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </Button>
        </CardFooter>
      </Card>
      
    </form>
  )
}
