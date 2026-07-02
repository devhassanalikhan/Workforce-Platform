import { supabase } from '@/lib/supabase'
import { mockTalent } from '@/data/mockTalent'
import type { TalentProfile } from '@/types/domain'

interface TalentRow {
  id: string
  name: string
  photo_url: string | null
  role_title: string
  location: string
  experience_years: number
  skills: string[]
  languages: string[]
  certifications: string[]
  verified: boolean
  available: boolean
  badge: string | null
}

interface PlacementRow {
  talent_id: string
  ai_readiness_score: number | null
  stage: number
  job_order_code: string
  jobs: { title: string; location: string } | null
}

function mapTalentRow(row: TalentRow): TalentProfile {
  return {
    id: row.id,
    name: row.name,
    photo: row.photo_url ?? '/images/talent-placeholder.jpg',
    role: row.role_title,
    location: row.location,
    experience: `${row.experience_years} years`,
    skills: row.skills,
    languages: row.languages,
    certifications: row.certifications,
    verified: row.verified,
    available: row.available,
    badge: row.badge,
  }
}

// Falls back to bundled demo profiles whenever the live `talent_profiles`
// table has no rows yet, so the talent pool keeps showing full content for
// client demos until real candidates are onboarded.
//
// Employer-only fields (AI readiness, pipeline stage, job order) live in the
// `placements` table and are only fetched — and RLS-enforced — when the
// caller has already determined the viewer can see them (see
// TalentPool.tsx's canSeePrivateFields, mirrored by the `placements` RLS
// policy itself).
export async function getTalent(canSeePrivateFields: boolean): Promise<TalentProfile[]> {
  const { data, error } = await supabase
    .from('talent_profiles')
    .select(
      'id, name, photo_url, role_title, location, experience_years, skills, languages, certifications, verified, available, badge'
    )

  if (error || !data || data.length === 0) {
    return mockTalent
  }

  const talents = (data as TalentRow[]).map(mapTalentRow)

  if (!canSeePrivateFields) {
    return talents
  }

  const { data: placements } = await supabase
    .from('placements')
    .select('talent_id, ai_readiness_score, stage, job_order_code, jobs(title, location)')

  if (!placements) {
    return talents
  }

  const placementByTalent = new Map(
    (placements as unknown as PlacementRow[]).map(p => [p.talent_id, p])
  )

  return talents.map(t => {
    const placement = placementByTalent.get(t.id)
    if (!placement) return t
    return {
      ...t,
      aiReadiness: placement.ai_readiness_score ?? undefined,
      pipelineStage: placement.stage,
      jobOrderId: placement.job_order_code,
      jobOrderTitle: placement.jobs?.title,
      jobOrderCountry: placement.jobs?.location,
    }
  })
}
