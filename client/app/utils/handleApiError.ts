import { toast } from 'sonner'
import { setAuthToken } from '@/app/services/api'
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
      // limpa autenticação
      setAuthToken(null)
      localStorage.removeItem('token')

      // 🔥 toast SEMPRE aparece
      toast.error('Você precisa estar logado para realizar essa ação.')

      // redirect opcional
      if (options?.redirectOn401) {
        router.push('/login')
      }

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
