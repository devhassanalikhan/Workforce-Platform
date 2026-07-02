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

export interface ComplianceItem {
  label: string
  status: 'complete' | 'pending' | 'flagged'
}

// The employer-facing "active job order" snapshot on EmployerEnterprise.tsx —
// one placement (a talent matched against one of the employer's jobs) plus
// its compliance checklist.
export interface ActiveJobOrder {
  jobOrderCode: string
  candidateName: string
  candidateInitials: string
  origin: string
  destination: string
  aiScore: number
  stage: number
  jobTitle: string
  complianceItems: ComplianceItem[]
}

export type WorkerStatus = 'active' | 'check-in-overdue' | 'grievance-open'
export type GrievanceSeverity = 'low' | 'medium' | 'high'

export interface WorkerGrievance {
  severity: GrievanceSeverity
  summary: string
  opened: string
}

// One deployed worker on WaslDashboard.tsx — a `deployments` row (Stage 6 of
// a placement) joined with the talent, job, and employer it belongs to.
export interface DeployedWorker {
  id: string
  name: string
  role: string
  employer: string
  country: string
  city: string
  avatar: string
  status: WorkerStatus
  jobOrderId: string
  deployedDate: string
  lastCheckIn: string
  nextCheckIn: string
  escrowBalance: number
  escrowCurrency: string
  grievance?: WorkerGrievance
  wellbeingScore: number
}

export type ChecklistStatus = 'complete' | 'pending' | 'flagged'

export interface PlacementChecklistItem {
  key: string
  label: string
  sublabel: string
  status: ChecklistStatus
  detail?: string
}

// One candidate on PlacementDashboard.tsx (Stage 5 — FF OES compliance
// handover) — a `placements` row joined with its `compliance_checklist_items`.
export interface PlacementCandidate {
  id: string
  name: string
  role: string
  country: string
  employer: string
  jobOrderId: string
  avatar: string
  checklist: PlacementChecklistItem[]
}
