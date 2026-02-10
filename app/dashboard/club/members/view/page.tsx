"use client"

export const runtime = 'edge'

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { storageService } from "@/services/storage-service"
import { Member, ProgressItem, RequirementProgress } from "@/types/clube"
import { classes, PathfinderClass } from "@/data/classes"
import { specialties, specialtyCategories, getSpecialtyImage, Specialty } from "@/data/specialties"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    Award,
    BookOpen,
    Plus,
    Trash2,
    CheckSquare,
    Square
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

function MemberProfileContent() {
    const searchParams = useSearchParams()
    const memberId = searchParams.get("id")

    const [member, setMember] = useState<Member | null>(null)
    const [activeTab, setActiveTab] = useState("classes")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedId, setSelectedId] = useState("")
    const [selectedType, setSelectedType] = useState<'class' | 'specialty'>('class')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!memberId) return
        loadMember()
    }, [memberId])

    const loadMember = async () => {
        if (!memberId) return
        setIsLoading(true)
        try {
            const m = await storageService.getMemberById(memberId)
            setMember(m || null)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddProgress = async () => {
        if (!member || !selectedId) return

        // Check if already exists
        if (member.progress.some(p => p.id === selectedId)) {
            setIsAddDialogOpen(false)
            return
        }

        const newProgress: ProgressItem = {
            id: selectedId,
            type: selectedType,
            status: 'in-progress',
            startDate: new Date(),
            requirements: []
        }

        const updatedMember = {
            ...member,
            progress: [...member.progress, newProgress]
        }

        await storageService.saveMember(updatedMember)
        setMember(updatedMember)
        setIsAddDialogOpen(false)
    }

    const toggleRequirement = async (progressId: string, reqId: string) => {
        if (!member) return

        const updatedProgress = member.progress.map(p => {
            if (p.id === progressId) {
                const existingReq = p.requirements.find(r => r.requirementId === reqId)
                let newReqs: RequirementProgress[]

                if (existingReq) {
                    newReqs = p.requirements.filter(r => r.requirementId !== reqId)
                } else {
                    newReqs = [...p.requirements, { requirementId: reqId, completed: true, completedDate: new Date() }]
                }

                return { ...p, status: newReqs.length > 0 ? 'in-progress' : 'in-progress' as const, requirements: newReqs }
            }
            return p
        })

        const updatedMember = { ...member, progress: updatedProgress }
        await storageService.saveMember(updatedMember)
        setMember(updatedMember)
    }

    const toggleBulkRequirements = async (progressId: string, reqIds: string[], forceState?: boolean) => {
        if (!member) return

        const updatedProgress = member.progress.map(p => {
            if (p.id === progressId) {
                // Determine if we should select all or deselect all
                const allSelected = reqIds.every(id => p.requirements.some(r => r.requirementId === id))
                const shouldSelect = forceState !== undefined ? forceState : !allSelected

                let newReqs = [...p.requirements]

                if (shouldSelect) {
                    // Add only missing ones
                    reqIds.forEach(id => {
                        if (!newReqs.some(r => r.requirementId === id)) {
                            newReqs.push({ requirementId: id, completed: true, completedDate: new Date() })
                        }
                    })
                } else {
                    // Remove all from the list
                    newReqs = newReqs.filter(r => !reqIds.includes(r.requirementId))
                }

                return { ...p, requirements: newReqs }
            }
            return p
        })

        const updatedMember = { ...member, progress: updatedProgress }
        await storageService.saveMember(updatedMember)
        setMember(updatedMember)
    }

    const removeProgress = async (id: string) => {
        if (!member) return
        const updatedMember = {
            ...member,
            progress: member.progress.filter(p => p.id !== id)
        }
        await storageService.saveMember(updatedMember)
        setMember(updatedMember)
    }

    const calculateProgress = (progressId: string, type: 'class' | 'specialty') => {
        if (!member) return 0
        const p = member.progress.find(item => item.id === progressId)
        if (!p) return 0

        let total = 0
        if (type === 'class') {
            const cls = classes.find(c => c.id === progressId)
            total = cls?.sections.reduce((acc, s) => acc + s.requirements.length, 0) || 0
        } else {
            const spec = specialties.find(s => s.id === progressId)
            total = spec?.requirements.length || 0
        }

        if (total === 0) return 0
        return Math.round((p.requirements.length / total) * 100)
    }

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Carregando perfil...</div>
    if (!member) return <div className="p-8 text-center">Desbravador não encontrado.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/club/units/view?id=${member.unitId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">{member.name}</h1>
                    <p className="text-muted-foreground">
                        Nascido em {new Date(member.dateOfBirth).toLocaleDateString()} • {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()} anos
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Iniciar Nova Atividade
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nova Classe ou Especialidade</DialogTitle>
                            <DialogDescription>
                                Selecione o que o desbravador está começando a estudar agora.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Tipo</Label>
                                <Select value={selectedType} onValueChange={(v: any) => { setSelectedType(v); setSelectedId(""); }}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="class">Classe</SelectItem>
                                        <SelectItem value="specialty">Especialidade</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>{selectedType === 'class' ? 'Classe' : 'Especialidade'}</Label>
                                <Select value={selectedId} onValueChange={setSelectedId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {selectedType === 'class' ? (
                                            classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)
                                        ) : (
                                            specialties.slice(0, 100).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleAddProgress} disabled={!selectedId}>Começar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="classes" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Classes
                    </TabsTrigger>
                    <TabsTrigger value="specialties" className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Especialidades
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-6">
                    {member.progress
                        .filter(p => p.type === (activeTab === 'classes' ? 'class' : 'specialty'))
                        .map((p) => {
                            const data = activeTab === 'classes'
                                ? classes.find(c => c.id === p.id)
                                : specialties.find(s => s.id === p.id)

                            if (!data) return null
                            const percent = calculateProgress(p.id, p.type)

                            return (
                                <Card key={p.id} className="overflow-hidden">
                                    <CardHeader className="bg-muted/30 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {activeTab === 'specialties' && (
                                                    <div className="h-10 w-10 shrink-0 rounded bg-background flex items-center justify-center overflow-hidden border">
                                                        <img
                                                            src={getSpecialtyImage((data as Specialty).code)}
                                                            alt={data.name}
                                                            className="w-full h-full object-contain p-0.5"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "https://mda.wiki.br/site/@imgs/ico_especialidade_dbv.svg"
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="space-y-1">
                                                    <CardTitle className="text-xl flex items-center gap-2">
                                                        <Link
                                                            href={`/dashboard/${activeTab === 'classes' ? 'classes' : 'specialties'}/view?id=${data.id}`}
                                                            className="hover:underline hover:text-primary transition-colors cursor-pointer"
                                                        >
                                                            {data.name}
                                                        </Link>
                                                        {percent === 100 && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Iniciado em {new Date(p.startDate).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeProgress(p.id)} className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>Progresso</span>
                                                <span>{percent}%</span>
                                            </div>
                                            <Progress value={percent} className="h-2" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y max-h-[400px] overflow-y-auto">
                                            {activeTab === 'classes' ? (
                                                (data as PathfinderClass).sections.map(section => {
                                                    const sectionReqIds = section.requirements.map(r => r.id)
                                                    const allSectionDone = sectionReqIds.every(id => p.requirements.some(r => r.requirementId === id))

                                                    return (
                                                        <div key={section.title} className="p-4 bg-muted/10">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h4 className="font-semibold text-sm text-primary">{section.title}</h4>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors"
                                                                    onClick={() => toggleBulkRequirements(p.id, sectionReqIds)}
                                                                >
                                                                    {allSectionDone ? 'Desmarcar Tópico' : 'Marcar Tópico'}
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-2 ml-2">
                                                                {section.requirements.map(req => {
                                                                    const isDone = p.requirements.some(r => r.requirementId === req.id)
                                                                    return (
                                                                        <div
                                                                            key={req.id}
                                                                            className="flex items-start gap-3 group cursor-pointer"
                                                                            onClick={() => toggleRequirement(p.id, req.id)}
                                                                        >
                                                                            <div className="mt-1">
                                                                                {isDone ? (
                                                                                    <CheckSquare className="h-4 w-4 text-primary" />
                                                                                ) : (
                                                                                    <Square className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                                )}
                                                                            </div>
                                                                            <span className={`text-sm ${isDone ? 'text-muted-foreground line-through' : ''}`}>
                                                                                {req.description}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <div className="p-4">
                                                    <div className="flex items-center justify-end mb-4 border-b pb-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors"
                                                            onClick={() => toggleBulkRequirements(p.id, (data as Specialty).requirements.map(r => r.id))}
                                                        >
                                                            {(data as Specialty).requirements.every(req => p.requirements.some(r => r.requirementId === req.id)) ? 'Desmarcar Todas' : 'Marcar Todas'}
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {(data as Specialty).requirements.map(req => {
                                                            const isDone = p.requirements.some(r => r.requirementId === req.id)
                                                            return (
                                                                <div
                                                                    key={req.id}
                                                                    className="flex items-start gap-3 group cursor-pointer"
                                                                    onClick={() => toggleRequirement(p.id, req.id)}
                                                                >
                                                                    <div className="mt-1">
                                                                        {isDone ? (
                                                                            <CheckSquare className="h-4 w-4 text-primary" />
                                                                        ) : (
                                                                            <Square className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                        )}
                                                                    </div>
                                                                    <span className={`text-sm ${isDone ? 'text-muted-foreground line-through' : ''}`}>
                                                                        {req.description}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}

                    {member.progress.filter(p => p.type === (activeTab === 'classes' ? 'class' : 'specialty')).length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Plus className="mx-auto h-8 w-8 text-muted-foreground opacity-20 mb-3" />
                            <p className="text-muted-foreground">Nenhuma {activeTab === 'classes' ? 'classe' : 'especialidade'} em andamento.</p>
                            <Button variant="link" onClick={() => setIsAddDialogOpen(true)}>Clique aqui para pesquisar e começar.</Button>
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    )
}


export default function MemberProfilePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
            <MemberProfileContent />
        </Suspense>
    );
}
