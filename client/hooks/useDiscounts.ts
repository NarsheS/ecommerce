import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import handleApiError from "@/app/utils/handleApiError"
import { DiscountRule } from "@/app/types/discount-rule"
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../app/services/discount.service"

export function useDiscounts() {
  const router = useRouter()

  const [discounts, setDiscounts] = useState<DiscountRule[]>([])
  const [fetching, setFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function fetchAll() {
    setFetching(true)
    try {
      const data = await getDiscounts()
      setDiscounts(data)
    } catch (error) {
      handleApiError(error, router, "Erro ao buscar promoções")
    } finally {
      setFetching(false)
    }
  }

  async function saveDiscount(editingDiscount: DiscountRule | null, formValues: any) {
    setLoading(true)
    try {
      const payload = {
        ...formValues,
        discountPercentage: Number(formValues.discountPercentage),
        categoryId: formValues.categoryId ? Number(formValues.categoryId) : undefined,
        productId: formValues.productId ? Number(formValues.productId) : undefined,
        priceMin: formValues.priceMin ? Number(formValues.priceMin) : undefined,
      }

      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, payload)
      } else {
        await createDiscount(payload)
      }

      await fetchAll()
      return { ok: true }
    } catch (error) {
      handleApiError(error, router, "Erro ao salvar promoção")
      return { ok: false }
    } finally {
      setLoading(false)
    }
  }

  async function removeDiscount(id: number) {
    setDeleteLoading(true)
    try {
      await deleteDiscount(id)
      await fetchAll()
      return { ok: true }
    } catch (error) {
      handleApiError(error, router, "Erro ao excluir promoção")
      return { ok: false }
    } finally {
      setDeleteLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    discounts,
    fetching,
    loading,
    deleteLoading,
    fetchAll,
    saveDiscount,
    removeDiscount,
  }
}
