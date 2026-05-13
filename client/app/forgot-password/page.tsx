"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"

import {
  AlertCircleIcon,
  CheckCircle2,
} from "lucide-react"

import { forgotPassword } from "@/app/services/auth.service"

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [identifier, setIdentifier] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] = useState<
    string | null
  >(null)

  const [success, setSuccess] =
    useState(false)

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const result = await forgotPassword(
      identifier,
    )

    if (!result.ok) {
      setError(result.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            Recuperar senha
          </CardTitle>

          <CardDescription>
            Digite seu email ou nome de usuário
            para receber um link de redefinição
            de senha.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert
              variant="destructive"
              className="mb-4"
            >
              <AlertCircleIcon />
              <AlertTitle>
                {error}
              </AlertTitle>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-500 text-white">
              <CheckCircle2 className="h-4 w-4" />

              <AlertTitle>
                Email enviado!
              </AlertTitle>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label>
                Email ou usuário
              </Label>

              <Input
                value={identifier}
                onChange={(e) =>
                  setIdentifier(
                    e.target.value,
                  )
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading
                ? "Enviando..."
                : "Enviar link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            className="w-full cursor-pointer"
            onClick={() =>
              router.push("/login")
            }
          >
            Voltar para login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}