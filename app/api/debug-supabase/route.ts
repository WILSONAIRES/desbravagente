import { supabase } from "@/lib/supabase";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        const hasUrl = !!url;
        const hasKey = !!key && key !== "placeholder";

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        return NextResponse.json({
            status: "success",
            env: {
                NEXT_PUBLIC_SUPABASE_URL: hasUrl ? "DEFINED" : "MISSING",
                NEXT_PUBLIC_SUPABASE_ANON_KEY: hasKey ? "DEFINED" : "MISSING (or placeholder)",
                SUPABASE_URL_VALUE: url || "null",
            },
            auth: {
                hasSession: !!session,
                hasUser: !!user,
                userEmail: user?.email || null,
                sessionError: sessionError || null,
                userError: userError || null,
            },
            cookies: {
                count: request.cookies.getAll().length,
                names: request.cookies.getAll().map((c: any) => c.name),
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
