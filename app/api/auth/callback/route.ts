import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        console.log(`[Auth Callback] Code received, exchanging for session...`);

        // Create the response object first so we can set cookies on it
        const response = NextResponse.redirect(`${origin}${next}`);

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        );
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            console.log(`[Auth Callback] Session exchange successful, redirecting to ${next}`);
            return response;
        } else {
            console.error(`[Auth Callback] Session exchange error:`, error);
        }
    } else {
        console.warn(`[Auth Callback] No code found in search params`);
    }

    console.log(`[Auth Callback] Redirecting to login with error`);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
