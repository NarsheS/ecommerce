'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/app/services/api'
import handleApiError from '@/app/utils/handleApiError'
import { toast } from 'sonner'
import DialogAction, { DialogField } from '@/components/dialog-action'
import { Button } from '@/components/ui/button'
import LoadingCircle from '@/components/loading-circle'
import ConfirmDialog from '@/components/confirm-dialog'
import { useRouter } from 'next/navigation'
import { DiscountRule, DiscountType } from '@/app/types/discount-rule'
import { DiscountCard } from '@/components/discount-card'

const title = 'Promoções'
const description = 'Crie e gerencie regras de desconto.'

const SalesPage: React.FC = () => {
  const router = useRouter()

  const [discounts, setDiscounts] = useState<DiscountRule[]>([])
  const [fetching, setFetching] = useState(false)
  const [loading, setLoading] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DiscountRule | null>(null)

  /* ---------- DELETE ---------- */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* ---------- FORM ---------- */
  const initialFormValues = {
    name: '',
    type: DiscountType.GLOBAL,
    discountPercentage: '',
    categoryId: '',
    productId: '',
    priceMin: '',
    startsAt: '',
    endsAt: '',
    active: true,
  }

  const [formValues, setFormValues] = useState(initialFormValues)

  /* ---------- FETCH ---------- */
  const fetchDiscounts = async () => {
    setFetching(true)
    try {
      const res = await api.get('/discounts')
      setDiscounts(res.data)
    } catch (error) {
      handleApiError(error, router, 'Erro ao buscar promoções')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchDiscounts()
  }, [])

  /* ---------- FORM SETUP ---------- */
  const formSetup: DialogField[] = useMemo(() => {
    const fields: DialogField[] = [
      { id: 1, name: 'name', type: 'text', label: 'Nome' },
      {
        id: 2,
        name: 'type',
        type: 'select',
        label: 'Tipo',
        options: [
          { value: DiscountType.GLOBAL, label: 'Global' },
          { value: DiscountType.CATEGORY, label: 'Categoria' },
          { value: DiscountType.PRODUCT, label: 'Produto' },
          { value: DiscountType.PRICE_MIN, label: 'Preço mínimo' },
        ],
      },
      {
        id: 3,
        name: 'discountPercentage',
        type: 'number',
        label: 'Desconto (%)',
      },
    ]

    if (formValues.type === DiscountType.CATEGORY) {
      fields.push({ id: 4, name: 'categoryId', type: 'number', label: 'ID da categoria' })
    }

    if (formValues.type === DiscountType.PRODUCT) {
      fields.push({ id: 5, name: 'productId', type: 'number', label: 'ID do produto' })
    }

    if (formValues.type === DiscountType.PRICE_MIN) {
      fields.push({ id: 6, name: 'priceMin', type: 'number', label: 'Preço mínimo' })
    }

    fields.push(
      {
        id: 7,
        name: 'startsAt',
        type: 'text',
        inputType: 'datetime-local',
        label: 'Início',
      },
      {
        id: 8,
        name: 'endsAt',
        type: 'text',
        inputType: 'datetime-local',
        label: 'Fim',
      }
    )

    return fields
  }, [formValues.type])

  /* ---------- HANDLERS ---------- */
  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
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
        await api.put(`/discounts/${editingDiscount.id}`, payload)
      } else {
        await api.post('/discounts', payload)
      }

      setDialogOpen(false)
      setEditingDiscount(null)
      setFormValues(initialFormValues)
      await fetchDiscounts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao salvar promoção')
    } finally {
      setLoading(false)
    }
  }

  /* ---------- EDIT / DELETE ---------- */
  const handleEdit = (id: number) => {
    const discount = discounts.find(d => d.id === id)
    if (!discount) return

    setEditingDiscount(discount)
    setFormValues({
      name: discount.name,
      type: discount.type,
      discountPercentage: String(discount.discountPercentage),
      categoryId: discount.categoryId ? String(discount.categoryId) : '',
      productId: discount.productId ? String(discount.productId) : '',
      priceMin: discount.priceMin ? String(discount.priceMin) : '',
      startsAt: discount.startsAt || '',
      endsAt: discount.endsAt || '',
      active: discount.active,
    })

    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setDiscountToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!discountToDelete) return
    setDeleteLoading(true)

    try {
      await api.delete(`/discounts/${discountToDelete}`)
      toast.info('Promoção excluída')
      await fetchDiscounts()
    } catch (error) {
      handleApiError(error, router, 'Erro ao excluir promoção')
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setDiscountToDelete(null)
    }
  }

  /* ---------- RENDER ---------- */
  return (
    <>
      <div className="flex justify-center mb-4">
        <Button
          onClick={() => {
            setEditingDiscount(null) // reset editingDiscount
            setFormValues(initialFormValues) // reset form values
            setDialogOpen(true)
          }}
        >
          Nova promoção +
        </Button>
      </div>

      <DialogAction
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingDiscount ? 'Atualizar promoção' : title}
        description={description}
        content={formSetup}
        handleSubmit={handleSubmit}
        loading={loading}
        values={formValues}
        onChange={handleChange}
      />

      <section>
        {fetching ? (
          <LoadingCircle />
        ) : (
          <div className="grid gap-4">
            {discounts.map(d => (
                <DiscountCard
                key={d.id}
                discount={d}
                onEdit={handleEdit}
                onDelete={handleDelete}
                />
            ))}
            </div>
        )}
      </section>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir promoção"
        description="Tem certeza que deseja excluir esta promoção?"
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        loading={deleteLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default SalesPage
