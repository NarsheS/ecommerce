"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Github, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t mt-16 bg-background">
      <div className="container mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LOGO / ABOUT */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight">
                My<span className="text-primary">Store</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Loja online criada com Next.js, NestJS e Stripe.
            </p>
          </div>

          {/* LINKS */}
          <div className="space-y-3">
            <h3 className="font-semibold">Links</h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>

              <Link href="/cart" className="hover:underline">
                Carrinho
              </Link>

              <Link href="/profile" className="hover:underline">
                Minha conta
              </Link>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="space-y-3">
            <h3 className="font-semibold">Redes sociais</h3>

            <div className="flex gap-4">
              <Link href="#">
                <Github className="h-5 w-5 hover:text-primary transition"/>
              </Link>

              <Link href="#">
                <Instagram className="h-5 w-5 hover:text-primary transition"/>
              </Link>

              <Link href="#">
                <Twitter className="h-5 w-5 hover:text-primary transition"/>
              </Link>
            </div>
          </div>

        </div>

        <Separator className="my-6"/>

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MyStore. Todos os direitos reservados.
        </p>

      </div>
    </footer>
  )
}