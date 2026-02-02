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
import { useRouter } from "next/navigation"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { useLogin } from "@/hooks/useLogin"

export default function Login() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { submit, loading, error, setError } = useLogin()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = await submit(identifier, password)

    if (result.ok) {
      router.replace("/")
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-200"
    >
      {error && (
        <div className="grid w-full max-w-sm items-start gap-4">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        </div>
      )}

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>
            Acesse sua conta usando seu email ou nome de usuário
          </CardDescription>

          <CardAction className="mt-4">
            <Button
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
                    setError(null)
                  }}
                  placeholder="************"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
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
