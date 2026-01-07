"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { api, setAuthToken } from "../services/api";
import { useRouter } from "next/dist/client/components/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

    
    const { setAccessToken, user } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        if (!user) router.replace("/");
        if (user?.role !== "admin") {
          router.replace("/");
        }
      }, [user, router]);
    
      if (!user) return null

    const handleLogout = async () => {
      try {
        await api.post("/auth/logout");
      } catch {}
      finally {
        setAccessToken(null);
        setAuthToken(null);
        router.replace("/");
      }
    }

  return (
    <div className="min-h-screen flex">
      <SidebarProvider>
        {/* Sidebar (desktop visible, mobile toggled) */}
        <AppSidebar onLogout={handleLogout} />

        {/* Main content area */}
        <div className="flex-1">
          <header className="p-4 bg-white shadow flex items-center justify-between">
            <div className="text-lg font-semibold">Painel de Controle</div>
            {/* Pass a className to make the trigger visible on all sizes */}
            <SidebarTrigger className="p-2 rounded hover:bg-gray-100" />
          </header>

          <main className="p-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
