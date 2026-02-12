"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import type { Profile } from "../types/profile"
import { profileService } from "../services/profile.service"
import LoadingCircle from "@/components/loading-circle"

export default function ProfilePage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await profileService.getMe()
        setUser(data)
      } catch (error: any) {
        // Se for 401, redireciona
        if (error?.response?.status === 401) {
          router.replace("/")
          return
        }

        console.error("Erro ao buscar usuário", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <LoadingCircle />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl">
              {user.username}
            </CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Qualificação</span>
            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
              {user.role}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Verificado</span>
            <Badge variant={user.isVerified ? "default" : "destructive"}>
              {user.isVerified ? "Sim" : "Não"}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Criado em</span>
            <span className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Última atualização</span>
            <span className="font-medium">
              {new Date(user.updatedAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
