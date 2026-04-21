"use client"

import { Truck, ShieldCheck, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

export default function WhyBuy() {
  const items = [
    {
      icon: Truck,
      title: "Entrega rápida",
      description: "Enviamos para todo o Brasil com agilidade e rastreio completo.",
    },
    {
      icon: ShieldCheck,
      title: "Compra segura",
      description: "Seus dados protegidos com criptografia e total segurança.",
    },
    {
      icon: CreditCard,
      title: "Pagamento facilitado",
      description: "Parcele em até 12x ou pague via Pix com confirmação rápida.",
    },
  ]

  return (
    <section className="w-full py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* título opcional */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">
            Por que comprar conosco?
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Segurança, rapidez e praticidade em cada pedido
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="
                  group
                  relative
                  p-6
                  rounded-2xl
                  border
                  bg-background
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                {/* glow sutil */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-primary/5" />

                <div className="relative flex flex-col items-center text-center gap-3">

                  {/* ícone */}
                  <div className="
                    p-3
                    rounded-full
                    bg-primary/10
                    group-hover:bg-primary/20
                    transition
                  ">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* título */}
                  <h3 className="font-semibold text-base">
                    {item.title}
                  </h3>

                  {/* descrição */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                </div>
              </motion.div>
            )
          })}

        </div>
      </div>
    </section>
  )
}