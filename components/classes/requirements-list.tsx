"use client"

import { ClassSection } from "@/data/classes"
import { specialties } from "@/data/specialties"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wand2, Award } from "lucide-react"
import Link from "next/link"

interface RequirementsListProps {
    sections: ClassSection[]
    onGenerateClick: (requirementId: string, description: string, parentDescription?: string) => void
}

export function RequirementsList({ sections, onGenerateClick }: RequirementsListProps) {
    const findSpecialtyInDescription = (description: string) => {
        const lowerDesc = description.toLowerCase()
        return specialties.find(s => {
            const nameLower = s.name.toLowerCase()
            const nameWithoutCode = nameLower.replace(/^[a-z]{1,2}-[0-9]{3}\s+/i, '').trim()
            return lowerDesc.includes(nameWithoutCode)
        })
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {sections.map((section, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                        {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            {section.requirements.map((req) => (
                                <RequirementItem
                                    key={req.id}
                                    req={req}
                                    onGenerateClick={onGenerateClick}
                                    findSpecialtyInDescription={findSpecialtyInDescription}
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

function RequirementItem({ req, onGenerateClick, findSpecialtyInDescription, isSub = false, parentDescription }: any) {
    const linkedSpecialty = findSpecialtyInDescription(req.description)

    return (
        <div className="space-y-3">
            <div
                className={`flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${isSub ? 'ml-6 bg-accent/20' : ''}`}
            >
                <div className="space-y-1">
                    <p className="font-medium text-sm text-muted-foreground">
                        {req.id.toUpperCase()}
                    </p>
                    <p className={`${req.noGeneration ? 'font-semibold text-primary' : ''}`}>{req.description}</p>
                </div>
                {!req.noGeneration && (
                    <div className="shrink-0">
                        {linkedSpecialty ? (
                            <Link href={`/dashboard/specialties/view?id=${linkedSpecialty.id}`}>
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors py-1.5 px-3">
                                    <Award className="mr-2 h-4 w-4" />
                                    Ver Especialidade
                                </Badge>
                            </Link>
                        ) : (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onGenerateClick(req.id, req.description, parentDescription)}
                            >
                                <Wand2 className="mr-2 h-3 w-3" />
                                Gerar Conteúdo
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {req.subRequirements?.map((sub: any) => (
                <RequirementItem
                    key={sub.id}
                    req={sub}
                    isSub={true}
                    onGenerateClick={onGenerateClick}
                    findSpecialtyInDescription={findSpecialtyInDescription}
                    parentDescription={req.description}
                />
            ))}
        </div>
    )
}
