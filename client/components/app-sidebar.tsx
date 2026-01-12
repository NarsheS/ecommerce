"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AppWindow, Boxes, DollarSign, Home, NotebookText, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  { title: "Inicío", url: "/", icon: Home },
  { title: "Painel de Controle", url: "/dashboard", icon: AppWindow },
  { title: "Produtos", url: "/dashboard/products", icon: Boxes },
  { title: "Promoções", url: "/dashboard/sales", icon: DollarSign },
  { title: "Categorias", url: "/dashboard/categories", icon: NotebookText },
]

type AppSidebarProps = {
  onLogout?: () => void
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5 mt-1">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title} className="mb-0.5">
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 rounded-md p-2 text-sm ${
                          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                type="button"
                onClick={onLogout}
                className="flex cursor-pointer w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <User2 />
                <span>Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}