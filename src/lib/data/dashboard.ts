import { supabase } from '@/lib/supabase'
import type { ChecklistStatus } from '@/types/domain'

export interface DashboardProfile {
  name: string
  roleTitle: string
  location: string
  experienceYears: number
  skills: string[]
  languages: string[]
  certifications: string[]
  available: boolean
  photoUrl: string | null
}

export interface DashboardPlacement {
  id: string
  stage: number
  jobOrderCode: string
  destination: string
  employer: string
  jobTitle: string
  requirements: string[]
}

export interface DashboardChecklistItem {
  id: string
  itemKey: string
  label: string
  sublabel: string | null
  status: ChecklistStatus
  detail: string | null
  /** GAMCA-network approval — only meaningful when itemKey = 'medical'. */
  gamcaApproved: boolean
}

export interface DashboardData {
  profile: DashboardProfile | null
  placement: DashboardPlacement | null
  checklist: DashboardChecklistItem[]
}

interface ProfileRow {
  name: string
  role_title: string
  location: string
  experience_years: number
  skills: string[]
  languages: string[]
  certifications: string[]
  available: boolean
  photo_url: string | null
}

interface PlacementRow {
  id: string
  stage: number
  job_order_code: string
  jobs: { title: string; location: string; requirements: string[] | null; companies: { name: string } | null } | null
}

interface ChecklistRow {
  id: string
  item_key: string
  label: string
  sublabel: string | null
  status: string
  detail: string | null
  gamca_approved: boolean
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [profileResult, placementResult] = await Promise.all([
    supabase
      .from('talent_profiles')
      .select('name, role_title, location, experience_years, skills, languages, certifications, available, photo_url')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('placements')
      .select('id, stage, job_order_code, jobs(title, location, requirements, companies(name))')
      .eq('talent_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const profile: DashboardProfile | null = profileResult.data
    ? {
        name: (profileResult.data as ProfileRow).name,
        roleTitle: (profileResult.data as ProfileRow).role_title,
        location: (profileResult.data as ProfileRow).location,
        experienceYears: (profileResult.data as ProfileRow).experience_years,
        skills: (profileResult.data as ProfileRow).skills ?? [],
        languages: (profileResult.data as ProfileRow).languages ?? [],
        certifications: (profileResult.data as ProfileRow).certifications ?? [],
        available: (profileResult.data as ProfileRow).available ?? true,
        photoUrl: (profileResult.data as ProfileRow).photo_url ?? null,
      }
    : null

  if (!placementResult.data) {
    return { profile, placement: null, checklist: [] }
  }

  const row = placementResult.data as unknown as PlacementRow
  const placement: DashboardPlacement = {
    id: row.id,
    stage: row.stage,
    jobOrderCode: row.job_order_code,
    destination: row.jobs?.location ?? '',
    employer: row.jobs?.companies?.name ?? '',
    jobTitle: row.jobs?.title ?? '',
    requirements: row.jobs?.requirements ?? [],
  }

  const { data: checklistData } = await supabase
    .from('compliance_checklist_items')
    .select('id, item_key, label, sublabel, status, detail, gamca_approved')
    .eq('placement_id', row.id)
    .order('updated_at', { ascending: true })

  const checklist: DashboardChecklistItem[] = ((checklistData as ChecklistRow[] | null) ?? []).map(
    item => ({
      id: item.id,
      itemKey: item.item_key,
      label: item.label,
      sublabel: item.sublabel,
      status: item.status as ChecklistStatus,
      detail: item.detail,
      gamcaApproved: item.gamca_approved,
    })
  )

  return { profile, placement, checklist }
}
