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
import { Chrome, Loader2, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Por favor, insira um e-mail válido.",
    }),
})

export default function RegisterPage() {
    const { register, loginWithGoogle } = useAuth()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            await register(values.name, values.email)
            setSent(true)
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Erro ao criar conta.")
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <Card className="w-full max-w-md border-muted-foreground/10 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                        Conta criada!
                    </CardTitle>
                    <CardDescription>
                        Enviamos um link de ativação para <strong>{form.getValues("email")}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                    Verifique sua caixa de entrada e clique no link para começar a usar o Desbravagente.
                </CardContent>
                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                            Ir para Login
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md border-muted-foreground/10 shadow-xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    Crie sua conta
                </CardTitle>
                <CardDescription>
                    Simplifique a gestão do seu clube com Inteligência Artificial
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Seu nome ou nome do clube" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            Criar Conta Grátis
                        </Button>
                    </form>
                </Form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Ou use sua conta
                        </span>
                    </div>
                </div>

                <Button variant="outline" className="w-full" type="button" onClick={() => loginWithGoogle()} disabled={loading}>
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </CardContent>
            <CardFooter className="flex justify-center text-center text-sm text-muted-foreground">
                <div>
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Acessar agora
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
