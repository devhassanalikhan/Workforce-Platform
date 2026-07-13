export interface Job {
  id: string
  title: string
  company: string
  logo: string
  location: string
  destinationCountry?: string | null
  destinationCity?: string | null
  visaStatus?: string | null
  contractDuration?: string | null
  oepLicenseNo?: string | null
  benefits?: string[]
  salaryFrequency?: string | null
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
  publishedOn?: string | null
  jobNature?: string | null
  project?: string | null
  ageLimit?: string | null
  fieldOfWork?: string | null
  availableTill?: string | null
  qualifications?: string | null
  note?: string | null
  termsApplied?: boolean
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

// All recognised compliance checklist item keys.  The DB column is free-text
// (TEXT), so this union is advisory — the icon maps in Dashboard.tsx and
// PlacementDashboard.tsx fall back to a generic icon for unrecognised keys.
export type ChecklistItemKey =
  | 'docs'
  | 'contract'
  | 'medical'
  | 'visa'
  | 'language'
  | 'fee'
  | 'flight'
  | 'employer'
  // Pakistani overseas employment (BEOE / emigration clearance process)
  | 'emigration_clearance'
  | 'police_clearance'
  | 'welfare_fund'

export interface PlacementChecklistItem {
  key: string
  label: string
  sublabel: string
  status: ChecklistStatus
  detail?: string
  /** GAMCA-network approval — only meaningful when key = 'medical'. */
  gamcaApproved?: boolean
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

// A course on SkillsTraining.tsx — sourced from training_courses.
// `progress` is always 0 for now: real per-user progress needs
// training_enrollments joined against the signed-in applicant, which isn't
// wired up yet (no applicant course-taking flow exists either).
export interface Course {
  id: string
  title: string
  category: string
  image: string
  duration: string
  level: string
  enrolled: number
  rating: number
  provider: string
  price: string
  description: string
  modules: number
  certification: string
  skills: string[]
  progress: number
}

// An article on BlogResources.tsx — sourced from blog_articles. Note: the
// page's separate `featuredArticle` hero (with author/authorRole) stays
// static — blog_articles has no author columns, so wiring it would mean
// either extending the schema or dropping author info; flagged rather than
// silently doing either.
export interface Article {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  readTime: string
  date: string
  trending: boolean
}
