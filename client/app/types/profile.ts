export type Profile = {
    id: number
    username: string
    email: string
    role: "user" | "admin"
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
}