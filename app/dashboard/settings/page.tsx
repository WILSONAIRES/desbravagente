"use client"

export const runtime = 'edge'

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
    Eye,
    EyeOff,
    Save,
    CreditCard,
    CheckCircle2,
    Users,
    Gift,
    Ban,
    ExternalLink,
    Loader2
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { storageService } from "@/services/storage-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"

function SettingsContent() {
    const searchParams = useSearchParams()
    const { user, updateProfile, updateSubscription } = useAuth()
    const [name, setName] = useState(user?.name || "")
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")
    const [apiKey, setApiKey] = useState("")
    const [provider, setProvider] = useState("groq")
    const [modelName, setModelName] = useState("")
    const [showKey, setShowKey] = useState(false)
    const [status, setStatus] = useState<"idle" | "saved" | "loading">("idle")
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    // Admin specific state
    const [allUsers, setAllUsers] = useState<any[]>([])
    const isAdmin = user?.role === 'admin' || user?.email === 'waisilva@gmail.com'

    useEffect(() => {
        const tab = searchParams.get("tab")
        if (tab) setActiveTab(tab)
    }, [searchParams])

    useEffect(() => {
        if (user) setName(user.name)
        loadAIConfig()
        if (isAdmin) {
            loadAllUsers()
        }
    }, [user, isAdmin])

    const loadAIConfig = async () => {
        const [dbKey, dbProvider, dbModel] = await Promise.all([
            storageService.getGlobalConfig("ai_api_key"),
            storageService.getGlobalConfig("ai_provider"),
            storageService.getGlobalConfig("ai_model")
        ])

        if (dbKey) setApiKey(dbKey)
        if (dbProvider) setProvider(dbProvider)
        if (dbModel) setModelName(dbModel)
    }

    const loadAllUsers = async () => {
        const users = await storageService.getAllUsers()
        setAllUsers(users)
    }

    const handleUpdateProfile = async () => {
        setStatus("loading")
        try {
            await updateProfile({ name })
            setStatus("saved")
        } catch (err) {
            console.error(err)
            setStatus("idle")
        }
        setTimeout(() => setStatus("idle"), 2000)
    }

    const handleSaveAI = async () => {
        setStatus("loading")
        try {
            await Promise.all([
                storageService.saveGlobalConfig("ai_api_key", apiKey.trim()),
                storageService.saveGlobalConfig("ai_provider", provider),
                storageService.saveGlobalConfig("ai_model", modelName.trim())
            ])
            setStatus("saved")
        } catch (err) {
            console.error(err)
            setStatus("idle")
        }
        setTimeout(() => setStatus("idle"), 2000)
    }

    const handleMockCheckout = async () => {
        setIsCheckingOut(true)
        // Simulate Stripe Redirect
        setTimeout(async () => {
            await updateSubscription({
                status: 'active',
                plan: 'monthly'
            })
            setIsCheckingOut(false)
            alert("Pagamento processado com sucesso! (Simulação Stripe Checkout)")
        }, 2000)
    }

    const handleUpdateUserSub = async (email: string, updates: any) => {
        const targetUser = allUsers.find(u => u.email === email)
        if (targetUser) {
            const updatedUser = {
                ...targetUser,
                subscription: { ...targetUser.subscription, ...updates }
            }
            await storageService.saveUserRecord(updatedUser)
            await loadAllUsers()

            // If we are updating ourselves, sync local auth state
            if (user?.email === email) {
                await updateSubscription(updatedUser.subscription)
            }
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="subscription">Assinatura</TabsTrigger>
                    {isAdmin && <TabsTrigger value="ia">IA Config</TabsTrigger>}
                    {isAdmin && <TabsTrigger value="users">Usuários</TabsTrigger>}
                </TabsList>

                <TabsContent value="profile" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Meu Perfil</CardTitle>
                            <CardDescription>Gerencie suas informações pessoais.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Avatar className="h-20 w-20 border-2 border-primary/20">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                        {user?.name?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-4 flex-1 w-full">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input
                                            id="name"
                                            value={name || ""}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">E-mail (Fixo por segurança)</Label>
                                        <Input id="email" value={user?.email || ""} disabled />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleUpdateProfile} disabled={status !== "idle"}>
                                {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {status === "saved" ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                {status === "saved" ? "Atualizado!" : "Salvar Alterações"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="subscription" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plano e Pagamento</CardTitle>
                            <CardDescription>Gerencie sua assinatura do Desbravagente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row items-center justify-between p-6 border-2 border-primary/10 rounded-xl bg-muted/20 gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CreditCard className="h-7 w-7 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-lg capitalize">{user?.subscription?.status}</p>
                                            <Badge variant={user?.subscription?.status === 'active' || user?.subscription?.status === 'exempt' ? 'default' : 'secondary'}>
                                                {user?.subscription?.status === 'active' ? 'Ativo' : user?.subscription?.status === 'trial' ? 'Período de Teste' : user?.subscription?.status === 'exempt' ? 'Isento' : 'Inativo'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Plano {user?.subscription?.plan === 'free' ? 'Básico/Grátis' : 'Profissional'}</p>
                                    </div>
                                </div>
                                {user?.subscription?.status !== 'active' && user?.subscription?.status !== 'exempt' && (
                                    <Button onClick={handleMockCheckout} disabled={isCheckingOut} className="w-full md:w-auto">
                                        {isCheckingOut ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                        )}
                                        {isCheckingOut ? "Redirecionando..." : "Assinar com Stripe"}
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-4">
                                <h3 className="font-semibold text-lg">Detalhes da Assinatura</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground">Valor mensal</span>
                                        <span className="font-medium">R$ 29,90</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground">Status do Pagamento</span>
                                        <span className="font-medium text-green-500 flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Regular
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground">Próxima Cobrança</span>
                                        <span className="font-medium">10/03/2026</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {isAdmin && (
                    <TabsContent value="ia" className="space-y-4 pt-4">
                        <Card className="border-primary/20 shadow-lg">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Badge>Admin Only</Badge>
                                    Configuração Global de IA
                                </CardTitle>
                                <CardDescription>Defina os parâmetros que todos os diretores usarão para gerar conteúdos.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="grid gap-2">
                                    <Label>Provedor</Label>
                                    <Select value={provider} onValueChange={setProvider}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            <SelectItem value="gemini">Gemini</SelectItem>
                                            <SelectItem value="groq">Groq</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>API Key (Supabase Global Config)</Label>
                                    <div className="relative">
                                        <Input type={showKey ? "text" : "password"} value={apiKey || ""} onChange={(e) => setApiKey(e.target.value)} />
                                        <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowKey(!showKey)}>
                                            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Modelo</Label>
                                    <Input value={modelName || ""} onChange={(e) => setModelName(e.target.value)} placeholder="llama-3.3-70b-versatile" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSaveAI} className="w-full" disabled={status !== "idle"}>
                                    {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" />
                                    {status === "saved" ? "Configurações Globais Atualizadas!" : "Atualizar Configurações para Todos"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                )}

                {isAdmin && (
                    <TabsContent value="users" className="space-y-4 pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Users className="h-5 w-5" />
                                    Central de Clientes e Cobranças
                                </CardTitle>
                                <CardDescription>Gestão manual de assinaturas para casos especiais.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y">
                                    {allUsers.map((u) => (
                                        <div key={u.email} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 ring-2 ring-muted">
                                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                        {u.name?.substring(0, 2).toUpperCase() || "??"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold flex items-center gap-2">
                                                        {u.name}
                                                        {u.role === 'admin' && <Badge className="bg-amber-500 scale-75 origin-left">SuperAdmin</Badge>}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{u.email}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge variant="outline" className="text-[10px] uppercase">{u.role}</Badge>
                                                        <Badge variant={u.subscription?.status === 'active' ? 'default' : u.subscription?.status === 'exempt' ? 'secondary' : 'outline'} className="text-[10px] capitalize">
                                                            {u.subscription?.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap items-center">
                                                <div className="hidden lg:block text-right mr-4">
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Plano Atual</p>
                                                    <p className="text-xs font-medium">{u.subscription?.plan === 'free' ? 'Free/Trial' : 'Mensal R$ 29,90'}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-9 px-3 text-xs gap-2 border-primary/20 hover:bg-primary/5"
                                                    onClick={() => handleUpdateUserSub(u.email, { status: 'courtesy', plan: 'free', courtesyEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() })}
                                                >
                                                    <Gift className="h-4 w-4 text-primary" /> Cortesia 30d
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-9 px-3 text-xs gap-2 border-green-200 hover:bg-green-50"
                                                    onClick={() => handleUpdateUserSub(u.email, { status: 'exempt', plan: 'yearly', isExempt: true })}
                                                >
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Isentar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-9 px-3 text-xs gap-2 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleUpdateUserSub(u.email, { status: 'inactive' })}
                                                >
                                                    <Ban className="h-4 w-4" /> Bloquear
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {allUsers.length === 0 && (
                                        <div className="text-center py-20 bg-muted/10 rounded-lg border-2 border-dashed">
                                            <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-3" />
                                            <p className="text-muted-foreground">Nenhum administrador ou diretor registrado no DB global.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando painel...</div>}>
            <SettingsContent />
        </Suspense>
    )
}
