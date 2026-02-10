export type MemberRole = 'pathfinder' | 'counselor' | 'instructor' | 'director'

export interface RequirementProgress {
    requirementId: string
    completed: boolean
    completedDate?: Date
    approvedBy?: string
}

export interface ProgressItem {
    id: string // class-id or specialty-id
    type: 'class' | 'specialty'
    status: 'in-progress' | 'completed' | 'approved'
    startDate: Date
    completionDate?: Date
    requirements: RequirementProgress[]
}

export interface Member {
    id: string
    name: string
    dateOfBirth: string
    unitId?: string
    progress: ProgressItem[]
}

export interface Unit {
    id: string
    name: string
    description?: string
}

export interface ClubInfo {
    name: string
    director?: string
}
