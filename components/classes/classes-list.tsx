"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { classes as staticClasses } from "@/data/classes"
import { storageService } from "@/services/storage-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Loader2 } from "lucide-react"

export function ClassesList() {
    const [classes, setClasses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadClasses()
    }, [])

    const loadClasses = async () => {
        setIsLoading(true)
        try {
            const dbClasses = await storageService.getClasses()
            if (dbClasses && dbClasses.length > 0) {
                setClasses(dbClasses)
            } else {
                setClasses(staticClasses)
            }
        } catch (err) {
            console.error("Failed to load classes:", err)
            setClasses(staticClasses)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Carregando classes...</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
                <Link key={cls.id} href={`/dashboard/classes/view?id=${cls.id}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-l-4" style={{ borderLeftColor: cls.color }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{cls.name}</CardTitle>
                            <Badge variant={cls.type === 'regular' ? "default" : "secondary"}>
                                {cls.type === 'regular' ? 'Regular' : 'Avançada'}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Idade mínima: {cls.minAge} anos
                            </p>
                            <div className="flex items-center text-sm font-medium text-primary">
                                Ver requisitos <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
