"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { storageService } from "@/services/storage-service"
import { aiService } from "@/services/ai-service"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, FileText } from "lucide-react"

interface FullExamModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    specialtyName: string
    requirements: { id: string; description: string }[]
}

export function FullExamModal({
    open,
    onOpenChange,
    specialtyName,
    requirements
}: FullExamModalProps) {
    const router = useRouter()
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setResult(null)
            setDifficulty('medium')
        }
    }, [open])

    const handleGenerate = async () => {
        setLoading(true)
        setResult(null)

        try {
            const content = await aiService.generate({
                type: 'specialty',
                name: specialtyName,
                requirement: `PROVA COMPLETA cobrindo todos os requisitos: ${requirements.map(r => r.description).join(', ')}`,
                outputType: 'exam',
                difficulty: difficulty
            })

            if (content.startsWith("Erro:")) {
                setResult(content)
            } else {
                setResult(content)

                // Auto-save logic
                try {
                    await storageService.saveContent({
                        content: content,
                        timestamp: new Date(),
                        title: `Prova - ${specialtyName}`,
                        type: "specialty",
                        requirementId: `full-exam-${specialtyName}`,
                    })

                    // Dispatch event for UI updates (like the trial counter)
                    window.dispatchEvent(new CustomEvent('content-generated'))
                } catch (saveErr) {
                    console.error("Auto-save failed for full exam:", saveErr)
                }
            }
        } catch (error) {
            console.error(error)
            setResult("Erro ao gerar prova. Verifique sua conexão.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Gerar Prova Completa
                    </DialogTitle>
                    <DialogDescription>
                        Gera uma prova cobrindo todos os {requirements.length} requisitos da especialidade <span className="font-medium text-primary">{specialtyName}</span>
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nível de Dificuldade</Label>
                            <Select
                                value={difficulty}
                                onValueChange={(v: any) => setDifficulty(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Fácil</SelectItem>
                                    <SelectItem value="medium">Médio</SelectItem>
                                    <SelectItem value="hard">Difícil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleGenerate} disabled={loading} className="w-full mt-2">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gerando prova...
                                </>
                            ) : (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Gerar Prova Completa
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm">
                            {result}
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setResult(null)}>
                                Voltar
                            </Button>
                            <Button onClick={() => {
                                onOpenChange(false)
                                router.refresh()
                            }}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
