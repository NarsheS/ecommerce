"use client"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import React, { FormEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import { toast } from 'sonner';
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import { useRegister } from '@/hooks/useRegister'

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { submit, loading, error, setError } = useRegister()

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = await submit(username, email, password)

    if (result.ok) {
      toast.success("Verifique seu email para ativar a conta", {
        duration: Infinity,
        action: {
          label: "Entrar",
          onClick: () => {
            toast.dismiss()
            router.replace("/login")
          },
        },
      })
    } else {
      toast.error(result.message, {
        duration: Infinity,
        action: {
          label: "Entendi",
          onClick: () => toast.dismiss(),
        },
      })
    }
  }

  return (
    <form
      onSubmit={handleRegister}
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
          <CardTitle>Crie sua conta</CardTitle>
          <CardDescription>
            Crie sua conta ao registrar seu nome de usuário, email e senha
          </CardDescription>
          <CardAction className="mt-4">
            <Button 
              onClick={() => router.push("/login")}
              type="button" 
              variant="outline"
            >
              Entrar
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label>Nome de Usuário</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Dummy'
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='exemplo@seuEmail.com'
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
                  placeholder='************'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : "Criar Conta"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
