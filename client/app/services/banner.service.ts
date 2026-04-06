import { api } from "./api"
import type { Banner } from "@/app/types/banner"

export const bannerService = {
  async getAll() {
    const { data } = await api.get("/banners/admin")
    return data
  },

  async create(file: File, title?: string, link?: string) {
    const formData = new FormData()
    formData.append("file", file)
    if (title) formData.append("title", title)
    if (link) formData.append("link", link)

    await api.post("/banners", formData)
  },

  async update(id: number, banner: Partial<Banner>) {
    const formData = new FormData()

    if (banner.title !== undefined)
      formData.append("title", banner.title)

    if (banner.link !== undefined)
      formData.append("link", banner.link)

    await api.patch(`/banners/${id}`, formData)
  },

  async toggle(id: number) {
    await api.patch(`/banners/${id}/toggle`)
  },

  async remove(id: number) {
    await api.delete(`/banners/${id}`)
  }
}