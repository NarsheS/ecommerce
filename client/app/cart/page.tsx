"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import useCart from "@/hooks/useCart"
import LoadingCircle from "@/components/loading-circle"

export default function CartPage() {
  const router = useRouter()
  const { cart, loading, removeItem, clearCart } = useCart()

  if (loading) {
    return (
      <>
        {/* VOLTAR */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
          className="fixed top-4 left-4 z-50 rounded-full shadow-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="container mx-auto py-10">
          <LoadingCircle />
        </div>
      </>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        {/* VOLTAR */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
          className="fixed top-4 left-4 z-50 rounded-full shadow-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="container mx-auto py-10 space-y-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Seu carrinho está vazio
          </h1>
          <p className="text-muted-foreground text-center">
            Adicione produtos para continuar.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {/* VOLTAR */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 rounded-full shadow-md cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="container mx-auto py-10 pt-18 space-y-6">
        <h1 className="text-3xl font-bold">Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between p-4 gap-4">

                  <div className="flex items-center gap-4">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}

                    <div>
                      <p className="font-semibold">
                        {item.product.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        R$ {item.pricing.finalPrice.toFixed(2)}
                      </p>

                      {item.pricing.discount && (
                        <p className="text-xs text-green-600">
                          {item.pricing.discount}% OFF
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      readOnly
                      className="w-16"
                    />

                    <div className="text-right">
                      <p className="font-semibold">
                        R$ {item.subtotal.toFixed(2)}
                      </p>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-2 cursor-pointer"
                        onClick={() => removeItem(item.product.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 pt-4">

              <div className="flex justify-between text-sm">
                <span>Itens</span>
                <span>{cart.items.length}</span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {cart.total.toFixed(2)}</span>
              </div>

              <Button className="w-full cursor-pointer">
                Finalizar Compra
              </Button>

              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>

            </CardContent>
          </Card>

        </div>
      </div>
    </>
  )
}