"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile } from "@/app/types/profile"
import { profileService } from "@/app/services/profile.service"
import handleApiError from "@/app/utils/handleApiError"

export function useProfile() {
  const router = useRouter()

  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
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

        console.error("Erro ao buscar usuário", error)
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
      password: "",
    })

    setDialogOpen(true)
  }

  const submit = async () => {
    if (!user) return

    setSaving(true)

    try {
      const payload: any = {
        username: form.username,
        email: form.email,
      }

      if (form.password) {
        payload.password = form.password
      }

      const updated = await profileService.update(payload)

      setUser(updated)
      setDialogOpen(false)

      setForm({
        username: updated.username,
        email: updated.email,
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

  return {
    user,
    loading,

    dialogOpen,
    setDialogOpen,

    deleteDialogOpen,
    setDeleteDialogOpen,

    saving,
    deleteLoading,

    form,
    setForm,

    openEdit,
    submit,
    confirmDelete,
  }
}
