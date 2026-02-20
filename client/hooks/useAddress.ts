"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Address } from "@/app/types/Address"
import { addressService } from "@/app/services/address.service"
import handleApiError from "@/app/utils/handleApiError"

export function useAddress() {
  const router = useRouter()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Address | null>(null)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    zipcode: "",
  })

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    async function fetchAddress() {
      try {
        const data = await addressService.read()
        setAddresses(data)
      } catch (error) {
        handleApiError(error, router, "Erro ao buscar endereços")
      } finally {
        setLoading(false)
      }
    }

    fetchAddress()
  }, [router])

  /* ---------------- FORM ---------------- */

  const openCreate = () => {
    setSelected(null)
    setForm({
      street: "",
      number: "",
      city: "",
      state: "",
      zipcode: "",
    })
    setDialogOpen(true)
  }

  const openEdit = (address: Address) => {
    setSelected(address)
    setForm({
      street: address.street,
      number: address.number,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
    })
    setDialogOpen(true)
  }

  /* ---------------- SAVE ---------------- */

  const submit = async () => {
    setSaving(true)

    try {
      if (selected) {
        const updated = await addressService.update(selected.id, form)

        setAddresses(prev =>
          prev.map(a => (a.id === updated.id ? updated : a))
        )
      } else {
        const created = await addressService.create(form)
        setAddresses(prev => [...prev, created])
      }

      setDialogOpen(false)
      setSelected(null)
    } catch (error) {
      handleApiError(error, router, "Erro ao salvar endereço")
      throw error
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- DELETE ---------------- */

  const confirmDelete = async () => {
    if (!selected) return

    setDeleting(true)

    try {
      await addressService.delete(selected.id)

      setAddresses(prev =>
        prev.filter(a => a.id !== selected.id)
      )

      setDeleteOpen(false)
      setSelected(null)
    } catch (error) {
      handleApiError(error, router, "Erro ao deletar endereço")
    } finally {
      setDeleting(false)
    }
  }

  return {
    addresses,
    loading,

    dialogOpen,
    deleteOpen,

    selected,
    form,

    saving,
    deleting,

    setForm,
    setDialogOpen,
    setDeleteOpen,
    setSelected,

    openCreate,
    openEdit,
    submit,
    confirmDelete,
  }
}
