export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'director' | 'counselor' | 'instructor'
    subscription?: {
        status: 'active' | 'inactive' | 'trial' | 'exempt' | 'courtesy'
        plan: 'monthly' | 'yearly' | 'free'
        trialEndsAt?: string
        courtesyEndsAt?: string
        isExempt?: boolean
        customMonthlyAmount?: number | string
    }
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}
