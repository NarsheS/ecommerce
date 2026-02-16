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
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import DialogAction, { DialogField } from "@/components/dialog-action"
import handleApiError from "../utils/handleApiError"
import ConfirmDialog from "@/components/confirm-dialog"


export default function ProfilePage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)


  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  })

  const formSetup: DialogField[] = [
    { id: 1, name: "username", label: "Username", type: "text" },
    { id: 2, name: "email", label: "Email", type: "text" },
    { id: 3, name: "password", label: "Nova senha", inputType: "password" },
  ]

  const router = useRouter()

  const handleChange = (name: string, value: any) =>
  setFormValues(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async () => {
    if (!user) return

    setSaving(true)

    try {
      const payload: any = {
        username: formValues.username,
        email: formValues.email,
      }

      if (formValues.password) {
        payload.password = formValues.password
      }

      const updatedUser = await profileService.update(payload)

      setUser(updatedUser)
      setDialogOpen(false)
      setFormValues({
        username: updatedUser.username,
        email: updatedUser.email,
        password: "",
      })
    } catch (error) {
      handleApiError(error, router, "Erro ao atualizar perfil")
      throw error
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)

    try {
      await profileService.remove()

      // Redireciona para home depois de deletar
      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Erro ao deletar conta", error)
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }



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
    <>
      {/* Botão fixo */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 rounded-full shadow-lg backdrop-blur cursor-pointer border-gray-400 border-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

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


            <Button
              variant="outline"
              size="icon"
              className="ml-auto cursor-pointer rounded-full"
              onClick={() => {
                setFormValues({
                  username: user.username,
                  email: user.email,
                  password: "",
                })
                setDialogOpen(true)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="cursor-pointer rounded-full"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>



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


      <DialogAction
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Perfil"
        description="Atualize suas informações"
        content={formSetup}
        handleSubmit={handleSubmit}
        loading={saving}
        values={formValues}
        onChange={handleChange}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir conta"
        description="Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        loading={deleteLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />


    </>
  )

}
