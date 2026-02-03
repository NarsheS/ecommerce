import { api } from "@/app/services/api"
import { DiscountRule } from "@/app/types/discount-rule"

export async function getDiscounts(): Promise<DiscountRule[]> {
  const res = await api.get("/discounts")
  return res.data
}

export async function createDiscount(data: any) {
  await api.post("/discounts", data)
}

export async function updateDiscount(id: number, data: any) {
  await api.put(`/discounts/${id}`, data)
}

export async function deleteDiscount(id: number) {
  await api.delete(`/discounts/${id}`)
}
