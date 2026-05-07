import { api } from "@/app/services/api"

export const reviewService = {
  async getProductReviews(productId: number) {
    const { data } = await api.get(`/reviews/product/${productId}`)
    return data
  },

  async createReview(
    productId: number,
    rating: number,
    comment: string
  ) {
    const { data } = await api.post("/reviews", {
      productId,
      rating,
      comment,
    })

    return data
  },

  async updateReview(
    reviewId: number,
    rating: number,
    comment: string
  ) {
    const { data } = await api.patch(`/reviews/${reviewId}`, {
      rating,
      comment,
    })

    return data
  },

  async deleteReview(reviewId: number) {
    const { data } = await api.delete(`/reviews/${reviewId}`)
    return data
  },
}