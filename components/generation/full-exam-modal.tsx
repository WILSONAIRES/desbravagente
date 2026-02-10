"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { storageService } from "@/services/storage-service"
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

        // Build requirements list for the prompt
        const reqList = requirements.map((r, i) => `${i + 1}. ${r.description}`).join('\n')

        try {
            const localKey = typeof window !== 'undefined' ? localStorage.getItem("ai_api_key") : null
            const apiKey = localKey || ""

            const storedProvider = typeof window !== 'undefined' ? localStorage.getItem("ai_provider") : null
            const provider = storedProvider || "groq"

            const storedModel = typeof window !== 'undefined' ? localStorage.getItem("ai_model") : null
            const modelName = storedModel || "llama-3.3-70b-versatile"

            const difficultyLabel = {
                easy: "Fácil (linguagem simples, conceitos fundamentais, direta)",
                medium: "Médio (nível padrão de clube, mesclando teoria e prática)",
                hard: "Difícil (aprofundada, exige domínio técnico e detalhes minuciosos)"
            }[difficulty]

            const prompt = `
Crie uma PROVA COMPLETA para a especialidade "${specialtyName}" dos Desbravadores.

Nível de Dificuldade: ${difficultyLabel}

A prova deve cobrir TODOS os seguintes requisitos:
${reqList}

Instruções para a prova:
1. Inclua questões objetivas (múltipla escolha) e dissertativas
2. Distribua as questões entre os requisitos fornecidos (máximo de 10 questões no total)
3. Use linguagem apropriada para juvenis/adolescentes
4. Inclua um cabeçalho apenas com campo para nome e clube (SEM DATA)
5. Ao final, inclua o GABARITO das questões objetivas
6. Total de questões: no MÁXIMO 10 questões
7. Ao final da prova, adicione obrigatoriamente o seguinte aviso em itálico e separado por uma linha horizontal:
---
*Este conteúdo foi gerado por uma inteligência artificial e pode conter falhas. Verifique sempre as informações com os manuais oficiais.*

Formate a prova em Markdown.
`

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey, modelName, prompt, provider }),
            })

            const data = await response.json()

            if (!response.ok) {
                setResult(`Erro: ${data?.error || 'Falha na geração'}`)
            } else {
                setResult(data.text || "Erro: Resposta vazia")
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
                                if (result && !result.startsWith("Erro")) {
                                    storageService.saveContent({
									content: result,
									timestamp: new Date(),
									title: `Prova - ${specialtyName}`,
									type: "specialty",
									requirementId: `full-exam-${specialtyName}`,
									})

                                    onOpenChange(false)
                                    router.refresh()
                                }
                            }}>
                                Salvar e Fechar
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
