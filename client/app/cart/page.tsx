"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useCart from "@/hooks/useCart"
import LoadingCircle from "@/components/loading-circle"

export default function CartPage() {
  const router = useRouter()

  const {
    cart,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    loading,
    removeItem,
    clearCart,
    updateItemQuantity,
    createOrderPayment
  } = useCart()

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

  if (loading) {
    return (
      <>
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/")}
          className="fixed top-4 left-4 z-50 rounded-full shadow-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="container mx-auto py-10 space-y-6">
          <h1 className="text-2xl font-bold text-center">
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
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 rounded-full shadow-md cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="container mx-auto py-10 pt-20 space-y-6">
        <h1 className="text-3xl font-bold">Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ITENS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => {

              const unitPrice = item.pricing.finalPrice
              const hasDiscount = item.pricing.hasDiscount

              return (
                <Card key={item.id}>
                  <CardContent className="flex items-center justify-between p-4 gap-4">

                    <div className="flex items-center gap-4">

                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}

                      <div>
                        <p className="font-semibold">
                          {item.product.name}
                        </p>

                        {hasDiscount && (
                          <p className="text-sm line-through text-muted-foreground">
                            {formatPrice(item.pricing.originalPrice)}
                          </p>
                        )}

                        <p className="text-sm font-semibold text-green-600">
                          {formatPrice(unitPrice)}
                        </p>

                        {hasDiscount && (
                          <p className="text-xs text-green-600">
                            {item.pricing.discountPercentage}% OFF
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">

                      <Button
                        onClick={() =>
                          updateItemQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>

                      <span>{item.quantity}</span>

                      <Button
                        onClick={() =>
                          updateItemQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>

                      <div className="text-right">

                        <p className="font-semibold">
                          {formatPrice(unitPrice * item.quantity)}
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
              )
            })}
          </div>

          {/* RESUMO */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-4 pt-4">

              {/* ENDEREÇOS */}
              <div>
                <p className="font-semibold mb-2">Endereço de entrega</p>

                <select
                  value={selectedAddressId ?? ""}
                  onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                  className="w-full border rounded-md p-2"
                >
                  {addresses.map(address => (
                    <option key={address.id} value={address.id}>
                      {address.street}, {address.number} - {address.city}
                    </option>
                  ))}
                </select>
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span>Itens</span>
                <span>
                  {cart.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  {formatPrice(
                    cart.items.reduce(
                      (total, item) =>
                        total + item.pricing.finalPrice * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>

              <Button
                className="w-full cursor-pointer"
                onClick={createOrderPayment}
              >
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