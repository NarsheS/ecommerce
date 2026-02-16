import { Profile } from "../types/profile"
import { api } from "./api"

export const profileService = {
  async getMe(): Promise<Profile> {
    const { data } = await api.get("users/me")

    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  },

  async update(data: Partial<Profile>): Promise<Profile> {
    const { data: response } = await api.patch("users/update", data)

    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    }
  },
}
