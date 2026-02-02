import { api } from '@/app/services/api'
import type { Category } from '@/app/types/category'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get('/categories')
    return data
  },

  async create(name: string) {
    await api.post('/categories', { name })
  },

  async remove(id: number) {
    await api.delete(`/categories/${id}`)
  },
}
