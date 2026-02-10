"use client"

export const runtime = 'edge'

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Chrome, Loader2, Mail } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({
        message: "Por favor, insira um e-mail válido.",
    }),
})

export default function LoginPage() {
    const { login, loginWithGoogle } = useAuth()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            await login(values.email)
            setSent(true)
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Erro ao enviar e-mail de login.")
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <Card className="w-full max-w-md border-muted-foreground/10 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                        Verifique seu e-mail
                    </CardTitle>
                    <CardDescription>
                        Enviamos um link de login para <strong>{form.getValues("email")}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                    Clique no link presente no e-mail para acessar sua conta automaticamente.
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                        Voltar para o login
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md border-muted-foreground/10 shadow-xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    Bem-vindo ao Clube IA
                </CardTitle>
                <CardDescription>
                    Entre com seu e-mail para receber um link de acesso seguro
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="diretor@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full font-semibold" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Receber Link de Login
                        </Button>
                    </form>
                </Form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Ou continue com
                        </span>
                    </div>
                </div>

                <Button variant="outline" className="w-full" type="button" onClick={() => loginWithGoogle()} disabled={loading}>
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                <p className="text-xs">
                    Não é necessário senha. Usamos autenticação segura via e-mail ou Google.
                </p>
            </CardFooter>
        </Card>
    )
}
