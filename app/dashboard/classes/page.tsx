"use client";

import { useEffect, useState } from "react"
import { ClassesList } from "@/components/classes/classes-list"
import { Button } from "@/components/ui/button"
import { storageService } from "@/services/storage-service"
import { classes as staticClasses } from "@/data/classes"
import { useAuth } from "@/contexts/auth-context"
import { Database, Loader2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"

export default function ClassesPage() {
    const { user } = useAuth()
    const [isMigrating, setIsMigrating] = useState(false)
    const [isMigrated, setIsMigrated] = useState<boolean | null>(null)
    const isAdmin = user?.role === 'admin' || user?.email === 'waisilva@gmail.com'

    useEffect(() => {
        if (isAdmin) {
            checkMigration()
        }
    }, [isAdmin])

    const checkMigration = async () => {
        try {
            const migrated = await storageService.isDataMigrated()
            setIsMigrated(migrated)
        } catch (err) {
            console.error("Migration check failed:", err)
            setIsMigrated(false)
        }
    }

    const handleMigrate = async () => {
        setIsMigrating(true)
        try {
            await storageService.migrateClassesFromStatic(staticClasses)
            setIsMigrated(true)
            // Trigger a refresh of the page or list if needed
            window.location.reload()
        } catch (err) {
            console.error(err)
            alert("Erro na migração. Verifique o console ou a conexão com o Supabase.")
        } finally {
            setIsMigrating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
                    <p className="text-muted-foreground">
                        Selecione uma classe para visualizar seus requisitos e gerar conteúdo.
                    </p>
                </div>

                {isAdmin && isMigrated === false && (
                    <Card className="border-primary/50 bg-primary/5 shadow-md max-w-sm">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm flex items-center gap-2 text-primary font-bold">
                                <Database className="h-4 w-4" />
                                Migração Necessária
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 px-4">
                            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                                Detectamos que as classes ainda não foram migradas para o Supabase Cloud.
                                Migre para habilitar a edição e persistência dinâmica.
                            </p>
                        </CardContent>
                        <div className="p-4 pt-0">
                            <Button
                                size="sm"
                                className="w-full h-8 text-[11px] font-bold"
                                onClick={handleMigrate}
                                disabled={isMigrating}
                            >
                                {isMigrating ? (
                                    <>
                                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                        Sincronizando...
                                    </>
                                ) : (
                                    "Migrar Dados para Supabase"
                                )}
                            </Button>
                        </div>
                    </Card>
                )}

                {isAdmin && isMigrated === true && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-xs font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Sincronizado com Nuvem
                    </div>
                )}
            </div>

            <ClassesList />
        </div>
    )
}
