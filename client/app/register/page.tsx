"use client"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import React, { FormEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import { api } from '../services/api'
import { toast } from 'sonner';
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'
import axios from 'axios'

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      setLoading(true);

      const response = await api.post("/auth/register", {
        username,
        email,
        password
      });


      if (response.status == 201) {
        toast.success("Verifique seu email para ativar a conta", {
          duration: Infinity,
          action: {
            label: "Entrar",
            onClick: () => {
              toast.dismiss()
              router.replace("/login")
            },
          },
        });

      } else {
        toast.error("Ocorreu um erro ao tentar criar sua conta", {
          duration: Infinity,
          action: {
            label: "Entendi",
            onClick: () => {
              toast.dismiss()
            },
          },
        });
      }
      

    } catch(error: any) {
        if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message =
          error.response?.data?.message ||
          "Credenciais inválidas. Tente novamente."

        if (status === 400) {
          setFormError(message)
          return
        }

        if (status === 409) {
          setFormError(message)
          return
        }
      }

      setFormError("Ocorreu um erro ao tentar criar sua conta");

    }finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
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
                    setFormError(null)
                  }}
                  placeholder='************'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : "Criar Conta"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}