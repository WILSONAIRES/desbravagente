"use client";

export const runtime = 'edge'

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { classes } from "@/data/classes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { RequirementsList } from "@/components/classes/requirements-list";
import { GenerationModal } from "@/components/generation/generation-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityStudentManager } from "@/components/club/activity-student-manager";

function ClassDetailsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [currentClass, setCurrentClass] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState<{ id: string; description: string } | null>(null);
    const [activeTab, setActiveTab] = useState("requirements");

    useEffect(() => {
        if (!id) {
            setNotFound(true);
            return;
        }

        const found = classes.find(c => c.id === id);

        if (!found) {
            setNotFound(true);
            return;
        }

        setCurrentClass(found);
    }, [id]);

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

    if (!currentClass) return null;

    const handleGenerateContent = (id: string, description: string) => {
        setSelectedReq({ id, description });
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-sm grid-cols-2">
                    <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    <TabsTrigger value="management">Gestão de Alunos</TabsTrigger>
                </TabsList>

                <TabsContent value="requirements" className="mt-6">
                    <RequirementsList
                        sections={currentClass.sections}
                        onGenerateClick={handleGenerateContent}
                    />
                </TabsContent>

                <TabsContent value="management" className="mt-6">
                    <ActivityStudentManager
                        activityId={currentClass.id}
                        activityName={currentClass.name}
                        type="class"
                        requirements={currentClass.sections}
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
