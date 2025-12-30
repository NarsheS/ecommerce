"use client"

import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return
    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null

  return <h1>Dashboard Admin</h1>
}
