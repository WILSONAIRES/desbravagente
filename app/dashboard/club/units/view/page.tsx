"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { storageService } from "@/services/storage-service"
import { Member, Unit } from "@/types/clube"
import { specialties, getSpecialtyImage } from "@/data/specialties"
import { classes } from "@/data/classes"
import { Button } from "@/components/ui/button"
import { Plus, Users, ArrowLeft, ArrowRight, MoreHorizontal, User as UserIcon, Calendar, CheckCircle2, Search, Edit2, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { Badge } from "@/components/ui/badge"

function UnitDetailsContent() {
    const searchParams = useSearchParams()
    const unitId = searchParams.get("id")

    const [unit, setUnit] = useState<Unit | null>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [open, setOpen] = useState(false)
    const [newMemberName, setNewMemberName] = useState("")
    const [newMemberBirth, setNewMemberBirth] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    // Edit unit state
    const [editUnitOpen, setEditUnitOpen] = useState(false)
    const [editUnitName, setEditUnitName] = useState("")

    // Edit member state
    const [editMemberOpen, setEditMemberOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<Member | null>(null)
    const [editMemberName, setEditMemberName] = useState("")
    const [editMemberBirth, setEditMemberBirth] = useState("")

    useEffect(() => {
        if (!unitId) return
        loadData()
    }, [unitId])

    const loadData = async () => {
        if (!unitId) return
        setIsLoading(true)
        try {
            const [currentUnit, unitMembers] = await Promise.all([
                storageService.getUnitById(unitId),
                storageService.getMembers(unitId)
            ])
            setUnit(currentUnit || null)
            if (currentUnit) setEditUnitName(currentUnit.name)
            setMembers(unitMembers)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditUnit = async () => {
        if (!unit || !editUnitName.trim() || !unitId) return
        await storageService.saveUnit({ ...unit, name: editUnitName })
        setEditUnitOpen(false)
        await loadData()
    }

    const openEditMemberDialog = (member: Member) => {
        setEditingMember(member)
        setEditMemberName(member.name)
        setEditMemberBirth(member.dateOfBirth)
        setEditMemberOpen(true)
    }

    const handleEditMember = async () => {
        if (!editingMember || !editMemberName.trim() || !editMemberBirth) return
        await storageService.saveMember({
            ...editingMember,
            name: editMemberName,
            dateOfBirth: editMemberBirth
        })
        setEditMemberOpen(false)
        setEditingMember(null)
        await loadData()
    }

    const handleDeleteMember = async (id: string) => {
        if (confirm("Deseja realmente excluir este desbravador? Todo o progresso será perdido.")) {
            await storageService.deleteMember(id)
            await loadData()
        }
    }

    const handleAddMember = async () => {
        if (!newMemberName.trim() || !newMemberBirth || !unitId) return

        const newMember: Member = {
            id: crypto.randomUUID(),
            name: newMemberName,
            dateOfBirth: newMemberBirth,
            unitId: unitId,
            progress: []
        }

        await storageService.saveMember(newMember)
        setNewMemberName("")
        setNewMemberBirth("")
        setOpen(false)
        await loadData()
    }

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Carregando unidade...</div>
    if (!unit) return <div className="p-8 text-center">Unidade não encontrada.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/club">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-primary">{unit.name}</h1>
                        <Dialog open={editUnitOpen} onOpenChange={setEditUnitOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Editar Nome da Unidade</DialogTitle>
                                    <DialogDescription>
                                        Altere o nome da unidade {unit.name}.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="unit-name">Nome da Unidade</Label>
                                        <Input
                                            id="unit-name"
                                            value={editUnitName}
                                            onChange={(e) => setEditUnitName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditUnitOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleEditUnit}>Salvar Alterações</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <p className="text-muted-foreground">Gerencie os membros desta unidade.</p>
                </div>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar desbravador..." className="pl-8" />
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Cadastrar Desbravador
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Desbravador</DialogTitle>
                            <DialogDescription>
                                Cadastre um novo membro na unidade {unit.name}. Apenas Nome e Data de Nascimento são necessários (LGPD).
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    placeholder="Nome do desbravador"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="birth">Data de Nascimento</Label>
                                <Input
                                    id="birth"
                                    type="date"
                                    value={newMemberBirth}
                                    onChange={(e) => setNewMemberBirth(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button onClick={handleAddMember}>Salvar Desbravador</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Data Nasc.</TableHead>
                            <TableHead>Classes/Espec.</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {member.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-3.3 w-3.5" />
                                        {new Date(member.dateOfBirth).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2 flex-wrap">
                                        {member.progress.length > 0 ? (
                                            member.progress.map(p => {
                                                const spec = p.type === 'specialty' ? specialties.find(s => s.id === p.id) : null
                                                const cls = p.type === 'class' ? classes.find(c => c.id === p.id) : null
                                                const name = spec?.name || cls?.name || p.id

                                                return (
                                                    <Badge key={p.id} variant="secondary" className="text-[10px] flex items-center gap-1.5 px-1.5 h-6">
                                                        {spec && (
                                                            <img
                                                                src={getSpecialtyImage(spec.code)}
                                                                className="w-3 h-3 object-contain"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "https://mda.wiki.br/site/@imgs/ico_especialidade_dbv.svg"
                                                                }}
                                                            />
                                                        )}
                                                        <span className="max-w-[100px] truncate">{name}</span>
                                                    </Badge>
                                                )
                                            })
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Nenhuma ativa</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">Ativo</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            onClick={() => openEditMemberDialog(member)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteMember(member.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/dashboard/club/members/view?id=${member.id}`}>
                                            <Button variant="ghost" size="sm" className="hidden md:flex">
                                                Progresso
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {members.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        Nenhum desbravador cadastrado nesta unidade.
                    </div>
                )}
            </div>

            {/* Edit Member Dialog */}
            <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Cadastro do Desbravador</DialogTitle>
                        <DialogDescription>
                            Atualize os dados básicos do membro.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-m-name">Nome Completo</Label>
                            <Input
                                id="edit-m-name"
                                value={editMemberName}
                                onChange={(e) => setEditMemberName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-m-birth">Data de Nascimento</Label>
                            <Input
                                id="edit-m-birth"
                                type="date"
                                value={editMemberBirth}
                                onChange={(e) => setEditMemberBirth(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setEditMemberOpen(false); setEditingMember(null); }}>Cancelar</Button>
                        <Button onClick={handleEditMember}>Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export default function UnitDetailsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
            <UnitDetailsContent />
        </Suspense>
    );
}
