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
import { Pencil, Save, X, RefreshCw, Plus, Trash2, ChevronRight, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const RequirementEditorItem = ({ requirement, onUpdate, onRemove, level = 0 }: { requirement: any, onUpdate: (req: any) => void, onRemove: () => void, level?: number }) => {
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ ...requirement, description: e.target.value });
    };

    const handleToggleGeneration = (checked: boolean) => {
        onUpdate({ ...requirement, noGeneration: !checked });
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
                    value={requirement.description}
                    onChange={handleDescriptionChange}
                    placeholder="Descreva o requisito..."
                />

                <div className="flex justify-end">
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
                            onUpdate={(updated) => handleUpdateSub(idx, updated)}
                            onRemove={() => handleRemoveSub(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

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
    const [isSaving, setIsSaving] = useState(false);
    const [selectedParentDesc, setSelectedParentDesc] = useState<string | undefined>(undefined);

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

    useEffect(() => {
        if (!id) {
            setNotFound(true);
            return;
        }

        const loadClass = async () => {
            const dbClasses = await storageService.getClasses();
            let found = dbClasses.find(c => c.id === id);

            if (!found) {
                // Tentativa de carregar do estático para migração inicial
                found = (classes as any[]).find((c: any) => c.id === id);
                if (found) {
                    console.log("Classe carregada do estático (ainda não migrada)");
                }
            }

            if (!found) {
                setNotFound(true);
            } else {
                setCurrentClass(found);
                setEditedSections(JSON.parse(JSON.stringify(found.sections || [])));
            }
        };

        loadClass();
    }, [id]);

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

    if (notFound) {
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
                            {editedSections.map((section, sIdx) => (
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
                                                key={rIdx}
                                                requirement={req}
                                                onUpdate={(updatedReq: any) => {
                                                    const newSections = [...editedSections];
                                                    newSections[sIdx].requirements[rIdx] = updatedReq;
                                                    setEditedSections(newSections);
                                                }}
                                                onRemove={() => {
                                                    const newSections = [...editedSections];
                                                    newSections[sIdx].requirements = newSections[sIdx].requirements.filter((_: any, i: number) => i !== rIdx);
                                                    setEditedSections(newSections);
                                                }}
                                            />
                                        ))}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-dashed"
                                            onClick={() => {
                                                const newSections = [...editedSections];
                                                const newId = `req-${Date.now()}`;
                                                newSections[sIdx].requirements = [
                                                    ...(newSections[sIdx].requirements || []),
                                                    { id: newId, description: "Novo Requisito", noGeneration: false, subRequirements: [] }
                                                ];
                                                setEditedSections(newSections);
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
