"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react"

import type { Profile } from "../types/profile"
import { profileService } from "../services/profile.service"
import LoadingCircle from "@/components/loading-circle"
import DialogAction, { DialogField } from "@/components/dialog-action"
import ConfirmDialog from "@/components/confirm-dialog"
import handleApiError from "../utils/handleApiError"
import { useAddress } from "@/hooks/useAddress"

export default function ProfilePage() {
  const router = useRouter()

  /* ---------------- PROFILE ---------------- */

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

  /* ---------------- ADDRESS HOOK ---------------- */

  const address = useAddress()

  /* ---------------- PROFILE LOGIC ---------------- */

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
      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Erro ao deletar conta", error)
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await profileService.getMe()
        setUser(data)
      } catch (error: any) {
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

  /* ---------------- LOADING ---------------- */

  if (loading || address.loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <LoadingCircle />
      </div>
    )
  }

  if (!user) return null

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* Botão voltar */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 rounded-full shadow-lg backdrop-blur cursor-pointer border-gray-400 border-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="container mx-auto py-10">
        {/* ---------------- PROFILE CARD ---------------- */}
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
              className="ml-auto rounded-full"
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
              className="rounded-full"
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

        {/* ---------------- ADDRESS CARD ---------------- */}
        <Card className="max-w-2xl mx-auto mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Endereços</CardTitle>

            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              onClick={address.openCreate}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4 pt-6">
            {address.addresses.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhum endereço cadastrado.
              </p>
            )}

            {address.addresses.map(addressItem => (
              <div
                key={addressItem.id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {addressItem.street}, {addressItem.number}
                  </p>
                  <p>
                    {addressItem.city} - {addressItem.state}
                  </p>
                  <p>{addressItem.zipcode}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => address.openEdit(addressItem)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => {
                      address.setSelected(addressItem)
                      address.setDeleteOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ---------------- PROFILE DIALOGS ---------------- */}
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
        description="Tem certeza que deseja excluir sua conta?"
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        loading={deleteLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* ---------------- ADDRESS DIALOGS ---------------- */}
      <DialogAction
        open={address.dialogOpen}
        onOpenChange={address.setDialogOpen}
        title={address.selected ? "Editar endereço" : "Novo endereço"}
        content={[
          { id: 1, name: "street", label: "Rua", type: "text" },
          { id: 2, name: "number", label: "Número", type: "text" },
          { id: 3, name: "city", label: "Cidade", type: "text" },
          { id: 4, name: "state", label: "Estado", type: "text" },
          { id: 5, name: "zipcode", label: "CEP", type: "text" },
        ]}
        handleSubmit={address.submit}
        loading={address.saving}
        values={address.form}
        onChange={(name, value) =>
          address.setForm(prev => ({ ...prev, [name]: value }))
        }
      />

      <ConfirmDialog
        open={address.deleteOpen}
        title="Excluir endereço"
        description="Tem certeza que deseja excluir este endereço?"
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={address.deleting}
        onCancel={() => address.setDeleteOpen(false)}
        onConfirm={address.confirmDelete}
      />
    </>
  )
}
