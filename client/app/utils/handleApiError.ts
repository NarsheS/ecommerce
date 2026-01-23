import { toast } from 'sonner'
import { setAuthToken } from '@/app/services/api'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const handleApiError = (
  error: any,
  router: AppRouterInstance,
  fallbackMessage: string
) => {
  if (error?.response) {
    if (error.response.status === 401) {
      setAuthToken(null)
      localStorage.removeItem('token')
      toast.error('Sessão expirada. Faça login novamente.')
      router.push('/login')
    } else {
      toast.error(fallbackMessage)
    }
  } else {
    toast.error('Erro de rede')
  }
}

export default handleApiError
