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
    // Heuristic linking removed to avoid unwanted ghost links as requested by user.
    // Links must now be explicit.

    return (
        <Accordion type="single" collapsible className="w-full">
            {(sections || []).map((section, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                        {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            {(section.requirements || []).map((req) => (
                                <RequirementItem
                                    key={req.id}
                                    req={req}
                                    onGenerateClick={onGenerateClick}
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

function RequirementItem({ req, onGenerateClick, level = 0, parentDescription }: any) {
    if (!req) return null

    // Explicit link has priority
    let linkedSpecialty = null;
    if (req.linkedSpecialtyId) {
        linkedSpecialty = specialties.find(s => s.id === req.linkedSpecialtyId);
    }

    return (
        <div className="space-y-3">
            <div
                className={`flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${level > 0 ? 'bg-accent/20' : ''}`}
                style={level > 0 ? { marginLeft: `${level * 1.5}rem` } : {}}
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
                    level={level + 1}
                    onGenerateClick={onGenerateClick}
                    parentDescription={req.description}
                />
            ))}
        </div>
    )
}
