"use client"

import Link from "next/link"
import { classes } from "@/data/classes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function ClassesList() {
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
