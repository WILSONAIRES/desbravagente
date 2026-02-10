import { Award, BookOpen, Home, FileText, Settings } from "lucide-react"

export const navItems = [
    {
        title: "Início",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Meu Clube",
        href: "/dashboard/club",
        icon: Award, // Will use Award as a placeholder or change if needed
    },
    {
        title: "Classes",
        href: "/dashboard/classes",
        icon: BookOpen,
    },
    {
        title: "Especialidades",
        href: "/dashboard/specialties",
        icon: Award,
    },
    {
        title: "Meus Conteúdos",
        href: "/dashboard/contents",
        icon: FileText,
    },
    {
        title: "Configurações",
        href: "/dashboard/settings",
        icon: Settings,
        isAdminOnly: true,
    },
]
