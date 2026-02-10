"use client"

import { ClassSection } from "@/data/classes"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"

interface RequirementsListProps {
    sections: ClassSection[]
    onGenerateClick: (requirementId: string, description: string) => void
}

export function RequirementsList({ sections, onGenerateClick }: RequirementsListProps) {
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
                                <div
                                    key={req.id}
                                    className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm text-muted-foreground">
                                            {req.id.toUpperCase()}
                                        </p>
                                        <p>{req.description}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="shrink-0"
                                        onClick={() => onGenerateClick(req.id, req.description)}
                                    >
                                        <Wand2 className="mr-2 h-3 w-3" />
                                        Gerar Conteúdo
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
