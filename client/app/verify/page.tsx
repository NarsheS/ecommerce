"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/services/api";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Token inválido");
      router.replace("/login");
      return;
    }

    const verify = async () => {
      try {
        await api.post("/auth/verify", { token });
        toast.success("Conta verificada com sucesso!");
        router.replace("/login");
      } catch (err) {
        toast.error("Falha ao verificar conta");
        router.replace("/login");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Verificando sua conta...</p>
    </div>
  );
}
