"use client"

export const runtime = 'edge'

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { SubscriptionBanner } from "@/components/layout/subscription-banner"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <div className="hidden md:block w-64 border-r">
                <Sidebar className="h-full" />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <SubscriptionBanner />
                <Header />
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
