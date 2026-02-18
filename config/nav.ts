import { Award, BookOpen, Home, FileText, Settings, Users, User as UserIcon } from "lucide-react"

export const navItems = [
    {
        title: "Início",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Unidades",
        href: "/dashboard/club",
        icon: Users,
    },
    {
        title: "Desbravadores",
        href: "/dashboard/club/members",
        icon: UserIcon,
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
