"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile } from "@/app/types/profile"
import { profileService } from "@/app/services/profile.service"
import handleApiError from "@/app/utils/handleApiError"
import { toast } from "sonner"

export function useProfile() {
  const router = useRouter()

  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [resetLoading, setResetLoading] = useState(false)

  const [form, setForm] = useState({
    username: "",
    email: "",
  })

  /* ---------------- FETCH ---------------- */

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
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  /* ---------------- ACTIONS ---------------- */

  const openEdit = () => {
    if (!user) return

    setForm({
      username: user.username,
      email: user.email,
    })

    setDialogOpen(true)
  }

  const submit = async () => {
    if (!user) return

    setSaving(true)

    try {
      const payload = {
        username: form.username,
        email: form.email,
      }

      const updated = await profileService.update(payload)

      setUser(updated)

      setDialogOpen(false)

      setForm({
        username: updated.username,
        email: updated.email,
      })
    } catch (error) {
      handleApiError(error, router, "Erro ao atualizar perfil")
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user) return

    setResetLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: user.email,
          }),
        }
      )

      if (!response.ok) {
        throw new Error()
      }

      toast.success("Enviamos para seu e-mail um link para redefinir sua senha")
    } catch (error) {
      handleApiError(error, router, "Erro ao enviar email de redefinição")
    } finally {
      setResetLoading(false)
    }
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)

    try {
      await profileService.remove()

      router.replace("/")
      router.refresh()
    } catch (error) {
      handleApiError(error, router, "Erro ao deletar a conta")
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  return {
    user,
    loading,

    dialogOpen,
    setDialogOpen,

    deleteDialogOpen,
    setDeleteDialogOpen,

    saving,
    deleteLoading,

    resetLoading,

    form,
    setForm,

    openEdit,
    submit,
    handlePasswordReset,
    confirmDelete,
  }
}