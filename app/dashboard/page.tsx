"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { storageService } from "@/services/storage-service"
import { Member } from "@/types/clube"
import { specialties, getSpecialtyImage } from "@/data/specialties"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cake, BookOpen, Users, Award, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [members, setMembers] = useState<Member[]>([])
    const [unitsCount, setUnitsCount] = useState(0)
    const [clubName, setClubName] = useState("Meu Clube")
    const [isEditingName, setIsEditingName] = useState(false)
    const [tempName, setTempName] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadDashboardData() {
            setIsLoading(true)
            try {
                const [membersData, unitsData, clubNameData] = await Promise.all([
                    storageService.getMembers(),
                    storageService.getUnits(),
                    storageService.getClubName()
                ])
                setMembers(membersData)
                setUnitsCount(unitsData.length)
                setClubName(clubNameData)
            } catch (err) {
                console.error("Dashboard load error:", err)
            } finally {
                setIsLoading(false)
            }
        }

        if (user === null && !authLoading) {
            router.push("/login")
            return
        }

        if (user) loadDashboardData()
        else if (user === null && !authLoading) setIsLoading(false)
    }, [user, authLoading, router])

    const handleSaveName = async () => {
        if (tempName.trim()) {
            await storageService.saveClubName(tempName.trim())
            setClubName(tempName.trim())
            setIsEditingName(false)
            // Force reload to ensure consistency
            const newName = await storageService.getClubName()
            setClubName(newName)
        }
    }

    const getUpcomingBirthdays = () => {
        const today = new Date()
        const fourteenDaysLater = new Date()
        fourteenDaysLater.setDate(today.getDate() + 14)

        return members.filter(m => {
            const dob = new Date(m.dateOfBirth)
            const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate())

            if (birthdayThisYear < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                birthdayThisYear.setFullYear(today.getFullYear() + 1)
            }

            return birthdayThisYear >= today && birthdayThisYear <= fourteenDaysLater
        }).sort((a, b) => {
            const dobA = new Date(a.dateOfBirth)
            const dobB = new Date(b.dateOfBirth)
            return dobA.getMonth() - dobB.getMonth() || dobA.getDate() - dobB.getDate()
        })
    }

    const getSpecialtiesInProgress = () => {
        const inProgressMap = new Map<string, { specialty: any, members: { id: string, name: string, progress: number }[] }>()

        members.forEach(member => {
            member.progress.filter(p => p.type === 'specialty' && p.status === 'in-progress').forEach(p => {
                const spec = specialties.find(s => s.id === p.id)
                if (!spec) return

                if (!inProgressMap.has(p.id)) {
                    inProgressMap.set(p.id, { specialty: spec, members: [] })
                }

                const total = spec.requirements.length
                const completed = p.requirements.length
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0

                inProgressMap.get(p.id)?.members.push({
                    id: member.id,
                    name: member.name,
                    progress: percent
                })
            })
        })

        return Array.from(inProgressMap.values())
    }

    const upcomingBirthdays = getUpcomingBirthdays()
    const activeSpecialties = getSpecialtiesInProgress()

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Carregando dados do clube...</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 group">
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                            <Input
                                value={tempName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempName(e.target.value)}
                                className="text-3xl font-bold h-12 w-[300px]"
                                autoFocus
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === 'Enter') handleSaveName()
                                    if (e.key === 'Escape') setIsEditingName(false)
                                }}
                            />
                            <Button size="sm" onClick={handleSaveName}>Salvar</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>Cancelar</Button>
                        </div>
                    ) : (
                        <>
                            <h1
                                className="text-3xl font-bold tracking-tight cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                                onClick={() => {
                                    setTempName(clubName)
                                    setIsEditingName(true)
                                }}
                            >
                                {clubName}
                            </h1>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Clique para editar
                            </span>
                        </>
                    )}
                </div>
                <p className="text-muted-foreground">
                    Bem-vindo, {user?.name || "Diretor"}! Aqui está o que está acontecendo no seu clube.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dashboard/club/members" className="block outline-none focus:ring-2 focus:ring-ring rounded-xl">
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{members.length}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Ver todos os desbravadores →</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/club" className="block outline-none focus:ring-2 focus:ring-ring rounded-xl">
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Unidades</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{unitsCount}</div>
                            <p className="text-[10px] text-muted-foreground mt-1">Gerenciar unidades e desbravadores →</p>
                        </CardContent>
                    </Card>
                </Link>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Especialidades Ativas</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSpecialties.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Cake className="h-5 w-5 text-pink-500" />
                            <CardTitle>Aniversariantes</CardTitle>
                        </div>
                        <CardDescription>Próximos 14 dias</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingBirthdays.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center italic">
                                    Nenhum aniversário nos próximos 14 dias.
                                </p>
                            ) : (
                                upcomingBirthdays.map(m => {
                                    const dob = new Date(m.dateOfBirth)
                                    return (
                                        <div key={m.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">
                                                    {m.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link
                                                        href={`/dashboard/club/members/view?id=${m.id}`}
                                                        className="text-sm font-medium leading-none hover:underline hover:text-primary transition-colors"
                                                    >
                                                        {m.name}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {dob.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-50 border-pink-100">
                                                {new Date().getFullYear() - dob.getFullYear()} anos
                                            </Badge>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            <CardTitle>Especialidades em Foco</CardTitle>
                        </div>
                        <CardDescription>Acompanhamento de progresso atual</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {activeSpecialties.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center italic">
                                    Nenhuma especialidade em andamento no momento.
                                </p>
                            ) : (
                                activeSpecialties.map(item => (
                                    <div key={item.specialty.id} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/dashboard/specialties/view?id=${item.specialty.id}`}
                                                className="flex items-center gap-3 group"
                                            >
                                                <div className="h-8 w-8 shrink-0 rounded bg-muted flex items-center justify-center overflow-hidden border">
                                                    <img
                                                        src={getSpecialtyImage(item.specialty.code)}
                                                        alt={item.specialty.name}
                                                        className="w-full h-full object-contain p-0.5"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://mda.wiki.br/site/@imgs/ico_especialidade_dbv.svg"
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold group-hover:underline">
                                                        {item.specialty.name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {item.members.length} {item.members.length === 1 ? 'aluno' : 'alunos'} participando
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="grid gap-2 pl-2 border-l-2 border-muted">
                                            {item.members.map((m, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-xs">
                                                    <Link
                                                        href={`/dashboard/club/members/view?id=${m.id}`}
                                                        className="text-muted-foreground hover:underline hover:text-primary transition-colors"
                                                    >
                                                        {m.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="font-medium">{m.progress}%</span>
                                                        <div className="w-16">
                                                            <Progress value={m.progress} className="h-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                    {activeSpecialties.length > 0 && (
                        <div className="p-4 bg-muted/20 border-t mt-auto">
                            <Link href="/dashboard/specialties" className="text-xs text-primary flex items-center justify-center gap-1 hover:underline">
                                Ver todas as especialidades <ChevronRight className="h-3 w-3" />
                            </Link>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
