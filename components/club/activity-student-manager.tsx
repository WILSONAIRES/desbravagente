"use client"

import { useState, useEffect } from "react"
import { storageService } from "@/services/storage-service"
import { Member, ProgressItem, RequirementProgress } from "@/types/clube"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Users,
    Plus,
    Search,
    CheckSquare,
    Square,
    ChevronDown,
    ChevronUp,
    User as UserIcon,
    Trash2
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface ActivityStudentManagerProps {
    activityId: string
    activityName: string
    type: 'class' | 'specialty'
    requirements: any[] // PathfinderClass.sections or Specialty.requirements
}

export function ActivityStudentManager({
    activityId,
    activityName,
    type,
    requirements
}: ActivityStudentManagerProps) {
    const [enrolledMembers, setEnrolledMembers] = useState<Member[]>([])
    const [availableMembers, setAvailableMembers] = useState<Member[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedMember, setExpandedMember] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [activityId])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const allMembers = await storageService.getMembers()
            const enrolled = allMembers.filter(m =>
                m.progress.some(p => p.id === activityId)
            )
            const available = allMembers.filter(m =>
                !m.progress.some(p => p.id === activityId)
            )

            setEnrolledMembers(enrolled)
            setAvailableMembers(available)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEnroll = async (memberId: string) => {
        const member = await storageService.getMemberById(memberId)
        if (!member) return

        const newProgress: ProgressItem = {
            id: activityId,
            type: type,
            status: 'in-progress',
            startDate: new Date(),
            requirements: []
        }

        const updatedMember = {
            ...member,
            progress: [...member.progress, newProgress]
        }

        await storageService.saveMember(updatedMember)
        await loadData()
    }

    const handleUnenroll = async (memberId: string) => {
        const member = await storageService.getMemberById(memberId)
        if (!member) return

        const updatedMember = {
            ...member,
            progress: member.progress.filter(p => p.id !== activityId)
        }

        await storageService.saveMember(updatedMember)
        await loadData()
    }

    const toggleRequirement = async (memberId: string, reqId: string) => {
        const member = await storageService.getMemberById(memberId)
        if (!member) return

        const updatedProgress = member.progress.map(p => {
            if (p.id === activityId) {
                const existingReq = p.requirements.find(r => r.requirementId === reqId)
                let newReqs: RequirementProgress[]

                if (existingReq) {
                    newReqs = p.requirements.filter(r => r.requirementId !== reqId)
                } else {
                    newReqs = [...p.requirements, { requirementId: reqId, completed: true, completedDate: new Date() }]
                }
                return { ...p, requirements: newReqs }
            }
            return p
        })

        const updatedMember = { ...member, progress: updatedProgress }
        await storageService.saveMember(updatedMember)

        // Update local state for immediate feedback
        setEnrolledMembers(prev => prev.map(m =>
            m.id === memberId ? updatedMember : m
        ))
    }

    const toggleBulkRequirements = async (memberId: string, reqIds: string[]) => {
        const member = await storageService.getMemberById(memberId)
        if (!member) return

        const updatedProgress = member.progress.map(p => {
            if (p.id === activityId) {
                const allSelected = reqIds.every(id => p.requirements.some(r => r.requirementId === id))
                const shouldSelect = !allSelected

                let newReqs = [...p.requirements]
                if (shouldSelect) {
                    reqIds.forEach(id => {
                        if (!newReqs.some(r => r.requirementId === id)) {
                            newReqs.push({ requirementId: id, completed: true, completedDate: new Date() })
                        }
                    })
                } else {
                    newReqs = newReqs.filter(r => !reqIds.includes(r.requirementId))
                }
                return { ...p, requirements: newReqs }
            }
            return p
        })

        const updatedMember = { ...member, progress: updatedProgress }
        await storageService.saveMember(updatedMember)

        setEnrolledMembers(prev => prev.map(m =>
            m.id === memberId ? updatedMember : m
        ))
    }

    const getMemberProgress = (member: Member) => {
        const p = member.progress.find(item => item.id === activityId)
        if (!p) return 0

        let total = 0
        if (type === 'class') {
            total = (requirements as any[]).reduce((acc, s) => acc + (s.requirements?.length || 0), 0)
        } else {
            total = requirements.length
        }

        if (total === 0) return 0
        return Math.round((p.requirements.length / total) * 100)
    }

    const filteredAvailable = availableMembers.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading && enrolledMembers.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Carregando gestão de alunos...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquisar desbravador para inscrever..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && filteredAvailable.length > 0 && (
                        <Card className="absolute z-10 w-full mt-1 shadow-lg max-h-60 overflow-y-auto">
                            <CardContent className="p-0">
                                {filteredAvailable.map(m => (
                                    <div
                                        key={m.id}
                                        className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer group border-b last:border-0"
                                        onClick={() => {
                                            handleEnroll(m.id)
                                            setSearchTerm("")
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{m.name}</span>
                                        </div>
                                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            Inscrever
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    {enrolledMembers.length} {enrolledMembers.length === 1 ? 'desbravador inscrito' : 'desbravadores inscritos'}
                </div>
            </div>

            <div className="grid gap-4">
                {enrolledMembers.length === 0 ? (
                    <Card className="border-dashed py-12 flex flex-col items-center justify-center text-center">
                        <Users className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                        <h3 className="text-lg font-medium">Nenhum desbravador inscrito</h3>
                        <p className="text-muted-foreground">
                            Pesquise um desbravador acima para começar a gerenciar o progresso nesta atividade.
                        </p>
                    </Card>
                ) : (
                    enrolledMembers.map(member => {
                        const progress = getMemberProgress(member)
                        const memberProgress = member.progress.find(p => p.id === activityId)
                        const isExpanded = expandedMember === member.id

                        return (
                            <Card key={member.id} className="overflow-hidden">
                                <CardHeader className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setExpandedMember(isExpanded ? null : member.id)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UserIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{member.name}</CardTitle>
                                                <CardDescription>
                                                    Iniciado em {new Date(memberProgress?.startDate || "").toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                                                <span className="text-xs font-medium">{progress}%</span>
                                                <Progress value={progress} className="h-1.5" />
                                            </div>
                                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </div>
                                    </div>
                                </CardHeader>
                                {isExpanded && (
                                    <CardContent className="p-0 border-t bg-muted/30">
                                        <div className="divide-y max-h-[300px] overflow-y-auto">
                                            {type === 'class' ? (
                                                (requirements as any[]).map(section => {
                                                    const sectionReqIds = (section.requirements || []).map((r: any) => r.id)
                                                    const allDone = sectionReqIds.length > 0 && sectionReqIds.every((id: string) => memberProgress?.requirements.some(r => r.requirementId === id))

                                                    return (
                                                        <div key={section.title} className="p-4">
                                                            <div className="flex items-center justify-between mb-3 border-b border-muted pb-1">
                                                                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{section.title}</h4>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-1.5 text-[9px] uppercase font-bold text-muted-foreground hover:text-primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        toggleBulkRequirements(member.id, sectionReqIds)
                                                                    }}
                                                                >
                                                                    {allDone ? 'Desmarcar Tópico' : 'Marcar Tópico'}
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-2 ml-2">
                                                                {(section.requirements || []).map((req: any) => {
                                                                    const isDone = memberProgress?.requirements.some(r => r.requirementId === req.id)
                                                                    return (
                                                                        <div
                                                                            key={req.id}
                                                                            className="flex items-start gap-3 group cursor-pointer"
                                                                            onClick={() => toggleRequirement(member.id, req.id)}
                                                                        >
                                                                            <div className="mt-1">
                                                                                {isDone ? (
                                                                                    <CheckSquare className="h-4 w-4 text-primary" />
                                                                                ) : (
                                                                                    <Square className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                                )}
                                                                            </div>
                                                                            <span className={`text-sm ${isDone ? 'text-muted-foreground line-through decoration-primary/50' : ''}`}>
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
                                                <div className="p-4 space-y-3">
                                                    <div className="flex items-center justify-end mb-4 border-b border-muted pb-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 px-1.5 text-[9px] uppercase font-bold text-muted-foreground hover:text-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                toggleBulkRequirements(member.id, requirements.map((r: any) => r.id))
                                                            }}
                                                        >
                                                            {requirements.every((req: any) => memberProgress?.requirements.some(r => r.requirementId === req.id)) ? 'Desmarcar Tudo' : 'Marcar Tudo'}
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {requirements.map((req: any) => {
                                                            const isDone = memberProgress?.requirements.some(r => r.requirementId === req.id)
                                                            return (
                                                                <div
                                                                    key={req.id}
                                                                    className="flex items-start gap-3 group cursor-pointer"
                                                                    onClick={() => toggleRequirement(member.id, req.id)}
                                                                >
                                                                    <div className="mt-1">
                                                                        {isDone ? (
                                                                            <CheckSquare className="h-4 w-4 text-primary" />
                                                                        ) : (
                                                                            <Square className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                        )}
                                                                    </div>
                                                                    <span className={`text-sm ${isDone ? 'text-muted-foreground line-through decoration-primary/50' : ''}`}>
                                                                        {req.description}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 bg-muted border-t flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive text-xs h-8"
                                                onClick={() => handleUnenroll(member.id)}
                                            >
                                                <Trash2 className="mr-2 h-3.3 w-3.5" />
                                                Remover do Progresso
                                            </Button>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
