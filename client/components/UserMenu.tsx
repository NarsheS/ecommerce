"use client"

import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface UserMenuProps {
  role?: string
  onLogout: () => void
}

const UserMenu = ({ role, onLogout }: UserMenuProps) => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline">Conta</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
          Perfil
        </DropdownMenuItem>

        {role === "admin" && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.replace("/dashboard")}>
            Dashboard
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={onLogout}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
