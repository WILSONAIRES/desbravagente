"use client"

import { useEffect, useState } from "react"
import { storageService } from "@/services/storage-service"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Info } from "lucide-react"

export function TrialUsageCounter() {
    const [usage, setUsage] = useState<{ count: number, limit: number, isTrial: boolean } | null>(null)

    const fetchUsage = async () => {
        const data = await storageService.getTrialUsage()
        setUsage(data)
    }

    useEffect(() => {
        fetchUsage()

        // Listen for custom event to refresh usage when content is generated
        window.addEventListener('content-generated', fetchUsage)
        return () => window.removeEventListener('content-generated', fetchUsage)
    }, [])

    if (!usage || !usage.isTrial) return null

    const percentage = (usage.count / usage.limit) * 100
    const remaining = usage.limit - usage.count

    return (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/80">Período Trial</span>
                </div>
                <div className="cursor-help" title="Durante o teste de 7 dias, você pode gerar até 10 conteúdos por dia.">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-muted-foreground">Créditos diários</span>
                    <span className={remaining <= 2 ? "text-destructive font-bold" : "text-primary"}>
                        {usage.count} / {usage.limit}
                    </span>
                </div>
                <Progress value={percentage} className="h-1.5" />
                {remaining <= 3 && remaining > 0 && (
                    <p className="text-[10px] text-destructive/80 font-medium">
                        Apenas {remaining} restando hoje!
                    </p>
                )}
                {remaining === 0 && (
                    <p className="text-[10px] text-destructive font-bold">
                        Limite diário atingido!
                    </p>
                )}
            </div>
        </div>
    )
}
