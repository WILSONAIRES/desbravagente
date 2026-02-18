"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { storageService } from "@/services/storage-service"
import { Member, Unit } from "@/types/clube"
import { Button } from "@/components/ui/button"
import {
    Plus,
    ArrowLeft,
    ArrowRight,
    User as UserIcon,
    Calendar,
    Search,
    Edit2,
    Trash2,
    Users
} from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [units, setUnits] = useState<Unit[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUnit, setSelectedUnit] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(true)

    // Add member state
    const [open, setOpen] = useState(false)
    const [newName, setNewName] = useState("")
    const [newBirth, setNewBirth] = useState("")
    const [newUnitId, setNewUnitId] = useState<string>("none")

    // Edit member state
    const [editOpen, setEditOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<Member | null>(null)
    const [editName, setEditName] = useState("")
    const [editBirth, setEditBirth] = useState("")
    const [editUnitId, setEditUnitId] = useState<string>("none")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [membersData, unitsData] = await Promise.all([
                storageService.getMembers(),
                storageService.getUnits()
            ])
            setMembers(membersData)
            setUnits(unitsData)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddMember = async () => {
        if (!newName.trim() || !newBirth) return

        const newMember: Member = {
            id: crypto.randomUUID(),
            name: newName,
            dateOfBirth: newBirth,
            unitId: newUnitId === "none" ? undefined : newUnitId,
            progress: []
        }

        await storageService.saveMember(newMember)
        setNewName("")
        setNewBirth("")
        setNewUnitId("none")
        setOpen(false)
        await loadData()
    }

    const openEditDialog = (member: Member) => {
        setEditingMember(member)
        setEditName(member.name)
        setEditBirth(member.dateOfBirth)
        setEditUnitId(member.unitId || "none")
        setEditOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingMember || !editName.trim() || !editBirth) return

        const updatedMember: Member = {
            ...editingMember,
            name: editName,
            dateOfBirth: editBirth,
            unitId: editUnitId === "none" ? undefined : editUnitId
        }

        await storageService.saveMember(updatedMember)
        setEditOpen(false)
        setEditingMember(null)
        await loadData()
    }

    const handleDeleteMember = async (id: string) => {
        if (confirm("Deseja realmente excluir este desbravador? Todo o progresso será perdido.")) {
            await storageService.deleteMember(id)
            await loadData()
        }
    }

    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesUnit = selectedUnit === "all" ||
            (selectedUnit === "none" && !m.unitId) ||
            m.unitId === selectedUnit
        return matchesSearch && matchesUnit
    })

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Carregando desbravadores...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Todos os Desbravadores</h1>
                        <p className="text-muted-foreground">Gerencie o cadastro de todos os membros do clube.</p>
                    </div>
                </div>
                <Users className="h-8 w-8 text-primary opacity-20 hidden md:block" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-[200px]">
                        <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por Unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Unidades</SelectItem>
                                <SelectItem value="none">Sem Unidade</SelectItem>
                                {units.map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Cadastro
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Cadastrar Desbravador</DialogTitle>
                                <DialogDescription>
                                    Adicione um novo membro ao clube. Ele pode ou não ser vinculado a uma unidade agora.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nome do desbravador"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birth">Data de Nascimento</Label>
                                    <Input
                                        id="birth"
                                        type="date"
                                        value={newBirth}
                                        onChange={(e) => setNewBirth(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Unidade (Opcional)</Label>
                                    <Select value={newUnitId} onValueChange={setNewUnitId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma unidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhuma / Sem Unidade</SelectItem>
                                            {units.map(u => (
                                                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                                <Button onClick={handleAddMember}>Salvar Cadastro</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead>Data Nasc.</TableHead>
                            <TableHead>Atividades</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => {
                            const unitName = units.find(u => u.id === member.unitId)?.name || "Sem Unidade"
                            return (
                                <TableRow key={member.id} className="group">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {member.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={member.unitId ? "outline" : "secondary"}>
                                            {unitName}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-muted-foreground text-xs">
                                            <Calendar className="mr-2 h-3.5 w-3.5" />
                                            {new Date(member.dateOfBirth).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1.5">
                                            {member.progress.filter(p => p.type === 'class').length > 0 && (
                                                <Badge variant="secondary" className="h-6 px-2 text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-100">
                                                    {member.progress.filter(p => p.type === 'class').length} Classe(s)
                                                </Badge>
                                            )}
                                            {member.progress.filter(p => p.type === 'specialty').length > 0 && (
                                                <Badge variant="secondary" className="h-6 px-2 text-[10px] font-bold bg-amber-50 text-amber-700 border-amber-100">
                                                    {member.progress.filter(p => p.type === 'specialty').length} Espec.
                                                </Badge>
                                            )}
                                            {member.progress.length === 0 && (
                                                <span className="text-[10px] text-muted-foreground italic">Nenhuma ativa</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={() => openEditDialog(member)}
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
                            )
                        })}
                    </TableBody>
                </Table>
                {filteredMembers.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                        <Users className="h-10 w-10 opacity-10" />
                        <p>Nenhum desbravador encontrado.</p>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Cadastro</DialogTitle>
                        <DialogDescription>
                            Atualize os dados básicos do desbravador.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nome Completo</Label>
                            <Input
                                id="edit-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-birth">Data de Nascimento</Label>
                            <Input
                                id="edit-birth"
                                type="date"
                                value={editBirth}
                                onChange={(e) => setEditBirth(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-unit">Unidade</Label>
                            <Select value={editUnitId} onValueChange={setEditUnitId}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhuma / Sem Unidade</SelectItem>
                                    {units.map(u => (
                                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setEditOpen(false); setEditingMember(null); }}>Cancelar</Button>
                        <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
