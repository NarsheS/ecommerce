"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react"

import DialogAction from "@/components/dialog-action"
import ConfirmDialog from "@/components/confirm-dialog"
import LoadingCircle from "@/components/loading-circle"

import { useProfile } from "@/hooks/useProfile"
import { useAddress } from "@/hooks/useAddress"

export default function ProfilePage() {
  const router = useRouter()

  const profile = useProfile()
  const address = useAddress()

  if (profile.loading || address.loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <LoadingCircle />
      </div>
    )
  }

  if (!profile.user) return null

  return (
    <>
      {/* VOLTAR */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 rounded-full shadow-md cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="container mx-auto py-10 space-y-8">
        
        {/* PERFIL */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                {profile.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="text-2xl">
                {profile.user.username}
              </CardTitle>
              <p className="text-muted-foreground">
                {profile.user.email}
              </p>
            </div>

            <Button
              size="icon"
              variant="outline"
              className="ml-auto rounded-full cursor-pointer"
              onClick={profile.openEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              className="rounded-full cursor-pointer"
              onClick={() => profile.setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4 pt-6">

            {/* ID */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-medium">{profile.user.id}</span>
            </div>

            {/* ROLE */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Função</span>
              <Badge variant={profile.user.role === "admin" ? "default" : "secondary"}>
                {profile.user.role}
              </Badge>
            </div>

            {/* VERIFIED */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verificado</span>
              <Badge variant={profile.user.isVerified ? "default" : "destructive"}>
                {profile.user.isVerified ? "Sim" : "Não"}
              </Badge>
            </div>

            {/* CREATED */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Criado em</span>
              <span className="font-medium">
                {new Date(profile.user.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>

            {/* UPDATED */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Última atualização</span>
              <span className="font-medium">
                {new Date(profile.user.updatedAt).toLocaleDateString("pt-BR")}
              </span>
            </div>

          </CardContent>
        </Card>

        {/* ENDEREÇOS */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Endereços</CardTitle>

            <Button
              size="icon"
              variant="outline"
              className="rounded-full cursor-pointer"
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

            {address.addresses.map((addr) => (
              <div
                key={addr.id}
                className="border rounded-xl p-5 flex justify-between items-start hover:shadow-sm transition"
              >
                <div className="space-y-2">

                  {/* Rua e Número */}
                  <div className="font-semibold text-lg">
                    {addr.street}, {addr.number}
                  </div>

                  {/* Cidade e Estado */}
                  <div className="text-sm text-muted-foreground">
                    {addr.city} - {addr.state}
                  </div>

                  {/* CEP */}
                  <div className="text-sm text-muted-foreground">
                    CEP: {addr.zipcode}
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full cursor-pointer"
                    onClick={() => address.openEdit(addr)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full cursor-pointer"
                    onClick={() => {
                      address.setSelected(addr)
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

      {/* DIALOG ADDRESS (CREATE + EDIT) */}
      <DialogAction
        open={address.dialogOpen}
        onOpenChange={address.setDialogOpen}
        title={address.selected ? "Editar Endereço" : "Novo Endereço"}
        content={[
          { id: 1, name: "street", label: "Rua" },
          { id: 2, name: "number", label: "Número" },
          { id: 3, name: "city", label: "Cidade" },
          { id: 4, name: "state", label: "Estado" },
          { id: 5, name: "zipcode", label: "CEP" },
        ]}
        handleSubmit={address.submit}
        loading={address.saving}
        values={address.form}
        onChange={(name, value) =>
          address.setForm(prev => ({ ...prev, [name]: value }))
        }
      />

      {/* CONFIRM DELETE ADDRESS */}
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

      {/* CONFIRM DELETE PROFILE */}
      <ConfirmDialog
        open={profile.deleteDialogOpen}
        title="Excluir conta"
        description="Essa ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={profile.deleteLoading}
        onCancel={() => profile.setDeleteDialogOpen(false)}
        onConfirm={profile.confirmDelete}
      />
    </>
  )
}
