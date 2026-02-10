"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { storageService } from "@/services/storage-service"
import { Unit, Member } from "@/types/clube"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, ArrowRight, Edit2, Trash2 } from "lucide-react"
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

export default function ClubPage() {
    const [units, setUnits] = useState<Unit[]>([])
    const [allMembers, setAllMembers] = useState<Member[]>([])
    const [newUnitName, setNewUnitName] = useState("")
    const [open, setOpen] = useState(false)
    const [clubName, setClubName] = useState("Meu Clube")
    const [isLoading, setIsLoading] = useState(true)

    // Edit state
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const [editUnitName, setEditUnitName] = useState("")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [unitsData, membersData, clubNameData] = await Promise.all([
                storageService.getUnits(),
                storageService.getMembers(),
                storageService.getClubName()
            ])
            setUnits(unitsData)
            setAllMembers(membersData)
            setClubName(clubNameData)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddUnit = async () => {
        if (!newUnitName.trim()) return

        const newUnit: Unit = {
            id: crypto.randomUUID(),
            name: newUnitName,
        }

        await storageService.saveUnit(newUnit)
        setNewUnitName("")
        setOpen(false)
        await loadData()
    }

    const openEditDialog = (e: React.MouseEvent, unit: Unit) => {
        e.preventDefault()
        e.stopPropagation()
        setEditingUnit(unit)
        setEditUnitName(unit.name)
        setEditOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingUnit || !editUnitName.trim()) return
        await storageService.saveUnit({ ...editingUnit, name: editUnitName })
        setEditOpen(false)
        setEditingUnit(null)
        await loadData()
    }

    const handleDeleteUnit = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (confirm("Deseja realmente excluir esta unidade? Membros vinculados ficarão órfãos.")) {
            await storageService.deleteUnit(id)
            await loadData()
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Carregando unidades...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">{clubName}</h1>
                    <p className="text-muted-foreground">
                        Gerencie as unidades e acompanhe o progresso dos desbravadores.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Unidade
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Nova Unidade</DialogTitle>
                            <DialogDescription>
                                Digite o nome da unidade para começar a cadastrar desbravadores.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome da Unidade</Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Águia, Sentinelas..."
                                    value={newUnitName}
                                    onChange={(e) => setNewUnitName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button onClick={handleAddUnit}>Salvar Unidade</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Unidade</DialogTitle>
                            <DialogDescription>
                                Atualize o nome da unidade.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Nome da Unidade</Label>
                                <Input
                                    id="edit-name"
                                    value={editUnitName}
                                    onChange={(e) => setEditUnitName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {units.map((unit) => {
                    const memberCount = allMembers.filter(m => m.unitId === unit.id).length
                    return (
                        <Link key={unit.id} href={`/dashboard/club/units/view?id=${unit.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary group">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="truncate">{unit.name}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                onClick={(e) => openEditDialog(e, unit)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={(e) => handleDeleteUnit(e, unit.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground ml-1" />
                                        </div>
                                    </CardTitle>
                                    <CardDescription>Unidade do Clube</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            {memberCount} {memberCount === 1 ? 'Membro' : 'Membros'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}

                {units.length === 0 && (
                    <Card className="col-span-full border-dashed p-12 flex flex-col items-center justify-center text-center">
                        <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">Nenhuma unidade cadastrada</h3>
                        <p className="text-muted-foreground mb-4">
                            Comece criando sua primeira unidade para gerenciar seu clube.
                        </p>
                        <Button variant="outline" onClick={() => setOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Unidade
                        </Button>
                    </Card>
                )}
            </div>
        </div >
    )
}
