import { toast } from 'sonner'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type HandleApiErrorOptions = {
  redirectOn401?: boolean
}

const handleApiError = (
  error: any,
  router: AppRouterInstance,
  fallbackMessage: string,
  options?: HandleApiErrorOptions
) => {
  if (error?.response) {
    const status = error.response.status

    if (status === 401) {
      toast.error("Sessão expirada")
      return
    }

    // outros erros HTTP
    toast.error(fallbackMessage)
    return
  }

  // erro de rede / axios / desconhecido
  toast.error('Erro de rede. Tente novamente mais tarde.')
}

export default handleApiError
