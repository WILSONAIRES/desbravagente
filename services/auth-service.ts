import { User } from "@/types/auth"
import { supabase } from "@/lib/supabase"

export const authService = {
    async login(email: string, password?: string): Promise<User> {
        // For now, we will use a "magic link" or "simulated sign in" via Supabase
        // to keep it simple but real. Or use signInWithPassword if user wants it.
        // Let's use a simplified version that checks/creates profile after Supabase Auth.

        // Note: For real Cloudflare deployment, we want true Supabase Auth.
        // For testing, we might still simulate the SESSÃO but using the DB.

        const { data: { user }, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            }
        })

        if (error) throw error

        // We'll need to handle the session. Supabase handles it in the background via cookies/localStorage.
        return {} as User // The real user info comes from getCurrentUser after session is established
    },

    async register(name: string, email: string): Promise<User> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: 'temporary-password-123', // In a real app, user would provide this
            options: {
                data: { name }
            }
        })
        if (error) throw error
        return {} as User
    },

    async updateProfile(userId: string, data: { name: string }): Promise<User> {
        const { data: profile, error } = await supabase
            .from('profiles')
            .update({ name: data.name })
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return profile as any
    },

    async updateSubscription(userId: string, subscription: User['subscription']): Promise<User> {
        const { data: profile, error } = await supabase
            .from('profiles')
            .update({
                subscription_status: subscription?.status,
                subscription_plan: subscription?.plan,
                is_exempt: subscription?.isExempt
            })
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return profile as any
    },

    async logout(): Promise<void> {
        await supabase.auth.signOut()
    },

    async getCurrentUser(): Promise<User | null> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        // Fetch profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (!profile) {
            // Create profile if it doesn't exist (first time login)
            const isEmailAdmin = user.email === 'waisilva@gmail.com'
            const { data: newProfile, error } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email?.split('@')[0],
                    role: isEmailAdmin ? 'admin' : 'director',
                    subscription_status: isEmailAdmin ? 'exempt' : 'trial',
                    subscription_plan: 'free',
                    is_exempt: isEmailAdmin
                })
                .select()
                .single()

            if (error) return null
            return this.mapProfileToUser(newProfile)
        }

        return this.mapProfileToUser(profile)
    },

    mapProfileToUser(profile: any): User {
        return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            subscription: {
                status: profile.subscription_status,
                plan: profile.subscription_plan,
                isExempt: profile.is_exempt,
                trialEndsAt: profile.trial_ends_at
            }
        }
    },

    async loginWithGoogle(): Promise<void> {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })
        if (error) throw error
    },
}
