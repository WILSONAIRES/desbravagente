import { storageService } from "./storage-service"

export interface ContentGenerationRequest {
    type: 'class' | 'specialty'
    name: string
    requirement: string
    parentRequirement?: string
    difficulty?: 'easy' | 'medium' | 'hard'
    outputType: 'explanation' | 'activity' | 'quiz' | 'exam'
    refinement?: 'simpler' | 'complex'
}

export interface GeneratedContent {
    id?: string
    content: string
    timestamp: Date
}

export const aiService = {
    async generate(request: ContentGenerationRequest): Promise<string> {
        try {
            const difficultyMap = {
                easy: "Fácil (linguagem simples, conceitos básicos)",
                medium: "Médio (equilíbrio entre teoria e prática)",
                hard: "Difícil (aprofundamento técnico, questões complexas)"
            }

            const prompt = `
Gere um conteúdo do tipo "${request.outputType}" para o seguinte requisito:

Classe/Especialidade: ${request.name}
${request.parentRequirement ? `Contexto (Instrução Pai): ${request.parentRequirement}` : ''}
Requisito: ${request.requirement}
${request.difficulty ? `Nível de Dificuldade: ${difficultyMap[request.difficulty]}` : ''}
${request.refinement === 'simpler' ? 'OBJETIVO: Simplificar ao máximo, usando linguagem lúdica e conceitos fundamentais.' : ''}
${request.refinement === 'complex' ? 'OBJETIVO: Aprofundar tecnicamente, trazendo detalhes avançados e curiosidades históricas/científicas.' : ''}

Diretrizes:
1. Seja fiel aos manuais oficiais e doutrinas da IASD.
2. Use linguagem apropriada para juvenis e adolescentes.
3. Use formatação Markdown (negrito, listas, títulos) para estruturar a resposta.
4. Se for 'activity', sugira algo prático e realizável.
5. Se for 'quiz' ou 'exam', inclua o gabarito no final. Limite a geração a no MÁXIMO 10 questões. NÃO inclua data no cabeçalho. NÃO inclua nome de instrutor.
6. Ao final de TODO conteúdo gerado, adicione obrigatoriamente o seguinte aviso em itálico e separado por uma linha horizontal: 
---
*Este conteúdo foi gerado por uma inteligência artificial e pode conter falhas. Verifique sempre as informações com os manuais oficiais.*
`

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                console.error("API Error:", data)
                const errorMsg = data?.error || data?.details?.error?.message || `HTTP ${response.status}`
                return `Erro da API (${response.status}): ${errorMsg}`
            }

            if (!data.text) {
                return "Erro: Resposta vazia da API. Verifique o modelo configurado."
            }

            return data.text
        } catch (error) {
            console.error("Erro na geração:", error)
            return "Erro ao gerar conteúdo. Verifique sua conexão ou a chave da API."
        }
    }
}
