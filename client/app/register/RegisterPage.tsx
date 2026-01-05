"use client"
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import React, { FormEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import { api } from '../services/api'
import { toast } from 'sonner';

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      setLoading(true);

      const response = await api.post("/auth/register", {
        username,
        email,
        password
      });


      if (response.status == 201) {
        toast.success("Verifique seu email para ativar a conta");
        router.replace("/login");
      } else {
        console.error(`Erro: ${response.data.status}`);
        toast.error("Ocorreu um erro ao tentar criar sua conta");
      }
      

    } catch(err) {
      console.error("Erro ao registrar:", err);
    }finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className="min-h-screen flex items-center justify-center bg-gray-200"
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
          <CardDescription>
            Crie sua conta ao registrar seu nome de usuário, email e senha
          </CardDescription>
          <CardAction className="mt-4">
            <Button 
              onClick={() => router.push("/login")}
              type="button" 
              variant="outline"
            >
              Entrar
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label>Nome de Usuário</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Dummy'
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='exemplo@seuEmail.com'
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='************'
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : "Criar Conta"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default RegisterPage