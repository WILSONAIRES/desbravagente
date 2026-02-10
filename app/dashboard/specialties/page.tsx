export const runtime = 'edge'

import { SpecialtiesList } from "@/components/specialties/specialties-list"

export default function SpecialtiesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Especialidades</h1>
                <p className="text-muted-foreground">
                    Explore as especialidades e gere conteúdos de apoio.
                </p>
            </div>
            <SpecialtiesList />
        </div>
    )
}
