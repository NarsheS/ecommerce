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
    }
}