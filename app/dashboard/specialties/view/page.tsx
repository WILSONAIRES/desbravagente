"use client"

export const runtime = 'edge'

import React, { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { specialties, specialtyCategories, getSpecialtyImage } from "@/data/specialties"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Wand2, FileText } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GenerationModal } from "@/components/generation/generation-modal"
import { FullExamModal } from "@/components/generation/full-exam-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityStudentManager } from "@/components/club/activity-student-manager"

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

    useEffect(() => {
        if (!specialtyId) {
            setNotFound(true)
            return
        }

        const found = specialties.find((s) => s.id === specialtyId)
        if (!found) {
            setNotFound(true)
            return
        }

        setSpecialty(found)
        setCategory(specialtyCategories.find(c => c.id === found.category))
    }, [specialtyId])

    if (notFound) {
        return (
            <div className="text-center py-10">
                <h1 className="text-xl font-bold">Especialidade não encontrada</h1>
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
                                        // Se ainda não tentou o JPG, tenta
                                        if (img.src.endsWith('.png')) {
                                            const cleanCode = specialty.code?.toLowerCase().replace(/-/g, "")
                                            img.src = `https://mda.wiki.br/site/@imgs_wiki_cp/imagem@${cleanCode}.jpg`
                                        } else {
                                            // Se o JPG também falhar, usa o fallback final
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
                    {specialty.requirements.length > 0 && (
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
                    <TabsTrigger value="management">Gestão de Alunos</TabsTrigger>
                </TabsList>

                <TabsContent value="requirements" className="mt-6">

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Requisitos</CardTitle>
                            {specialty.requirements.length > 0 && (
                                <Button onClick={() => setExamModalOpen(true)} variant="default">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Gerar Prova Completa
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {specialty.requirements.length > 0 ? (
                                specialty.requirements.map((req: { id: string; description: string }) => (
                                    <div
                                        key={req.id}
                                        className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm text-muted-foreground">
                                                {req.id.toUpperCase()}
                                            </p>
                                            <p>{req.description}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="shrink-0"
                                            onClick={() => handleGenerateContent(req.id, req.description)}
                                        >
                                            <Wand2 className="mr-2 h-3 w-3" />
                                            Gerar
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Requisitos ainda não cadastrados para esta especialidade.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="management" className="mt-6">
                    <ActivityStudentManager
                        activityId={specialty.id}
                        activityName={specialty.name}
                        type="specialty"
                        requirements={specialty.requirements}
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
