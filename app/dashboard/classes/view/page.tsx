"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { classes } from "@/data/classes";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { RequirementsList } from "@/components/classes/requirements-list";
import { GenerationModal } from "@/components/generation/generation-modal";
import { storageService } from "@/services/storage-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityStudentManager } from "@/components/club/activity-student-manager";
import { Pencil, Save, X, RefreshCw, Plus, Trash2, ChevronRight, Sparkles, Award, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const SpecialtySearchDialog = ({
    specialties,
    selectedId,
    onSelect
}: {
    specialties: any[],
    selectedId?: string,
    onSelect: (id: string | undefined) => void
}) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filtered = specialties.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code?.toLowerCase().includes(search.toLowerCase())
    );

    const selected = specialties.find(s => s.id === selectedId);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-[11px] justify-start px-2 font-normal w-full max-w-[200px]">
                    <Award className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    {selected ? (
                        <span className="truncate">{selected.name}</span>
                    ) : (
                        <span className="text-muted-foreground">Vincular Especialidade...</span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Vincular Especialidade</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome ou código..."
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
                            onClick={() => {
                                onSelect(undefined);
                                setIsOpen(false);
                            }}
                        >
                            <X className="mr-2 h-4 w-4 text-muted-foreground" />
                            Nenhuma (Remover vínculo)
                        </Button>
                        {filtered.map((s) => (
                            <Button
                                key={s.id}
                                variant={selectedId === s.id ? "secondary" : "ghost"}
                                className="w-full justify-start text-sm h-9 px-3"
                                onClick={() => {
                                    onSelect(s.id);
                                    setIsOpen(false);
                                }}
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
    );
};

const RequirementEditorItem = React.memo(({ requirement, onUpdate, onRemove, specialties = [], level = 0 }: { requirement: any, onUpdate: (req: any) => void, onRemove: () => void, specialties?: any[], level?: number }) => {
    const [localDescription, setLocalDescription] = useState(requirement.description);

    // Sync local state when requirement changes from outside (e.g. undo/save)
    useEffect(() => {
        setLocalDescription(requirement.description);
    }, [requirement.description]);

    const handleDescriptionBlur = () => {
        if (localDescription !== requirement.description) {
            onUpdate({ ...requirement, description: localDescription });
        }
    };

    const handleToggleGeneration = (checked: boolean) => {
        onUpdate({ ...requirement, noGeneration: !checked });
    };

    const handleSpecialtyChange = (id: string | undefined) => {
        onUpdate({ ...requirement, linkedSpecialtyId: id });
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

    const handleUpdateSub = React.useCallback((subIdx: number, updatedSub: any) => {
        const newSubs = [...(requirement.subRequirements || [])];
        newSubs[subIdx] = updatedSub;
        onUpdate({ ...requirement, subRequirements: newSubs });
    }, [requirement, onUpdate]);

    const handleRemoveSub = React.useCallback((subIdx: number) => {
        const newSubs = (requirement.subRequirements || []).filter((_: any, i: number) => i !== subIdx);
        onUpdate({ ...requirement, subRequirements: newSubs });
    }, [requirement, onUpdate]);

    return (
        <div className={`space-y-3 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-primary/20 bg-primary/5 p-3 rounded-lg' : ''}`}>
            <div className="flex flex-col gap-3 p-4 border rounded-xl bg-card shadow-sm group/req">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{requirement.id}</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor={`gen-${requirement.id}`} className="text-[10px] uppercase font-bold text-muted-foreground">Conteúdo IA</Label>
                            <Switch
                                id={`gen-${requirement.id}`}
                                checked={!requirement.noGeneration}
                                onCheckedChange={handleToggleGeneration}
                                className="scale-75"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive opacity-0 group-hover/req:opacity-100 transition-opacity"
                            onClick={onRemove}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <textarea
                    className="w-full min-h-[60px] p-3 rounded-lg border bg-background text-sm resize-y focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                    value={localDescription}
                    onChange={(e) => setLocalDescription(e.target.value)}
                    onBlur={handleDescriptionBlur}
                    placeholder="Descreva o requisito..."
                />

                <div className="flex items-center justify-between gap-2 mt-1">
                    <SpecialtySearchDialog
                        specialties={specialties}
                        selectedId={requirement.linkedSpecialtyId}
                        onSelect={handleSpecialtyChange}
                    />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[10px] uppercase font-bold h-7 hover:bg-primary/10 text-primary"
                        onClick={handleAddSub}
                    >
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
                            specialties={specialties}
                            onUpdate={(updated) => handleUpdateSub(idx, updated)}
                            onRemove={() => handleRemoveSub(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});
RequirementEditorItem.displayName = "RequirementEditorItem";

function ClassDetailsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [currentClass, setCurrentClass] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState<{ id: string; description: string } | null>(null);
    const [activeTab, setActiveTab] = useState("requirements");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSections, setEditedSections] = useState<any[]>([]);
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedParentDesc, setSelectedParentDesc] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Load specialties for the editor
                const allSpecialties = await storageService.getSpecialties();
                setSpecialties(allSpecialties);

                if (!id) {
                    setNotFound(true);
                    return;
                }

                const dbClasses = await storageService.getClasses();
                let found = dbClasses.find(c => c.id === id);

                if (!found) {
                    found = (classes as any[]).find((c: any) => c.id === id);
                }

                if (!found) {
                    setNotFound(true);
                } else {
                    setCurrentClass(found);
                    setEditedSections(JSON.parse(JSON.stringify(found.sections || [])));
                }
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };

        loadInitialData();
    }, [id]);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (currentUser) {
                    const { data } = await supabase.from('profiles').select('role').eq('id', currentUser.id).maybeSingle();
                    setIsAdmin(data?.role === 'admin' || currentUser.email === 'waisilva@gmail.com');
                }
            } catch (err) {
                console.error("Error checking admin status:", err);
            }
        };
        checkAdmin();
    }, []);

    const handleMigrate = async () => {
        if (!currentClass) return;
        setIsSaving(true);
        try {
            await storageService.saveClass(currentClass);
            alert("Classe migrada para o banco de dados com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao migrar classe.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveRequirements = async () => {
        if (!currentClass) return;
        setIsSaving(true);
        try {
            const updatedClass = { ...currentClass, sections: editedSections };
            await storageService.saveClass(updatedClass);
            setCurrentClass(updatedClass);
            setIsEditing(false);
            alert("Requisitos atualizados com sucesso!");
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar requisitos.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateContent = (id: string, description: string, parentDescription?: string) => {
        setSelectedReq({ id, description });
        setSelectedParentDesc(parentDescription);
        setModalOpen(true);
    };

    const handleUpdateRequirement = React.useCallback((sIdx: number, rIdx: number, updatedReq: any) => {
        setEditedSections(prev => {
            const newSections = [...prev];
            newSections[sIdx].requirements = [...newSections[sIdx].requirements];
            newSections[sIdx].requirements[rIdx] = updatedReq;
            return newSections;
        });
    }, []);

    const handleRemoveRequirement = React.useCallback((sIdx: number, rIdx: number) => {
        setEditedSections(prev => {
            const newSections = [...prev];
            newSections[sIdx].requirements = newSections[sIdx].requirements.filter((_: any, i: number) => i !== rIdx);
            return newSections;
        });
    }, []);

    if (notFound) {
        // ... existing notFound check ...
        // (skipping for brevity in the tool call)
        // actually I need to provide the full content for the replacement range
        return (
            <div className="text-center py-10">
                <h1 className="text-xl font-bold">Classe não encontrada</h1>
                <Link href="/dashboard/classes">
                    <Button className="mt-4">Voltar</Button>
                </Link>
            </div>
        );
    }

    if (!currentClass) return <div className="p-8 text-center text-muted-foreground">Carregando detalhes da classe...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/classes">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            {currentClass.name}
                            <Badge variant={currentClass.type === "regular" ? "default" : "secondary"}>
                                {currentClass.type === "regular" ? "Regular" : "Avançada"}
                            </Badge>
                        </h1>
                    </div>
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
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
                                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="sm" onClick={handleMigrate} disabled={isSaving} title="Sincronizar com Banco de Dados">
                            <RefreshCw className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-sm grid-cols-2">
                    <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    <TabsTrigger value="management">Gestão de Desbravadores</TabsTrigger>
                </TabsList>

                <TabsContent value="requirements" className="mt-6">
                    {isEditing ? (
                        <div className="space-y-8 pb-20">
                            {editedSections.map((section: any, sIdx: number) => (
                                <div key={sIdx} className="space-y-4 p-6 border-2 border-dashed rounded-xl bg-card/50 relative group/section">
                                    <div className="flex items-center justify-between gap-4 border-b pb-3">
                                        <div className="flex-1">
                                            <input
                                                className="w-full font-bold text-xl bg-transparent border-none focus:ring-0 p-0"
                                                value={section.title}
                                                onChange={(e) => {
                                                    const newSections = [...editedSections];
                                                    newSections[sIdx].title = e.target.value;
                                                    setEditedSections(newSections);
                                                }}
                                                placeholder="Título da Seção"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive opacity-0 group-hover/section:opacity-100 transition-opacity"
                                            onClick={() => {
                                                if (confirm("Excluir esta seção inteira e todos os seus requisitos?")) {
                                                    setEditedSections(editedSections.filter((_, i) => i !== sIdx));
                                                }
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-6 pl-4">
                                        {(section.requirements || []).map((req: any, rIdx: number) => (
                                            <RequirementEditorItem
                                                key={req.id || rIdx}
                                                requirement={req}
                                                specialties={specialties}
                                                onUpdate={(updatedReq: any) => handleUpdateRequirement(sIdx, rIdx, updatedReq)}
                                                onRemove={() => handleRemoveRequirement(sIdx, rIdx)}
                                            />
                                        ))}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-dashed"
                                            onClick={() => {
                                                setEditedSections(prev => {
                                                    const newSections = [...prev];
                                                    const newId = `req-${Date.now()}`;
                                                    newSections[sIdx].requirements = [
                                                        ...(newSections[sIdx].requirements || []),
                                                        { id: newId, description: "Novo Requisito", noGeneration: false, subRequirements: [] }
                                                    ];
                                                    return newSections;
                                                });
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Adicionar Requisito
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                className="w-full h-16 border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary transition-all bg-card/30"
                                onClick={() => {
                                    setEditedSections([
                                        ...editedSections,
                                        { title: "Nova Seção", requirements: [] }
                                    ]);
                                }}
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Adicionar Nova Seção
                            </Button>
                        </div>
                    ) : (
                        <RequirementsList
                            sections={currentClass.sections}
                            onGenerateClick={handleGenerateContent}
                        />
                    )}
                </TabsContent>

                <TabsContent value="management" className="mt-6">
                    <ActivityStudentManager
                        activityId={currentClass.id}
                        activityName={currentClass.name}
                        type="class"
                        requirements={currentClass.sections}
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
                    className={currentClass.name}
                    parentDescription={selectedParentDesc}
                />
            )}
        </div>
    );
}
export default function ClassDetailsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground"><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 opacity-20" />Carregando...</div>}>
            <ClassDetailsContent />
        </Suspense>
    );
}
