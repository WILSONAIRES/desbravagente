import { GeneratedContent } from "@/services/ai-service"
import { Unit, Member } from "@/types/clube"
import { supabase } from "@/lib/supabase"

export interface SavedContent extends GeneratedContent {
    id: string
    title: string
    type: 'class' | 'specialty'
    requirementId: string
}

export const storageService = {
    // Content Storage (AI Generated)
    async saveContent(content: Omit<SavedContent, 'id'>): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('generated_contents')
            .upsert({
                title: content.title,
                type: content.type,
                requirement_id: content.requirementId,
                content: content,
                owner_id: user.id
            }, {
                onConflict: 'requirement_id, title, owner_id' // Requires unique constraint in DB
            })

        if (error) console.error("Error saving content:", error)
    },

    async getAllContent(): Promise<SavedContent[]> {
        const { data, error } = await supabase
            .from('generated_contents')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching content:", error)
            return []
        }

        return data.map(item => ({
            ...item.content,
            id: item.id
        }))
    },

    async getContentByRequirement(requirementId: string, title?: string): Promise<SavedContent | undefined> {
        let query = supabase
            .from('generated_contents')
            .select('*')
            .eq('requirement_id', requirementId)

        if (title) {
            query = query.eq('title', title)
        }

        const { data, error } = await query.maybeSingle()
        if (error || !data) return undefined

        return {
            ...data.content,
            id: data.id
        }
    },

    async deleteContent(id: string): Promise<void> {
        await supabase.from('generated_contents').delete().eq('id', id)
    },

    // Units Management
    async saveUnit(unit: Unit): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('units')
            .upsert({
                id: unit.id.length > 30 ? unit.id : undefined, // Check if it's a UUID
                name: unit.name,
                description: unit.description,
                owner_id: user.id
            })

        if (error) console.error("Error saving unit:", error)
    },

    async getUnits(): Promise<Unit[]> {
        const { data, error } = await supabase
            .from('units')
            .select('*')
            .order('name')

        if (error) return []
        return data as Unit[]
    },

    async getUnitById(id: string): Promise<Unit | undefined> {
        const { data } = await supabase
            .from('units')
            .select('*')
            .eq('id', id)
            .maybeSingle()

        return data as Unit || undefined
    },

    async deleteUnit(id: string): Promise<void> {
        await supabase.from('units').delete().eq('id', id)
    },

    // Member Management
    async saveMember(member: Member): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('members')
            .upsert({
                id: member.id.length > 30 ? member.id : undefined,
                name: member.name,
                date_of_birth: member.dateOfBirth,
                unit_id: member.unitId || null,
                owner_id: user.id,
                progress: member.progress
            })

        if (error) console.error("Error saving member:", error)
    },

    async getMembers(unitId?: string): Promise<Member[]> {
        let query = supabase.from('members').select('*')

        if (unitId) {
            query = query.eq('unit_id', unitId)
        }

        const { data, error } = await query.order('name')

        if (error) return []
        return data.map(m => ({
            id: m.id,
            name: m.name,
            dateOfBirth: m.date_of_birth,
            unitId: m.unit_id,
            progress: m.progress || []
        }))
    },

    async getMemberById(id: string): Promise<Member | undefined> {
        const { data } = await supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .maybeSingle()

        if (!data) return undefined
        return {
            id: data.id,
            name: data.name,
            dateOfBirth: data.date_of_birth,
            unitId: data.unit_id,
            progress: data.progress || []
        }
    },

    async deleteMember(id: string): Promise<void> {
        await supabase.from('members').delete().eq('id', id)
    },

    // Club Info (Stored in Profile)
    async getClubName(): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return "Meu Clube"

        const { data } = await supabase
            .from('profiles')
            .select('club_name')
            .eq('id', user.id)
            .maybeSingle()

        return data?.club_name || "Meu Clube"
    },

    async saveClubName(name: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.error("No user found when saving club name")
            return
        }

        const { error } = await supabase
            .from('profiles')
            .update({ club_name: name })
            .eq('id', user.id)

        if (error) {
            console.error("Error saving club name:", error)
            throw error
        }
    },

    // Global Admin Only Storage for Users
    async getAllUsers(): Promise<any[]> {
        // This should list all profiles (Admin only policy required in Supabase)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at')

        if (error) {
            console.error("Error fetching all users:", error)
            throw error
        }
        return data.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            role: p.role,
            subscription: {
                status: p.subscription_status,
                plan: p.subscription_plan,
                isExempt: p.is_exempt,
                trialEndsAt: p.trial_ends_at
            }
        }))
    },

    async saveUserRecord(user: any): Promise<void> {
        // Admin manually updating a user profile
        const { error } = await supabase
            .from('profiles')
            .update({
                role: user.role,
                subscription_status: user.subscription?.status,
                subscription_plan: user.subscription?.plan,
                is_exempt: user.subscription?.isExempt,
                trial_ends_at: user.subscription?.trialEndsAt,
                club_name: user.clubName
            })
            .eq('email', user.email)

        if (error) {
            console.error("Error saving user record:", error)
            throw error
        }
    },

    // Configurações Globais (IA, etc)
    async getGlobalConfig(key: string): Promise<any> {
        const { data, error } = await supabase
            .from('global_config')
            .select('value')
            .eq('id', key)
            .maybeSingle()

        if (error || !data) return null
        return data.value
    },

    async saveGlobalConfig(key: string, value: any): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            console.error("No user found for saveGlobalConfig")
            throw new Error("Usuário não autenticado")
        }

        const { error } = await supabase
            .from('global_config')
            .upsert({
                id: key,
                value,
                updated_at: new Date(),
                updated_by: user.id
            })

        if (error) {
            console.error(`Error saving global config ${key}:`, error)
            throw error
        }
    },

    // Pathfinder Classes Management (Supabase)
    async getClasses(): Promise<any[]> {
        const { data, error } = await supabase
            .from('pathfinder_classes')
            .select('*')
            .order('min_age', { ascending: true })

        if (error || !data || data.length === 0) return []

        return data.map(c => ({
            id: c.id,
            name: c.name,
            url: c.url,
            minAge: c.min_age,
            color: c.color,
            type: c.type,
            sections: c.sections
        }))
    },

    async isDataMigrated(): Promise<boolean> {
        const { count, error } = await supabase
            .from('pathfinder_classes')
            .select('*', { count: 'exact', head: true })

        if (error) return false
        return (count || 0) > 0
    },

    async saveClass(cls: any): Promise<void> {
        // Try to get session from local cache first for speed
        const { data: { session } } = await supabase.auth.getSession()
        let userId = session?.user?.id

        if (!userId) {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Usuário não autenticado")
            userId = user.id
        }

        const { error } = await supabase
            .from('pathfinder_classes')
            .upsert({
                id: cls.id,
                name: cls.name,
                url: cls.url,
                min_age: cls.minAge,
                color: cls.color,
                type: cls.type,
                sections: cls.sections,
                updated_at: new Date().toISOString(),
                updated_by: userId
            })

        if (error) {
            console.error("Error saving class (details):", error.message, error.details, error.hint)
            throw error
        }
    },

    async migrateClassesFromStatic(staticClasses: any[]): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        for (const cls of staticClasses) {
            await this.saveClass(cls)
        }
    },

    // Specialties Management (Supabase)
    async getSpecialties(): Promise<any[]> {
        const { data, error } = await supabase
            .from('pathfinder_specialties')
            .select('*')
            .order('name')

        if (error || !data || data.length === 0) return []

        return data.map(s => ({
            id: s.id,
            name: s.name,
            code: s.code,
            category: s.category,
            color: s.color,
            requirements: s.requirements,
            image: s.image
        }))
    },

    async getSpecialtyById(id: string): Promise<any | undefined> {
        const { data, error } = await supabase
            .from('pathfinder_specialties')
            .select('*')
            .eq('id', id)
            .maybeSingle()

        if (error || !data) return undefined

        return {
            id: data.id,
            name: data.name,
            code: data.code,
            category: data.category,
            color: data.color,
            requirements: data.requirements,
            image: data.image
        }
    },

    async saveSpecialty(specialty: any): Promise<void> {
        const { data: { session } } = await supabase.auth.getSession()
        let userId = session?.user?.id

        if (!userId) {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Usuário não autenticado")
            userId = user.id
        }

        const { error } = await supabase
            .from('pathfinder_specialties')
            .upsert({
                id: specialty.id,
                name: specialty.name,
                code: specialty.code,
                category: specialty.category,
                color: specialty.color,
                requirements: specialty.requirements,
                image: specialty.image,
                updated_at: new Date().toISOString(),
                updated_by: userId
            })

        if (error) {
            console.error("Error saving specialty (details):", error.message, error.details, error.hint)
            throw error
        }
    },

    async migrateSpecialtiesFromStatic(staticSpecialties: any[]): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        for (const specialty of staticSpecialties) {
            await this.saveSpecialty(specialty)
        }
    }
}
