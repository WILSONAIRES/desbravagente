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

async function generateWithProvider(provider: string, modelName: string | undefined, apiKey: string, prompt: string) {
    if (provider === "openai") {
        const model = modelName || "gpt-4o-mini"
        const url = "https://api.openai.com/v1/chat/completions"
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
        const data = await response.json()
        if (!response.ok) throw new Error(data?.error?.message || `OpenAI Error ${response.status}`)
        return data?.choices?.[0]?.message?.content || ""
    }

    if (provider === "groq") {
        const model = modelName || "llama-3.3-70b-versatile"
        const url = "https://api.groq.com/openai/v1/chat/completions"
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
        const data = await response.json()
        if (!response.ok) throw new Error(data?.error?.message || `Groq Error ${response.status}`)
        return data?.choices?.[0]?.message?.content || ""
    }

    if (provider === "gemini") {
        const model = modelName || "gemini-2.0-flash"
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data?.error?.message || `Gemini Error ${response.status}`)
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    }

    throw new Error(`Unknown provider: ${provider}`)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { prompt } = body

        if (!prompt) {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
        }

        // --- AUTH CHECK (require login) ---
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "User authentication required to generate content." }, { status: 401 });
        }
        // --- END AUTH CHECK ---

        // Define fallback strategy
        const providers = [
            {
                id: process.env.AI_PROVIDER || "groq",
                model: process.env.AI_MODEL,
                key: process.env.AI_API_KEY
            },
            {
                id: "groq",
                model: "llama-3.3-70b-versatile",
                key: process.env.GROQ_API_KEY
            },
            {
                id: "openai",
                model: "gpt-4o-mini",
                key: process.env.OPENAI_API_KEY
            },
            {
                id: "gemini",
                model: "gemini-2.0-flash",
                key: process.env.GEMINI_API_KEY
            }
        ].filter(p => !!p.key); // Only try if key is present

        let lastError = null;

        for (const p of providers) {
            try {
                console.log(`[API Route] Trying provider: ${p.id} (${p.model})`);
                const text = await generateWithProvider(p.id, p.model, p.key!, prompt);

                if (text) {
                    await logGeneration(user.id);
                    return NextResponse.json({ text, provider: p.id });
                }
            } catch (err: any) {
                console.error(`[API Route] Provider ${p.id} failed:`, err.message);
                lastError = err;
                // Continue to next provider
            }
        }

        return NextResponse.json({
            error: "All AI providers failed. Please try again later.",
            details: lastError?.message
        }, { status: 503 });

    } catch (error) {
        console.error("Proxy error:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
