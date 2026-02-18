import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
    // Create an unmodified response
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://seanqpjdorpadnmwcybj.supabase.co"
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    console.log(`[Middleware] Path: ${request.nextUrl.pathname}, User found: ${!!user}`);
    if (userError) console.error(`[Middleware] Auth error:`, userError);

    // Protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
        console.log(`[Middleware] Redirecting to login (unauthorized dashboard access)`);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to dashboard if logged in and trying to access login/register
    if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && user) {
        console.log(`[Middleware] Redirecting to dashboard (already logged in)`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
};
