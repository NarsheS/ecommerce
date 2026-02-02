import { registerUser } from "@/app/services/auth.service"
import { useState } from "react"

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(username: string, email: string, password: string) {
    setError(null)
    setLoading(true)

    const result = await registerUser({ username, email, password })

    setLoading(false)

    if (!result.ok) {
      if (result.status === 400 || result.status === 409) {
        setError(result.message)
      } else {
        setError("Ocorreu um erro ao tentar criar sua conta")
      }
    }

    return result
  }

  return { submit, loading, error, setError }
}
