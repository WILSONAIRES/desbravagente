import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        const hasUrl = !!url;
        const hasKey = !!key && key !== "placeholder";

        const supabase = await createClient();
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
            schema_test: {
                global_config_read: await supabase.from('global_config').select('*').limit(1).then(r => ({
                    error: r.error,
                    data: r.data
                })),
                global_config_columns: await supabase.from('global_config').select('id').limit(1).then(r => ({
                    error: r.error,
                    data: r.data
                }))
            },
            auth_details: {
                user_id: user?.id || null,
                user_role: user?.user_metadata?.role || null,
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
