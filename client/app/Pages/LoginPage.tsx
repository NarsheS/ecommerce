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

const LoginPage = () => {
    const teste: any = console.log("teste"); // Aqui pode escrever codigo ts
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Entre na sua conta</CardTitle>
                <CardDescription>
                Acesse sua conta usando seu email ou nome de usuário
                </CardDescription>
                <CardAction className="mt-4">
                <Button variant="outline" className="cursor-pointer">Criar conta</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="text">Email ou usuário</Label>
                    <Input
                        id="identifier"
                        type="text"
                        placeholder="placeholder@exemplo.com"
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
                    <Input id="password" type="password" required />
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full cursor-pointer">
                Entrar
                </Button>
                <Button variant="outline" className="w-full cursor-pointer">
                Entrar com Google
                </Button>
            </CardFooter>
            </Card>
        </div>
    )
}

export default LoginPage