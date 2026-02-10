"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { storageService } from "@/services/storage-service"
import { specialties, getSpecialtyImage } from "@/data/specialties"
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
import { aiService, ContentGenerationRequest } from "@/services/ai-service"
import { Loader2, Sparkles, AlertTriangle } from "lucide-react"

interface GenerationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    requirementId: string
    requirementDescription: string
    className: string
    type?: 'class' | 'specialty'
}

export function GenerationModal({
    open,
    onOpenChange,
    requirementId,
    requirementDescription,
    className,
    type = 'class'
}: GenerationModalProps) {
    const router = useRouter()
    const [outputType, setOutputType] = useState<ContentGenerationRequest['outputType']>('explanation')
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)
    const [existingContent, setExistingContent] = useState<string | null>(null)
    const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false)

    const expectedTitle = `${className} - ${requirementId.toUpperCase()}`

    // Reset state when requirement changes
    useEffect(() => {
        setResult(null)
        setDifficulty('medium')
        setOutputType('explanation')
        setShowOverwriteConfirm(false)

        if (open) {
            checkExisting()
        }
    }, [requirementId, open, className, expectedTitle])

    const checkExisting = async () => {
        const existing = await storageService.getContentByRequirement(requirementId, expectedTitle)
        setExistingContent(existing ? existing.content : null)
    }

    const handleGenerate = async (refinement?: 'simpler' | 'complex') => {
        if (!refinement && existingContent && !showOverwriteConfirm) {
            setShowOverwriteConfirm(true)
            return
        }

        setLoading(true)
        if (!refinement) setResult(null)

        try {
            const content = await aiService.generate({
                type: type,
                name: className,
                requirement: requirementDescription,
                outputType,
                difficulty: (outputType === 'quiz' || outputType === 'exam') ? difficulty : undefined,
                refinement
            })
            setResult(content)
            setShowOverwriteConfirm(false)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!result) return

        setLoading(true)
        try {
            await storageService.saveContent({
                content: result,
                timestamp: new Date(),
                title: expectedTitle,
                type: type,
                requirementId: requirementId
            })
            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        {type === 'specialty' && (
                            <div className="h-12 w-12 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                                <img
                                    src={getSpecialtyImage(specialties.find(s => s.name === className)?.code)}
                                    alt={className}
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://mda.wiki.br/site/@imgs/ico_especialidade_dbv.svg"
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <DialogTitle>Gerador de Conteúdo IA</DialogTitle>
                            <DialogDescription>
                                Material para: <span className="font-medium text-primary">{requirementId.toUpperCase()}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {!result ? (
                    <div className="grid gap-4 py-4">
                        {existingContent && !showOverwriteConfirm && (
                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Conteúdo já gerado</p>
                                    <p className="text-xs text-muted-foreground">Você já criou um material para este requisito.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setResult(existingContent)}
                                >
                                    Ver Atual
                                </Button>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label>Tipo de Conteúdo</Label>
                            <Select
                                value={outputType}
                                onValueChange={(v: any) => {
                                    setOutputType(v)
                                    setShowOverwriteConfirm(false)
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="explanation">Explicação e Base Teórica</SelectItem>
                                    <SelectItem value="activity">Sugestão de Atividade Prática</SelectItem>
                                    <SelectItem value="quiz">Questionário (Quiz)</SelectItem>
                                    <SelectItem value="exam">Avaliação (Prova)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(outputType === 'quiz' || outputType === 'exam') && (
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
                        )}

                        {showOverwriteConfirm && (
                            <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-lg space-y-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    <p className="text-sm font-semibold text-amber-900">Substituir conteúdo?</p>
                                </div>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    Um novo conteúdo será gerado e o material atual deste requisito será **substituído**.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white border-none"
                                        onClick={() => handleGenerate()}
                                        disabled={loading}
                                    >
                                        Entendi, Gerar Novo
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => setShowOverwriteConfirm(false)}
                                        disabled={loading}
                                    >
                                        Manter Atual
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!showOverwriteConfirm && (
                            <Button onClick={() => handleGenerate()} disabled={loading} className="w-full mt-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gerando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {existingContent ? 'Gerar Novo Conteúdo' : 'Gerar Conteúdo'}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-md h-[300px] overflow-y-auto whitespace-pre-wrap text-sm border relative">
                            {loading && (
                                <div className="absolute inset-0 bg-muted/50 flex items-center justify-center backdrop-blur-[1px] z-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <p className="text-xs font-medium">Processando...</p>
                                    </div>
                                </div>
                            )}
                            {result}
                        </div>

                        {/* Refinement Buttons */}
                        <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg border border-dashed">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase px-1">Refinar Resultado</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => handleGenerate('simpler')}
                                    disabled={loading}
                                >
                                    ✨ Deixar mais Simples
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => handleGenerate('complex')}
                                    disabled={loading}
                                >
                                    🧠 Aprofundar Conteúdo
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" onClick={() => {
                                setResult(null)
                                setShowOverwriteConfirm(false)
                            }} disabled={loading}>
                                Voltar
                            </Button>
                            {result !== existingContent && (
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Salvar e Substituir
                                </Button>
                            )}
                            {result === existingContent && (
                                <Button onClick={() => onOpenChange(false)} disabled={loading}>
                                    Fechar
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
