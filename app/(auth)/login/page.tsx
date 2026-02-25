"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
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
import { Loader2, Sparkles, Mail } from "lucide-react"
const LoginBackground = ({ imagePath, blur = false }: { imagePath: string, blur?: boolean }) => {
    useEffect(() => {
        console.log(`[LoginBackground] Image path: ${imagePath}`);
    }, [imagePath]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-zinc-950">
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${imagePath})` }}
            >
                <div className="absolute inset-0 bg-black/20" /> {/* Darken just a bit */}
            </motion.div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-white/10" />

            {/* Subtle light effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 opacity-30" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -ml-40 -mb-40 opacity-20" />
        </div>
    )
}
import { motion, AnimatePresence } from "framer-motion"

const formSchema = z.object({
    email: z.string().email({
        message: "Por favor, insira um e-mail válido.",
    }),
})

export default function LoginPage() {
    const { login, loginWithGoogle, user, isAuthenticated } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, router])

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

    return (
        <>
            <LoginBackground imagePath="/assets/bg-login.png" />
            <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-transparent z-10">

                <AnimatePresence mode="wait">
                    {sent ? (
                        <motion.div
                            key="sent"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-md"
                        >
                            <Card className="border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl text-zinc-900">
                                <CardHeader className="space-y-4 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                                        className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"
                                    >
                                        <Mail className="h-8 w-8 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
                                    </motion.div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                                            Verifique seu e-mail
                                        </CardTitle>
                                        <CardDescription className="text-zinc-600 text-base">
                                            Enviamos um link de login para <br />
                                            <span className="text-zinc-900 font-semibold">{form.getValues("email")}</span>
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-center text-sm text-zinc-600 pb-8">
                                    Clique no link presente no e-mail para acessar sua conta de forma segura.
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        className="w-full border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition-all"
                                        onClick={() => setSent(false)}
                                    >
                                        Voltar para o login
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-md"
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/30 rounded-3xl blur-2xl -z-10 opacity-40" />

                            <Card className="border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />

                                <CardHeader className="space-y-2 text-center pb-8 pt-10">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex justify-center mb-2"
                                    >
                                        <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 backdrop-blur-sm">
                                            <Sparkles className="h-6 w-6 text-primary" />
                                        </div>
                                    </motion.div>
                                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-zinc-900 via-primary to-zinc-600 bg-clip-text text-transparent">
                                        Clube IA
                                    </CardTitle>
                                    <CardDescription className="text-zinc-600 font-medium">
                                        Plataforma inteligente para Diretores de Desbravadores
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1.5">
                                                        <FormLabel className="text-zinc-600 text-xs uppercase tracking-wider font-bold">E-mail</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="diretor@exemplo.com"
                                                                {...field}
                                                                className="bg-white/50 border-zinc-200 focus:border-primary/50 transition-all h-12 text-zinc-900"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px]" />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="submit"
                                                className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                ) : (
                                                    "Entrar com Magic Link"
                                                )}
                                            </Button>
                                        </form>
                                    </Form>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-zinc-200" />
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                            <span className="bg-white/10 backdrop-blur-md px-3 text-zinc-400">
                                                Acesso rápido
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full h-12 border-zinc-200 bg-white/50 hover:bg-white/80 text-zinc-700 transition-all flex items-center justify-center gap-3 font-medium active:scale-[0.98]"
                                        type="button"
                                        onClick={() => loginWithGoogle()}
                                        disabled={loading}
                                    >
                                        <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m23.49 12.275c0-.825-.075-1.616-.213-2.383h-11.277v4.508h6.442c-.277 1.492-1.121 2.76-2.388 3.597v2.99h3.868c2.263-2.083 3.568-5.152 3.568-8.712z" fill="#4285f4" />
                                            <path d="m11.999 24c3.24 0 5.957-1.076 7.943-2.912l-3.868-2.99c-1.072.718-2.445 1.144-4.075 1.144-3.134 0-5.786-2.116-6.733-4.962h-3.993v3.094c1.972 3.91 5.992 6.626 10.726 6.626z" fill="#34a853" />
                                            <path d="m5.266 14.28c-.24-.712-.375-1.474-.375-2.261 0-.787.135-1.55.375-2.261v-3.094h-3.993c-.81 1.612-1.272 3.424-1.272 5.355 0 1.93.462 3.743 1.272 5.355z" fill="#fbbc05" />
                                            <path d="m11.999 4.745c1.762 0 3.344.606 4.587 1.794l3.44-3.44c-2.083-1.944-4.803-3.099-8.027-3.099-4.734 0-8.754 2.716-10.726 6.626l3.993 3.094c.947-2.846 3.599-4.962 6.733-4.962z" fill="#ea4335" />
                                        </svg>
                                        Continuar com Google
                                    </Button>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4 text-center text-xs text-zinc-400 pb-10 pt-4">
                                    <Separator className="bg-zinc-200 w-1/2 mx-auto" />
                                    <p className="leading-relaxed px-4">
                                        Não é necessário senha. Usamos autenticação segura via magic link ou Google.
                                    </p>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
