'use client'

import React from 'react'
import { DiscountRule, DiscountType } from '@/app/types/discount-rule'
import { Button } from './ui/button'

interface DiscountCardProps {
  discount: DiscountRule
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const DiscountCard: React.FC<DiscountCardProps> = ({
  discount,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    try {
        return new Date(dateStr).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        })
    } catch {
        return dateStr
    }
    }

  const typeLabel = () => {
    switch (discount.type) {
      case DiscountType.GLOBAL:
        return 'Global'
      case DiscountType.CATEGORY:
        return `Categoria (#${discount.categoryId})`
      case DiscountType.PRODUCT:
        return `Produto (#${discount.productId})`
      case DiscountType.PRICE_MIN:
        return `Preço mínimo (${discount.priceMin})`
      default:
        return 'Desconhecido'
    }
  }

  return (
    <div className="border rounded-lg bg-white shadow p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{discount.name}</h3>
        <span
          className={`px-2 py-1 text-sm rounded-full font-medium ${
            discount.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {discount.active ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div>
          <strong>Tipo:</strong> {typeLabel()}
        </div>
        <div>
          <strong>Desconto:</strong> {discount.discountPercentage}%
        </div>
        <div>
          <strong>Início:</strong> {formatDate(discount.startsAt)}
        </div>
        <div>
          <strong>Fim:</strong> {formatDate(discount.endsAt)}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(discount.id)}>
          Editar
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(discount.id)}>
          Excluir
        </Button>
      </div>
    </div>
  )
}
