import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

// Helper function to insert a log entry for usage tracking
async function logGeneration(userId: string) {
    if (!userId) return;
    try {
        const supabase = await createClient();
        await supabase.from('generation_logs').insert({ user_id: userId, prompt_type: 'generate' });
    } catch (e) {
        console.error("Failed to log generation:", e);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { prompt } = body

        // Read from environment variables for security and stability
        const apiKey = process.env.AI_API_KEY
        const provider = process.env.AI_PROVIDER || "groq"
        const modelName = process.env.AI_MODEL

        if (!apiKey || !prompt) {
            return NextResponse.json({ error: "Missing apiKey or prompt" }, { status: 400 })
        }

        // --- AUTH & TRIAL LIMITS CHECK ---
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "User authentication required to generate content." }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_status, is_exempt, trial_ends_at')
            .eq('id', user.id)
            .single();

        if (profile) {
            const isExempt = profile.is_exempt || profile.subscription_status === 'active' || profile.subscription_status === 'exempt';

            if (!isExempt && profile.subscription_status === 'trial') {
                if (profile.trial_ends_at && new Date(profile.trial_ends_at) < new Date()) {
                    return NextResponse.json({ error: "Trial_Expired", message: "Seu período de teste de 7 dias acabou. Por favor, assine para continuar gerando conteúdo." }, { status: 403 });
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const { count, error: countError } = await supabase
                    .from('generation_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .gte('created_at', today.toISOString());

                if (!countError && count !== null && count >= 10) {
                    return NextResponse.json({ error: "Rate_Limit_Exceeded", message: "Você atingiu o limite de 10 conteúdos gerados por dia durante o teste. Assine para criar mais ou tente amanhã." }, { status: 429 });
                }
            }
        }
        // --- END AUTH CHECK ---

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
            await logGeneration(user.id);
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
            await logGeneration(user.id);
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
        await logGeneration(user.id);
        return NextResponse.json({ text: text || "" })

    } catch (error) {
        console.error("Proxy error:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
