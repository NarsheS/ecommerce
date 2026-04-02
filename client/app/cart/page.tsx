"use client"

import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useCart from "@/hooks/useCart"
import LoadingCircle from "@/components/loading-circle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  function formatCep(cep: string) {
    if (!cep) return "";

    const cleaned = cep.replace(/\D/g, "");

    if (cleaned.length < 8) return cep;

    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  }

  if (loading) {
    return (
      <>
        

        <div className="container mx-auto py-10">
          <LoadingCircle />
        </div>
      </>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">

          {/* Ícone */}
          <div className="text-6xl mb-4">🛒</div>

          {/* Título */}
          <h1 className="text-3xl font-bold">
            Seu carrinho está vazio
          </h1>

          {/* Descrição */}
          <p className="text-muted-foreground mt-2 max-w-md">
            Parece que você ainda não adicionou nenhum produto.
            Explore nossa loja e encontre algo que você goste.
          </p>

          {/* Botão */}
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-md font-medium hover:opacity-90 transition cursor-pointer"
          >
            Ver produtos
          </button>

        </div>
      </>
    )
  }

  return (
    <>

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

            <CardContent className="space-y-4 pt-4">

              {/* ENDEREÇOS */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Endereço de entrega
                </label>
                

                <Select
                  value={selectedAddressId?.toString()}
                  onValueChange={(value) => setSelectedAddressId(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um endereço" />
                  </SelectTrigger>

                  <SelectContent>
                    {addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id.toString()}>
                        {address.street}, nº {address.number} • {address.city} ({address.state}) • CEP {formatCep(address.zipcode)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full cursor-pointer" onClick={() => router.push("/profile")}>Novo endereço</Button>
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
                variant="destructive"
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