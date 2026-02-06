'use client'

import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import DialogAction, { DialogField } from '@/components/dialog-action'
import { Button } from '@/components/ui/button'
import LoadingCircle from '@/components/loading-circle'
import ConfirmDialog from '@/components/confirm-dialog'
import { DiscountRule, DiscountType } from '@/app/types/discount-rule'
import { DiscountCard } from '@/components/discount-card'
import { useDiscounts } from '@/hooks/useDiscounts'
import { useCategories } from '@/hooks/useCategories'

const title = 'Promoções'
const description = 'Crie e gerencie regras de desconto.'

const SalesPage: React.FC = () => {
  const {
    discounts,
    fetching,
    loading,
    deleteLoading,
    saveDiscount,
    removeDiscount,
  } = useDiscounts()

  const { categories, loading: categoriesLoading } = useCategories()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DiscountRule | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null)

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

  /* ---------- FORM DINÂMICO ---------- */
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
      fields.push({
        id: 4,
        name: 'categoryId',
        type: 'select',
        label: 'Categoria',
        disabled: categoriesLoading,
        options: categories.map(category => ({
          value: String(category.id),
          label: category.name,
        })),
      })
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
    const result = await saveDiscount(editingDiscount, formValues)

    if (result.ok) {
      setDialogOpen(false)
      setEditingDiscount(null)
      setFormValues(initialFormValues)
    }
  }

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

    const result = await removeDiscount(discountToDelete)

    if (result.ok) {
      toast.info('Promoção excluída')
    }

    setDeleteDialogOpen(false)
    setDiscountToDelete(null)
  }

  /* ---------- RENDER ---------- */
  return (
    <>
      <div className="flex justify-center mb-4">
        <Button
          onClick={() => {
            setEditingDiscount(null)
            setFormValues(initialFormValues)
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
