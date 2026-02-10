"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SavedContent, storageService } from "@/services/storage-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Trash2, ArrowRight } from "lucide-react"

export default function ContentsPage() {
    const [contents, setContents] = useState<SavedContent[]>([])

    useEffect(() => {
        setContents(storageService.getAllContent())
    }, [])

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        if (confirm("Tem certeza que deseja excluir este conteúdo?")) {
            storageService.deleteContent(id)
            setContents(storageService.getAllContent())
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Meus Conteúdos</h1>
                <p className="text-muted-foreground">
                    Histórico de materiais gerados para suas classes e especialidades.
                </p>
            </div>

            {contents.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhum conteúdo salvo</h3>
                    <p className="text-muted-foreground mb-6">
                        Gere materiais através das páginas de Classes ou Especialidades.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/dashboard/classes">
                            <Button>Ir para Classes</Button>
                        </Link>
                        <Link href="/dashboard/specialties">
                            <Button variant="outline">Ir para Especialidades</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {contents.map((item) => (
                        <Link key={item.id} href={`/dashboard/contents/view?id=${item.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={item.type === 'class' ? "default" : "secondary"}>
                                            {item.type === 'class' ? 'Classe' : 'Especialidade'}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                            onClick={(e) => handleDelete(item.id, e)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-lg leading-tight mt-2 line-clamp-2">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-end">
                                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                                        {item.requirementId}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t">
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </div>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
