import { api } from '@/app/services/api'
import type { Product } from '@/app/types/product'

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get('/products')
    return data
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  async create(payload: any) {
    await api.post('/products', payload)
  },

  async update(id: number, payload: any) {
    await api.put(`/products/${id}`, payload)
  },

  async remove(id: number) {
    await api.delete(`/products/${id}`)
  },

  async addImages(productId: number, files: File[]) {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    await api.post(`/products/${productId}/images`, formData)
  },

  async removeImage(productId: number, imageId: number) {
    await api.delete(`/products/${productId}/images/${imageId}`)
  },

  async removeAllImages(productId: number) {
    await api.delete(`/products/${productId}/images`)
  },
}
