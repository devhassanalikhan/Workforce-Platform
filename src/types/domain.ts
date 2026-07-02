export interface Job {
  id: string
  title: string
  company: string
  logo: string
  location: string
  salary: string
  type: string
  category: string
  experience: string
  posted: string
  description: string
  requirements: string[]
  aiMatch: number
  saved: boolean
  hot: boolean
}

export interface TalentProfile {
  id: string
  name: string
  photo: string
  role: string
  location: string
  experience: string
  skills: string[]
  languages: string[]
  certifications: string[]
  verified: boolean
  available: boolean
  badge: string | null
  // Employer-only fields — populated only when the viewer has an employer/admin
  // role (see TalentPool.tsx canSeePrivateFields), sourced from the
  // `placements` table rather than talent_profiles.
  aiReadiness?: number
  pipelineStage?: number
  jobOrderId?: string
  jobOrderTitle?: string
  jobOrderCountry?: string
}
