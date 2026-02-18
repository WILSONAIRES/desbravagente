"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { classes } from "@/data/classes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { RequirementsList } from "@/components/classes/requirements-list";
import { GenerationModal } from "@/components/generation/generation-modal";
import { storageService } from "@/services/storage-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityStudentManager } from "@/components/club/activity-student-manager";
import { Pencil, Save, X, RefreshCw } from "lucide-react";

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

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await (await import("@/lib/supabase")).supabase.auth.getUser();
            if (user) {
                const { data } = await (await import("@/lib/supabase")).supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
                setIsAdmin(data?.role === 'admin');
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
                found = classes.find(c => c.id === id);
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

    const [selectedParentDesc, setSelectedParentDesc] = useState<string | undefined>(undefined);

    const handleGenerateContent = (id: string, description: string, parentDescription?: string) => {
        setSelectedReq({ id, description });
        setSelectedParentDesc(parentDescription);
        setModalOpen(true);
    };

    const updateRequirementText = (sectionIndex: number, reqIndex: number, text: string) => {
        const newSections = [...editedSections];
        newSections[sectionIndex].requirements[reqIndex].description = text;
        setEditedSections(newSections);
    };

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
                        <div className="space-y-8">
                            {editedSections.map((section, sIdx) => (
                                <div key={sIdx} className="space-y-4">
                                    <h3 className="font-bold text-lg border-b pb-2">{section.title}</h3>
                                    <div className="grid gap-4">
                                        {section.requirements.map((req, rIdx) => (
                                            <div key={req.id} className="flex flex-col gap-2 p-4 border rounded-lg bg-card">
                                                <span className="text-xs font-mono text-muted-foreground">{req.id.toUpperCase()}</span>
                                                <textarea
                                                    className="w-full min-h-[80px] p-2 rounded border bg-background text-sm resize-y"
                                                    value={req.description}
                                                    onChange={(e) => updateRequirementText(sIdx, rIdx, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
        <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
            <ClassDetailsContent />
        </Suspense>
    );
}
