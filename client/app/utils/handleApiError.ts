import { toast } from "sonner"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type HandleApiErrorOptions = {
  redirectOn401?: boolean
}

let isRedirecting = false

const handleApiError = (
  error: any,
  router: AppRouterInstance,
  fallbackMessage: string,
  options?: HandleApiErrorOptions
) => {
  const redirectOn401 = options?.redirectOn401 ?? false

  if (error?.response) {
    const status = error.response.status
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      fallbackMessage

    // NÃO AUTORIZADO
    if (status === 401) {
      toast.error("Sessão expirada. Faça login novamente.")

      if (redirectOn401 && !isRedirecting) {
        isRedirecting = true
        router.push("/login")
      }

      return
    }

    // PROIBIDO
    if (status === 403) {
      toast.error("Você não tem permissão para isso.")
      return
    }

    // ERROS DE VALIDAÇÃO (400)
    if (status === 400) {
      if (Array.isArray(error.response.data?.message)) {
        error.response.data.message.forEach((msg: string) =>
          toast.error(msg)
        )
      } else {
        toast.error(message)
      }
      return
    }

    // OUTROS ERROS HTTP
    toast.error(message)
    return
  }

  // ERRO DE REDE
  toast.error("Erro de rede. Tente novamente mais tarde.")
}

export default handleApiError