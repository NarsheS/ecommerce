"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { FormEvent, useState } from "react"

const LoginPage = () => {
    const [identifier, setIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); //mostrar o botão carregando
    
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(identifier, password)

        try {
            setLoading(true);
            // aqui o fetch request 
            await axios.post(
                "https://ecommerce-cyrl.onrender.com/api/auth/login",
                {
                    identifier,
                    password
                }
            )
            .then(res => console.log(res)); // res é a resposta do server com nosso token

        } catch (err) {
            // tratar erro aqui
            console.log(err); // mudar dps
        }

        setLoading(false);
    };

    
    return (
        <form onSubmit={handleLogin} className="min-h-screen flex items-center justify-center bg-gray-200">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Entre na sua conta</CardTitle>
                <CardDescription>
                Acesse sua conta usando seu email ou nome de usuário
                </CardDescription>
                <CardAction className="mt-4">
                <Button type="button" variant="outline" className="cursor-pointer">Criar conta</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="text">Email ou usuário</Label>
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="placeholder@exemplo.com"
                            value={identifier}
                            onChange={e => setIdentifier(e.target.value)}
                            required
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Senha</Label>
                            <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                            Esqueceu sua senha?
                            </a>
                        </div>
                        <Input 
                            id="password" 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required 
                        />
                        </div>
                    </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button 
                    type="submit" 
                    className="w-full cursor-pointer"
                    disabled={loading}
                >
                {loading? "Carregando..." : "Entrar"}
                </Button>
                <Button type="button" variant="outline" className="w-full cursor-pointer" >
                Entrar com Google
                </Button>
            </CardFooter>
            </Card>
        </form>
    )
}

export default LoginPage