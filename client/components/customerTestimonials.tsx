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
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Título */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">
            Clientes satisfeitos
          </h2>
          <p className="text-muted-foreground">
            Veja o que nossos clientes estão dizendo
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">

                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {item.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-semibold">
                        {item.name}
                      </p>
                      <Stars rating={item.rating} />
                    </div>
                  </div>

                  {/* Texto */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{item.text}"
                  </p>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}