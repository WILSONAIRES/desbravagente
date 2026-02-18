"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { specialties as staticSpecialties, specialtyCategories, getSpecialtyImage } from "@/data/specialties"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw, Database } from "lucide-react"
import { storageService } from "@/services/storage-service"
import { supabase } from "@/lib/supabase"

export function SpecialtiesList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [dbSpecialties, setDbSpecialties] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                // Check Admin
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
                    setIsAdmin(profile?.role === 'admin' || user.email === 'waisilva@gmail.com')
                }

                // Load Specialties from DB
                const data = await storageService.getSpecialties()
                setDbSpecialties(data)
            } catch (err) {
                console.error("Error loading specialties:", err)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    const handleMigrate = async () => {
        if (!confirm("Isso irá migrar todas as especialidades estáticas para o banco de dados. Deseja continuar?")) return
        setIsSyncing(true)
        try {
            await storageService.migrateSpecialtiesFromStatic(staticSpecialties)
            const updated = await storageService.getSpecialties()
            setDbSpecialties(updated)
            alert("Migração concluída com sucesso!")
        } catch (err) {
            console.error(err)
            alert("Erro na migração.")
        } finally {
            setIsSyncing(false)
        }
    }

    const currentSpecialties = dbSpecialties.length > 0 ? dbSpecialties : staticSpecialties

    const filteredSpecialties = currentSpecialties.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory ? s.category === selectedCategory : true
        return matchesSearch && matchesCategory
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="h-8 w-8 animate-spin text-primary opacity-20" />
                <p className="text-muted-foreground text-sm">Carregando especialidades...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar especialidade..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {isAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMigrate}
                        disabled={isSyncing}
                        className="gap-2"
                    >
                        <Database className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
                        {isSyncing ? "Sincronizando..." : "Sincronizar DB"}
                    </Button>
                )}
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
                                                    if (img.src.endsWith('.png')) {
                                                        const cleanCode = specialty.code?.toLowerCase().replace(/-/g, "")
                                                        img.src = `https://mda.wiki.br/site/@imgs_wiki/imagem@${cleanCode}.jpg`
                                                    } else {
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
