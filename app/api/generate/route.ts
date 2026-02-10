import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { apiKey, modelName, prompt, provider } = body

        if (!apiKey || !prompt) {
            return NextResponse.json({ error: "Missing apiKey or prompt" }, { status: 400 })
        }

        // OpenAI ChatGPT
        if (provider === "openai") {
            const model = modelName || "gpt-4o-mini"
            const url = "https://api.openai.com/v1/chat/completions"

            console.log("[API Route] OpenAI request:", { model, provider, keyPrefix: apiKey?.substring(0, 10) + "..." })

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "Você é um instrutor experiente de Desbravadores da Igreja Adventista do Sétimo Dia. Seja fiel aos manuais oficiais." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                }),
            })

            console.log("[API Route] OpenAI response status:", response.status, response.statusText)

            const data = await response.json()
            console.log("[API Route] OpenAI response data:", JSON.stringify(data).substring(0, 500))

            if (!response.ok) {
                const errorMessage = data?.error?.message || data?.error?.code || JSON.stringify(data) || "Unknown OpenAI Error"
                console.error("[API Route] OpenAI Error:", errorMessage)
                return NextResponse.json(
                    { error: errorMessage, status: response.status, details: data },
                    { status: response.status }
                )
            }

            const text = data?.choices?.[0]?.message?.content
            return NextResponse.json({ text: text || "" })
        }

        // Groq (Free LLama/Mixtral)
        if (provider === "groq") {
            const model = modelName || "llama-3.3-70b-versatile"
            const url = "https://api.groq.com/openai/v1/chat/completions"

            console.log("[API Route] Groq request:", { model, provider })

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "Você é um instrutor experiente de Desbravadores da Igreja Adventista do Sétimo Dia. Seja fiel aos manuais oficiais. Responda sempre em português brasileiro." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                }),
            })

            console.log("[API Route] Groq response status:", response.status, response.statusText)

            const data = await response.json()

            if (!response.ok) {
                const errorMessage = data?.error?.message || data?.error?.code || JSON.stringify(data) || "Unknown Groq Error"
                console.error("[API Route] Groq Error:", errorMessage)
                return NextResponse.json(
                    { error: errorMessage, status: response.status, details: data },
                    { status: response.status }
                )
            }

            const text = data?.choices?.[0]?.message?.content
            return NextResponse.json({ text: text || "" })
        }
        const model = modelName || "gemini-2.0-flash"
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data?.error?.message || "Gemini API Error", details: data },
                { status: response.status }
            )
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        return NextResponse.json({ text: text || "" })

    } catch (error) {
        console.error("Proxy error:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
