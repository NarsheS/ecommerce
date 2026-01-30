export enum DiscountType {
  CATEGORY = 'category',
  PRICE_MIN = 'price_min',
  PRODUCT = 'product',
  GLOBAL = 'global',
}

export interface DiscountRule {
  id: number
  name: string
  type: DiscountType
  categoryId?: number
  productId?: number
  priceMin?: number
  discountPercentage: number
  startsAt?: string
  endsAt?: string
  active: boolean
}
