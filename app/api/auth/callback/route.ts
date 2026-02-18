import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        console.log(`[Auth Callback] Code received, exchanging for session...`);
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
                    },
                },
            }
        );
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            console.log(`[Auth Callback] Session exchange successful, redirecting to ${next}`);
            const isLocalEnv = origin.includes("localhost");
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`);
            }

            // For Cloudflare, ensure we use the correct origin
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error(`[Auth Callback] Session exchange error:`, error);
        }
    } else {
        console.warn(`[Auth Callback] No code found in search params`);
    }

    // return the user to an error page with instructions
    console.log(`[Auth Callback] Redirecting to login with error`);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
