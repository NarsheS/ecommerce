export type ReviewUser = {
  id: number
  username: string
}

export type Review = {
  id: number
  rating: number
  comment: string
  createdAt: string
  user: ReviewUser
}

export type ProductReviewsProps = {
  productId: number
  averageRating?: number
  reviewCount?: number
}