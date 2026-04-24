"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"

type Testimonial = {
  name: string
  text: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: "Mariana Silva",
    text: "Entrega super rápida e produtos de ótima qualidade. Recomendo demais!",
    rating: 5,
  },
  {
    name: "Carlos Henrique",
    text: "Atendimento excelente e preços muito bons. Com certeza comprarei novamente.",
    rating: 5,
  },
  {
    name: "Fernanda Costa",
    text: "Fiquei impressionada com a agilidade na entrega. Tudo chegou perfeito!",
    rating: 4,
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {i < rating ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  )
}

export default function CustomerTestimonials() {
  return (
    <section className="w-full py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* título */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">
            Clientes satisfeitos
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Veja o que nossos clientes estão dizendo
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="
                group
                relative
                p-7.5
                rounded-2xl
                border
                bg-background
                hover:shadow-lg
                hover:-translate-y-1
                transition-all
                duration-300
                min-h-[180px]
              "
            >
              {/* glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-primary/5" />

              <div className="relative flex flex-col justify-between h-full gap-4">

                {/* header */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold text-sm">
                      {item.name}
                    </p>
                    <Stars rating={item.rating} />
                  </div>
                </div>

                {/* texto */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{item.text}"
                </p>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}