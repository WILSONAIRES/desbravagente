"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/config/nav"
import { useAuth } from "@/contexts/auth-context"
import { storageService } from "@/services/storage-service"
import { useEffect, useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { user } = useAuth()
    const [clubName, setClubName] = useState("Desbravagente")

    useEffect(() => {
        setClubName(storageService.getClubName())

        // Listen for storage changes to update name in real-time
        const handleStorage = () => setClubName(storageService.getClubName())
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const filteredNavItems = navItems.filter(item => {
        // @ts-ignore - isAdminOnly might not be in the base type if not updated carefully
        if (item.isAdminOnly && user?.role !== 'admin') {
            return false
        }
        return true
    })

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary leading-tight">
                        {clubName}
                    </h2>
                    <div className="space-y-1">
                        {filteredNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-md px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    pathname === item.href
                                        ? "bg-accent text-accent-foreground shadow-sm"
                                        : "transparent"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
