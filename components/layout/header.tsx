import { UserNav } from "@/components/layout/user-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
    return (
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 md:px-6">
                <MobileNav />
                <div className="ml-auto flex items-center space-x-4">
                    <ModeToggle />
                    <UserNav />
                </div>
            </div>
        </div>
    )
}
