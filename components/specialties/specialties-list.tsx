"use client"

import { useState } from "react"
import Link from "next/link"
import { specialties, specialtyCategories, getSpecialtyImage } from "@/data/specialties"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SpecialtiesList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const filteredSpecialties = specialties.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory ? s.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar especialidade..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Pills */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                >
                    Todas
                </Button>
                {specialtyCategories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="whitespace-nowrap"
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredSpecialties.map((specialty) => {
                    const cat = specialtyCategories.find(c => c.id === specialty.category)
                    return (
                        <Link key={specialty.id} href={`/dashboard/specialties/view?id=${specialty.id}`}>
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden border-l-4" style={{ borderLeftColor: cat?.color?.includes('bg-') ? undefined : (cat?.color || 'gray') }}>
                                {/* Note: Tailwind classes in style need real handling or inline styles. For now simple border. 
                    Actually, we are listing colors as classes in data like "bg-green-500". 
                    We can't easily put that in style. Let's use a colored header.
                */}
                                <div className={`h-2 w-full ${specialty.color}`} />
                                <CardHeader className="pb-2">
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                                            <img
                                                src={getSpecialtyImage(specialty.code)}
                                                alt={specialty.name}
                                                className="w-full h-full object-contain p-1"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement
                                                    // Se ainda não tentou o JPG, tenta
                                                    if (img.src.endsWith('.png')) {
                                                        const cleanCode = specialty.code?.toLowerCase().replace(/-/g, "")
                                                        img.src = `https://mda.wiki.br/site/@imgs_wiki/imagem@${cleanCode}.jpg`
                                                    } else {
                                                        // Se o JPG também falhar, usa o fallback final
                                                        img.src = "https://mda.wiki.br/site/@imgs/ico_especialidade_dbv.svg"
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-sm leading-tight line-clamp-2">{specialty.name}</CardTitle>

                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {cat?.name}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {filteredSpecialties.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    Nenhuma especialidade encontrada.
                </div>
            )}
        </div>
    )
}
