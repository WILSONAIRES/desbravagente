"use client"

import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SubscriptionBanner() {
    const { user } = useAuth()

    if (!user) return null

    const sub = user.subscription
    const isTrial = sub?.status === 'trial'
    const isInactive = sub?.status === 'inactive'

    // Don't show for active, exempt or courtesy (unless close to end)
    if (sub?.status === 'active' || sub?.status === 'exempt' || sub?.status === 'courtesy') {
        return null
    }

    return (
        <div className={`w-full p-2 text-white flex items-center justify-center gap-4 text-sm font-medium ${isInactive ? 'bg-destructive' : 'bg-amber-600'}`}>
            <AlertCircle className="h-4 w-4" />
            <span>
                {isInactive
                    ? "Sua assinatura está inativa. Regularize agora para continuar usando todos os recursos."
                    : "Você está no período de teste gratuito do Desbravagente."
                }
            </span>
            <Link href="/dashboard/settings?tab=subscription">
                <Button variant="secondary" size="sm" className="h-7 text-xs font-bold uppercase hover:bg-white">
                    {isInactive ? "Assinar Agora" : "Ativar Plano Pro"}
                    <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
            </Link>
        </div>
    )
}
