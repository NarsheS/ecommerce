import { useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import { loginUser } from "@/app/services/authService"

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refresh } = useAuth()

  async function submit(identifier: string, password: string) {
    setError(null)
    setLoading(true)

    const result = await loginUser({ identifier, password })

    if (result.ok) {
      // sincroniza estado React com cookie httpOnly
      await refresh()
    } else {
      if (result.status === 400) {
        setError("Senha e/ou usuário inválidos.")
      } else if (result.status === 401) {
        setError("Conta não ativada. Verifique seu email.")
      } else {
        setError("Ocorreu um erro ao tentar fazer login.")
      }
    }

    setLoading(false)
    return result
  }

  return { submit, loading, error, setError }
}
