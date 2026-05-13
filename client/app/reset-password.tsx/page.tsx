"use client"

import { FormEvent, useMemo, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

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

import { resetPassword } from "@/app/services/auth.service"

export default function ResetPasswordPage() {
  const router = useRouter()

  const searchParams = useSearchParams()

  const token = useMemo(
    () => searchParams.get("token") || "",
    [searchParams],
  )

  const [password, setPassword] =
    useState("")

  const [showPassword, setShowPassword] =
    useState(false)

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

    const result = await resetPassword(
      token,
      password,
    )

    if (!result.ok) {
      setError(result.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.replace("/login")
    }, 2500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            Redefinir senha
          </CardTitle>

          <CardDescription>
            Digite sua nova senha.
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
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />

              <AlertTitle>
                Senha redefinida com sucesso.
                Redirecionando...
              </AlertTitle>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label>Nova senha</Label>

              <div className="relative">
                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value,
                    )
                  }
                  placeholder="************"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (s) => !s,
                    )
                  }
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading || !token
              }
            >
              {loading
                ? "Salvando..."
                : "Redefinir senha"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            className="w-full"
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