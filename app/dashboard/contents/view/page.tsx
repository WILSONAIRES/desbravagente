"use client";

export const runtime = 'edge';

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SavedContent, storageService } from "@/services/storage-service";
import { specialties, getSpecialtyImage } from "@/data/specialties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Trash2, Printer, Share2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

function ContentDetailsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [content, setContent] = useState<SavedContent | null>(null);
    const [notFound, setNotFound] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!id) return

        const loadContent = async () => {
            const all = await storageService.getAllContent()
            const item = all.find(c => c.id === id)

            if (!item) {
                setNotFound(true)
                return
            }

            setContent(item)
        }

        loadContent()
    }, [id]);

    if (notFound) {
        return (
            <div className="text-center py-10">
                <h1 className="text-xl font-bold">Conteúdo não encontrado</h1>
                <Link href="/dashboard/contents">
                    <Button className="mt-4">Voltar</Button>
                </Link>
            </div>
        );
    }

    if (!content) return null;

    const handleDelete = () => {
        if (confirm("Tem certeza que deseja excluir este conteúdo permanentemente?")) {
            storageService.deleteContent(content.id);
            router.push("/dashboard/contents");
        }
    };

    const handlePrint = () => window.print();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/contents">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        {content.type === "specialty" && (
                            <div className="h-16 w-16 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
                                <img
                                    src={getSpecialtyImage(
                                        specialties.find(s => content.title.startsWith(s.name))?.code
                                    )}
                                    alt={content.title}
                                    className="w-full h-full object-contain p-1.5"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://mda.wiki.br/site/@imgs/ico_especialidade_dbv.svg";
                                    }}
                                />
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{content.title}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={content.type === "class" ? "default" : "secondary"}>
                                    {content.type === "class" ? "Classe" : "Especialidade"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    Gerado em {new Date(content.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardContent className="p-8">
                    <div className="prose prose-stone dark:prose-invert max-w-none whitespace-pre-wrap">
                        {content.content}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function ContentDetailsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
            <ContentDetailsContent />
        </Suspense>
    );
}
