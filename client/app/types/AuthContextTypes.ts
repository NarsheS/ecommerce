export type User = {
  id: number,
  role: string
}

export type AuthContextType = {
  accessToken: string | null
  user: User | null
  setAccessToken: (token: string | null) => void
  refresh: () => Promise<boolean>
}