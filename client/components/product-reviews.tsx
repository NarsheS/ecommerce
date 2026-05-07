"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Trash2, Pencil, Send } from "lucide-react"

import { api } from "@/app/services/api"
import handleApiError from "@/app/utils/handleApiError"

import { reviewService } from "@/app/services/review.service"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

import type { Review, ProductReviewsProps } from "@/app/types/review"

export default function ProductReviews({
  productId,
  averageRating = 0,
  reviewCount = 0,
}: ProductReviewsProps) {

  const router = useRouter()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)

  const [currentUser, setCurrentUser] = useState<any>(null)

  const formRef = useRef<HTMLDivElement | null>(null)

  // BUSCA USUÁRIO LOGADO
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await api.get("/users/me")

        setCurrentUser(data)

      } catch {
        setCurrentUser(null)
      }
    }

    getCurrentUser()
  }, [])

  // BUSCA REVIEWS
  const fetchReviews = async () => {
    try {
      setLoading(true)

      const data = await reviewService.getProductReviews(productId)

      setReviews(data)

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  // RESET FORM
  const resetForm = () => {
    setComment("")
    setRating(5)
    setEditingReviewId(null)
  }

  // CREATE / UPDATE REVIEW
  const handleSubmit = async () => {
    try {
      if (!comment.trim()) return

      if (editingReviewId) {
        await reviewService.updateReview(
          editingReviewId,
          rating,
          comment
        )
      } else {
        await reviewService.createReview(
          productId,
          rating,
          comment
        )
      }

      resetForm()

      fetchReviews()

    } catch (error: any) {
      handleApiError(
        error,
        router,
        error.response?.data?.message || "Erro ao enviar avaliação"
      )
    }
  }

  // DELETE REVIEW
  const handleDelete = async (reviewId: number) => {
    try {
      await reviewService.deleteReview(reviewId)

      setReviews(prev =>
        prev.filter(r => r.id !== reviewId)
      )

    } catch (error) {
      handleApiError(error, router, "Erro ao deletar avaliação")
    }
  }

  // EDIT REVIEW
  const handleEdit = (review: Review) => {
    setEditingReviewId(review.id)
    setRating(review.rating)
    setComment(review.comment)

    // scroll suave pro formulário
    formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
    })
  }

  // STARS
  const renderStars = (
    currentRating: number,
    clickable = false,
    onClick?: (value: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            onClick={() => clickable && onClick?.(star)}
            className={`
              transition
              ${
                star <= currentRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
              ${clickable ? "cursor-pointer hover:scale-110" : ""}
            `}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-16 space-y-8">

      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          Avaliações
        </h2>

        <div className="flex items-center gap-3">
          {renderStars(Math.round(averageRating))}

          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} • {reviewCount} avaliações
          </span>
        </div>
      </div>

      {/* FORM */}
      <Card ref={formRef}>
        <CardContent className="pt-6 space-y-4">

          <div className="space-y-2">
            <p className="font-medium">
              {editingReviewId
                ? "Editar avaliação"
                : "Escreva uma avaliação"}
            </p>

            {renderStars(rating, true, setRating)}
          </div>

          <Textarea
            placeholder="Compartilhe sua experiência com o produto..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px]"
          />

          <div className="flex items-center gap-3">

            <Button
              onClick={handleSubmit}
              className="cursor-pointer"
            >
              <Send className="w-4 h-4 mr-2" />

              {editingReviewId
                ? "Salvar alterações"
                : "Enviar avaliação"}
            </Button>

            {editingReviewId && (
              <Button
                variant="outline"
                onClick={resetForm}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
            )}

          </div>

        </CardContent>
      </Card>

      {/* REVIEWS */}
      <div className="space-y-4">

        {loading ? (
          <p className="text-muted-foreground">
            Carregando avaliações...
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhuma avaliação ainda.
          </p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">

                <div className="flex items-start justify-between gap-4">

                  <div className="space-y-3 w-full">

                    <div className="flex items-center gap-3 flex-wrap">

                      <span className="font-semibold">
                        {review.user.username}
                      </span>

                      {renderStars(review.rating)}

                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt)
                          .toLocaleDateString("pt-BR")}
                      </span>

                    </div>

                    <p className="text-sm leading-relaxed break-words">
                      {review.comment}
                    </p>

                  </div>

                  {/* BOTÕES DO DONO */}
                  {Number(currentUser?.id) === Number(review.user.id) && (
                    <div className="flex items-center gap-2">

                      {/* EDITAR */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(review)}
                        className="cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* DELETAR */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(review.id)}
                        className="cursor-pointer text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                    </div>
                  )}

                </div>

              </CardContent>
            </Card>
          ))
        )}

      </div>

    </div>
  )
}