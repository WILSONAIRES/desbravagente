"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { User, AuthState } from "@/types/auth"
import { authService } from "@/services/auth-service"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface AuthContextType extends AuthState {
    login: (email: string) => Promise<void>
    register: (name: string, email: string) => Promise<void>
    logout: () => Promise<void>
    updateProfile: (data: { name: string }) => Promise<void>
    updateSubscription: (subscription: User['subscription']) => Promise<void>
    loginWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    })
    const router = useRouter()

    useEffect(() => {
        // Check for current session on load
        const initAuth = async () => {
            console.log("[AuthContext] Initializing...");
            try {
                const user = await authService.getCurrentUser()
                console.log("[AuthContext] User loaded:", !!user);
                setState({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                })
            } catch (error) {
                console.error("[AuthContext] Init error:", error);
                setState(prev => ({ ...prev, isLoading: false }))
            }
        }

        initAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[AuthContext] Auth event: ${event}`);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                const user = await authService.getCurrentUser()
                console.log("[AuthContext] User syncing after event:", !!user);
                setState({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                })
            } else if (event === 'SIGNED_OUT') {
                console.log("[AuthContext] Sign out detected, clearing state");
                setState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
                router.push("/login")
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    const login = async (email: string) => {
        setState(prev => ({ ...prev, isLoading: true }))
        try {
            await authService.login(email)
            // Supabase sends a magic link or requires OTP. 
            // For this UI, we might need to show a "Check your email" message.
            // But let's assume we are using a simplified flow for now.
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setState(prev => ({ ...prev, isLoading: false }))
        }
    }

    const register = async (name: string, email: string) => {
        setState(prev => ({ ...prev, isLoading: true }))
        try {
            await authService.register(name, email)
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setState(prev => ({ ...prev, isLoading: false }))
        }
    }

    const logout = async () => {
        await authService.logout()
    }

    const updateProfile = async (data: { name: string }) => {
        if (!state.user) return
        const updatedUser = await authService.updateProfile(state.user.id, data)
        setState(prev => ({ ...prev, user: updatedUser }))
    }

    const updateSubscription = async (subscription: User['subscription']) => {
        if (!state.user) return
        const updatedUser = await authService.updateSubscription(state.user.id, subscription)
        setState(prev => ({ ...prev, user: updatedUser }))
    }

    const loginWithGoogle = async () => {
        await authService.loginWithGoogle()
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                logout,
                updateProfile,
                updateSubscription,
                loginWithGoogle,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
