"use client"

import React, { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { specialties as staticSpecialties, specialtyCategories, getSpecialtyImage } from "@/data/specialties"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Wand2, FileText, RefreshCw, Pencil, Save, X, Trash2, Plus, Sparkles, ArrowUp, ArrowDown, Award, Search } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GenerationModal } from "@/components/generation/generation-modal"
import { FullExamModal } from "@/components/generation/full-exam-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityStudentManager } from "@/components/club/activity-student-manager"
import { storageService } from "@/services/storage-service"
import { supabase } from "@/lib/supabase"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// ---------- Specialty Search Dialog (same UX as classes view) ----------
const SpecialtySearchDialog = ({
    specialties,
    selectedId,
    onSelect
}: {
    specialties: any[],
    selectedId?: string | null,
    onSelect: (id: string | undefined) => void
}) => {
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const filtered = specialties.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code?.toLowerCase().includes(search.toLowerCase())
    )

    const selected = specialties.find(s => s.id === selectedId)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-[11px] justify-start px-2 font-normal w-full max-w-xs">
                    <Award className="mr-2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {selected ? (
                        <span className="truncate">{selected.name}</span>
                    ) : (
                        <span className="text-muted-foreground">Vincular Especialidade PrÃ©-requisito...</span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Especialidade PrÃ©-requisito</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome ou cÃ³digo..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm h-9"
                            onClick={() => { onSelect(undefined); setIsOpen(false) }}
                        >
                            <X className="mr-2 h-4 w-4 text-muted-foreground" />
                            Nenhuma (Remover vÃ­nculo)
                        </Button>
                        {filtered.map((s) => (
                            <Button
                                key={s.id}
                                variant={selectedId === s.id ? "secondary" : "ghost"}
                                className="w-full justify-start text-sm h-9 px-3"
                                onClick={() => { onSelect(s.id); setIsOpen(false) }}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                    <span className="font-mono text-[10px] text-muted-foreground">{s.code}</span>
                                    <span className="truncate">{s.name}</span>
                                </div>
                            </Button>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center py-6 text-sm text-muted-foreground">
                                Nenhuma especialidade encontrada.
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ---------- Requirement Editor Item ----------
const RequirementEditorItem = ({ requirement, onUpdate, onRemove, onMoveUp, onMoveDown, isFirst = false, isLast = false, level = 0, allSpecialties = [] }: { requirement: any, onUpdate: (req: any) => void, onRemove: () => void, onMoveUp?: () => void, onMoveDown?: () => void, isFirst?: boolean, isLast?: boolean, level?: number, allSpecialties?: any[] }) => {
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ ...requirement, description: e.target.value });
    };

    const handleToggleGeneration = (checked: boolean) => {
        onUpdate({ ...requirement, noGeneration: !checked });
    };

    const handleSpecialtyChange = (id: string | undefined) => {
        onUpdate({ ...requirement, linkedSpecialtyId: id ?? null });
    };

    const handleAddSub = () => {
        const newId = `${requirement.id}-${Date.now()}`;
        const updated = {
            ...requirement,
            subRequirements: [
                ...(requirement.subRequirements || []),
                { id: newId, description: "Novo Sub-item", noGeneration: false, subRequirements: [] }
            ]
        };
        onUpdate(updated);
    };

    const handleUpdateSub = (subIdx: number, updatedSub: any) => {
        const newSubs = [...(requirement.subRequirements || [])];
        newSubs[subIdx] = updatedSub;
        onUpdate({ ...requirement, subRequirements: newSubs });
    };

    const handleRemoveSub = (subIdx: number) => {
        const newSubs = (requirement.subRequirements || []).filter((_: any, i: number) => i !== subIdx);
        onUpdate({ ...requirement, subRequirements: newSubs });
    };

    const handleMoveSub = (subIdx: number, direction: 'up' | 'down') => {
        const newSubs = [...(requirement.subRequirements || [])];
        const targetIdx = direction === 'up' ? subIdx - 1 : subIdx + 1;
        if (targetIdx >= 0 && targetIdx < newSubs.length) {
            [newSubs[subIdx], newSubs[targetIdx]] = [newSubs[targetIdx], newSubs[subIdx]];
            onUpdate({ ...requirement, subRequirements: newSubs });
        }
    };

    return (
        <div className={`space-y-3 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-primary/20 bg-primary/5 p-3 rounded-lg' : ''}`}>
            <div className="flex flex-col gap-3 p-4 border rounded-xl bg-card shadow-sm group/req">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{requirement.id}</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor={`gen-${requirement.id}`} className="text-[10px] uppercase font-bold text-muted-foreground">ConteÃºdo IA</Label>
                            <Switch
                                id={`gen-${requirement.id}`}
                                checked={!requirement.noGeneration}
                                onCheckedChange={handleToggleGeneration}
                                className="scale-75"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover/req:opacity-100 transition-opacity disabled:hidden" onClick={onMoveUp} disabled={isFirst} title="Subir">
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover/req:opacity-100 transition-opacity disabled:hidden" onClick={onMoveDown} disabled={isLast} title="Descer">
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover/req:opacity-100 transition-opacity" onClick={onRemove}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <textarea
                    className="w-full min-h-[60px] p-3 rounded-lg border bg-background text-sm resize-y focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                    value={requirement.description}
                    onChange={handleDescriptionChange}
                    placeholder="Descreva o requisito..."
                />

                <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap shrink-0">PrÃ©-requisito</Label>
                        <SpecialtySearchDialog
                            specialties={allSpecialties}
                            selectedId={requirement.linkedSpecialtyId}
                            onSelect={handleSpecialtyChange}
                        />
                    </div>

                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold h-7 hover:bg-primary/10 text-primary" onClick={handleAddSub}>
                        <Plus className="mr-1 h-3 w-3" />
                        Adicionar Sub-item
                    </Button>
                </div>
            </div>

            {requirement.subRequirements?.length > 0 && (
                <div className="space-y-3">
                    {requirement.subRequirements.map((sub: any, idx: number) => (
                        <RequirementEditorItem
                            key={idx}
                            requirement={sub}
                            level={level + 1}
                            isFirst={idx === 0}
                            isLast={idx === (requirement.subRequirements || []).length - 1}
                            onUpdate={(updated) => handleUpdateSub(idx, updated)}
                            onRemove={() => handleRemoveSub(idx)}
                            onMoveUp={() => handleMoveSub(idx, 'up')}
                            onMoveDown={() => handleMoveSub(idx, 'down')}
                            allSpecialties={allSpecialties}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

function SpecialtyDetailsContent() {
    const searchParams = useSearchParams()
    const specialtyId = searchParams.get("id")

    const [specialty, setSpecialty] = useState<any>(null)
    const [category, setCategory] = useState<any>(null)
    const [notFound, setNotFound] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [examModalOpen, setExamModalOpen] = useState(false)
    const [selectedReq, setSelectedReq] = useState<{ id: string, description: string } | null>(null)
    const [activeTab, setActiveTab] = useState("requirements")
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedRequirements, setEditedRequirements] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [allSpecialties, setAllSpecialties] = useState<any[]>(staticSpecialties)

    // Load all specialties from DB (for prerequisite picker/badge)
    useEffect(() => {
        storageService.getSpecialties().then((dbSpecialties) => {
            if (dbSpecialties && dbSpecialties.length > 0) {
                // Merge DB specialties with any static ones not yet in DB
                const dbIds = new Set(dbSpecialties.map((s: any) => s.id))
                const staticOnly = staticSpecialties.filter(s => !dbIds.has(s.id))
                setAllSpecialties([...dbSpecialties, ...staticOnly])
            }
        }).catch(() => { /* fallback to staticSpecialties already set */ })
    }, [])

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
                    setIsAdmin(profile?.role === 'admin' || user.email === 'waisilva@gmail.com')
                }
            } catch (err) {
                console.error("Error checking admin status:", err)
            }
        }
        checkAdmin()
    }, [])

    useEffect(() => {
        if (!specialtyId) {
            setNotFound(true)
            setIsLoading(false)
            return
        }

        const loadSpecialty = async () => {
            try {
                let found = await storageService.getSpecialtyById(specialtyId)

                if (!found) {
                    found = staticSpecialties.find((s) => s.id === specialtyId)
                    if (found) {
                        console.log("Especialidade carregada do estÃ¡tico (ainda nÃ£o migrada)")
                    }
                }

                if (!found) {
                    setNotFound(true)
                } else {
                    setSpecialty(found)
                    setEditedRequirements(JSON.parse(JSON.stringify(found.requirements || [])))
                    setCategory(specialtyCategories.find(c => c.id === found.category))
                }
            } catch (err) {
                console.error("Error loading specialty:", err)
                setNotFound(true)
            } finally {
                setIsLoading(false)
            }
        }

        loadSpecialty()
    }, [specialtyId])

    const handleSaveRequirements = async () => {
        if (!specialty) return
        setIsSaving(true)
        try {
            const updated = { ...specialty, requirements: editedRequirements }
            await storageService.saveSpecialty(updated)
            setSpecialty(updated)
            setIsEditing(false)
            alert("Especialidade atualizada com sucesso!")
        } catch (err: any) {
            console.error("Erro ao salvar especialidade:", err)
            alert(`Erro ao salvar especialidade: ${err.message || 'Erro desconhecido'}`)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="h-8 w-8 animate-spin text-primary opacity-20" />
                <p className="text-muted-foreground text-sm">Carregando detalhes...</p>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="text-center py-10">
                <h1 className="text-xl font-bold">Especialidade nÃ£o encontrada</h1>
                <Link href="/dashboard/specialties">
                    <Button className="mt-4">Voltar</Button>
                </Link>
            </div>
        )
    }

    if (!specialty) return null

    const handleGenerateContent = (id: string, description: string) => {
        setSelectedReq({ id, description })
        setModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/specialties">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-4">
                            <div className="shrink-0 w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
                                <img
                                    src={getSpecialtyImage(specialty.code)}
                                    alt={specialty.name}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                        const img = e.target as HTMLImageElement
                                        // Se ainda nÃ£o tentou o JPG, tenta
                                        if (img.src.endsWith('.png')) {
                                            const cleanCode = specialty.code?.toLowerCase().replace(/-/g, "")
                                            img.src = `https://mda.wiki.br/site/@imgs_wiki_cp/imagem@${cleanCode}.jpg`
                                        } else {
                                            // Se o JPG tambÃ©m falhar, usa o fallback final
                                            img.src = "https://mda.wiki.br/site/@imgs/ico_especialidade_dbv.svg"
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                    {specialty.name}
                                    <Badge className={specialty.color}>{category?.name}</Badge>
                                </h1>
                                <p className="text-muted-foreground">
                                    {category?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {isAdmin && (
                        !isEditing ? (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar Requisitos
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                                <Button size="sm" onClick={handleSaveRequirements} disabled={isSaving}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSaving ? "Salvando..." : "Salvar AlteraÃ§Ãµes"}
                                </Button>
                            </>
                        )
                    )}
                    {!isEditing && specialty.requirements?.length > 0 && (
                        <Button onClick={() => setExamModalOpen(true)} variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Gerar Prova Completa
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-sm grid-cols-2">
                    <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    <TabsTrigger value="management">GestÃ£o de Alunos</TabsTrigger>
                </TabsList>

                <TabsContent value="requirements" className="mt-6">
                    {isEditing ? (
                        <div className="space-y-6">
                            {editedRequirements.map((req, idx) => (
                                <RequirementEditorItem
                                    key={idx}
                                    requirement={req}
                                    isFirst={idx === 0}
                                    isLast={idx === editedRequirements.length - 1}
                                    onUpdate={(updated) => {
                                        const newReqs = [...editedRequirements];
                                        newReqs[idx] = updated;
                                        setEditedRequirements(newReqs);
                                    }}
                                    onRemove={() => {
                                        setEditedRequirements(editedRequirements.filter((_, i) => i !== idx));
                                    }}
                                    onMoveUp={() => {
                                        const newReqs = [...editedRequirements];
                                        if (idx > 0) {
                                            [newReqs[idx], newReqs[idx - 1]] = [newReqs[idx - 1], newReqs[idx]];
                                            setEditedRequirements(newReqs);
                                        }
                                    }}
                                    onMoveDown={() => {
                                        const newReqs = [...editedRequirements];
                                        if (idx < newReqs.length - 1) {
                                            [newReqs[idx], newReqs[idx + 1]] = [newReqs[idx + 1], newReqs[idx]];
                                            setEditedRequirements(newReqs);
                                        }
                                    }}
                                    allSpecialties={allSpecialties}
                                />
                            ))}
                            <Button
                                variant="outline"
                                className="w-full h-16 border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary transition-all bg-card/30"
                                onClick={() => {
                                    const newId = `req-${Date.now()}`;
                                    setEditedRequirements([
                                        ...editedRequirements,
                                        { id: newId, description: "Novo Requisito", noGeneration: false, subRequirements: [] }
                                    ]);
                                }}
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Adicionar Novo Requisito
                            </Button>
                        </div>
                    ) : (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Requisitos</CardTitle>
                                {specialty.requirements?.length > 0 && (
                                    <Button onClick={() => setExamModalOpen(true)} variant="default">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Gerar Prova Completa
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {specialty.requirements?.length > 0 ? (
                                    specialty.requirements.map((req: any) => (
                                        <div
                                            key={req.id}
                                            className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <p className="font-medium text-sm text-muted-foreground uppercase tracking-widest">
                                                    {req.id}
                                                </p>
                                                <p className="text-sm md:text-base leading-relaxed">{req.description}</p>

                                                {/* Prerequisite specialty link */}
                                                {req.linkedSpecialtyId && (() => {
                                                    const linked = allSpecialties.find((s: any) => s.id === req.linkedSpecialtyId)
                                                    return linked ? (
                                                        <Link href={`/dashboard/specialties/view?id=${linked.id}`} className="inline-flex">
                                                            <Badge variant="secondary" className="mt-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-colors py-1 px-2 cursor-pointer">
                                                                <Award className="mr-1.5 h-3 w-3" />
                                                                PrÃ©-requisito: {linked.name}
                                                            </Badge>
                                                        </Link>
                                                    ) : null
                                                })()}

                                                {req.subRequirements?.length > 0 && (
                                                    <div className="mt-4 ml-4 pl-4 border-l-2 border-primary/20 space-y-3">
                                                        {req.subRequirements.map((sub: any) => (
                                                            <div key={sub.id} className="text-sm">
                                                                <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-tighter mb-1">{sub.id}</p>
                                                                <p className="opacity-90">{sub.description}</p>

                                                                {/* Prerequisite specialty link for sub requirements */}
                                                                {sub.linkedSpecialtyId && (() => {
                                                                    const linked = allSpecialties.find((s: any) => s.id === sub.linkedSpecialtyId)
                                                                    return linked ? (
                                                                        <Link href={`/dashboard/specialties/view?id=${linked.id}`} className="inline-flex">
                                                                            <Badge variant="secondary" className="mt-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-colors py-1 px-2 cursor-pointer">
                                                                                <Award className="mr-1.5 h-3 w-3" />
                                                                                Pré-requisito: {linked.name}
                                                                            </Badge>
                                                                        </Link>
                                                                    ) : null
                                                                })()}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2 shrink-0">
                                                {!req.noGeneration && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        className="shrink-0"
                                                        onClick={() => handleGenerateContent(req.id, req.description)}
                                                    >
                                                        <Sparkles className="mr-2 h-3 w-3" />
                                                        Gerar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Requisitos ainda nÃ£o cadastrados para esta especialidade.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="management" className="mt-6">
                    <ActivityStudentManager
                        activityId={specialty.id}
                        activityName={specialty.name}
                        type="specialty"
                        requirements={specialty.requirements}
                        onGenerateClick={handleGenerateContent}
                    />
                </TabsContent>
            </Tabs>

            {selectedReq && (
                <GenerationModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    requirementId={selectedReq.id}
                    requirementDescription={selectedReq.description}
                    className={specialty.name}
                    type="specialty"
                />
            )}

            <FullExamModal
                open={examModalOpen}
                onOpenChange={setExamModalOpen}
                specialtyName={specialty.name}
                requirements={specialty.requirements}
            />
        </div>
    )
}


export default function SpecialtyDetailsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
            <SpecialtyDetailsContent />
        </Suspense>
    );
}
