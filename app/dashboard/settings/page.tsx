"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
    Save,
    CheckCircle2,
    Users,
    Loader2
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { storageService } from "@/services/storage-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"

function SettingsContent() {
    const searchParams = useSearchParams()
    const { user, updateProfile } = useAuth()
    const [name, setName] = useState(user?.name || "")
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")
    const [status, setStatus] = useState<"idle" | "saved" | "loading">("idle")

    // Admin specific state
    const [allUsers, setAllUsers] = useState<any[]>([])
    const isAdmin = user?.role === 'admin' || user?.email === 'waisilva@gmail.com'

    useEffect(() => {
        const tab = searchParams.get("tab")
        if (tab) setActiveTab(tab)
    }, [searchParams])

    useEffect(() => {
        if (user) setName(user.name)
        if (isAdmin) {
            loadAllUsers()
        }
    }, [user, isAdmin])

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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Painel de Controle</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid w-full max-w-[500px] ${isAdmin ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
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

                {isAdmin && (
                    <TabsContent value="users" className="space-y-4 pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Users className="h-5 w-5" />
                                    Usuários
                                </CardTitle>
                                <CardDescription>Lista de usuários registrados no sistema.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y">
                                    {allUsers.map((u) => (
                                        <div key={u.email} className="py-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 ring-2 ring-muted">
                                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                        {u.name?.substring(0, 2).toUpperCase() || "??"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold flex items-center gap-2">
                                                        {u.name}
                                                        {u.role === 'admin' && <Badge className="bg-amber-500 scale-75 origin-left">Admin</Badge>}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{u.email}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] uppercase">{u.role}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {allUsers.length === 0 && (
                                        <div className="text-center py-20 bg-muted/10 rounded-lg border-2 border-dashed">
                                            <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-3" />
                                            <p className="text-muted-foreground">Nenhum usuário registrado.</p>
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
