import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        const hasUrl = !!url;
        const hasKey = !!key && key !== "placeholder";

        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        return NextResponse.json({
            status: error ? "error" : "success",
            env: {
                NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "DEFINED" : "MISSING",
                NEXT_PUBLIC_SUPABASE_ANON_KEY: hasKey ? "DEFINED" : "MISSING (or placeholder)",
                SUPABASE_URL_VALUE: url || "null",
            },
            connection: {
                error: error || null,
                message: error ? error.message : "Supabase is reachable and responding.",
            },
            timestamp: new Date().toISOString()
        });
    } catch (err: any) {
        return NextResponse.json({
            status: "exception",
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
