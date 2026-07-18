import { supabase } from '@/lib/supabase'
import { mockTalent } from '@/data/mockTalent'
import type { TalentProfile } from '@/types/domain'
import type { Database } from '@/types/supabase'

type TalentRow = Database['public']['Tables']['talent_profiles']['Row']

type PlacementRow = Pick<
  Database['public']['Tables']['placements']['Row'],
  'talent_id' | 'ai_readiness_score' | 'stage' | 'job_order_code'
> & {
  jobs: Pick<Database['public']['Tables']['jobs']['Row'], 'title' | 'location'> | null
}

function mapTalentRow(row: TalentRow): TalentProfile {
  return {
    id: row.id,
    name: row.name,
    photo: row.photo_url ?? '/images/talent-placeholder.svg',
    role: row.role_title,
    location: row.location,
    experience: `${row.experience_years} years`,
    skills: row.skills,
    languages: row.languages,
    certifications: row.certifications,
    verified: row.verified,
    available: row.available,
    badge: row.badge,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    cnic: row.cnic,
    city: row.city,
    phone: row.phone,
    email: row.email,
    category: row.category,
    qualification: row.qualification,
    fieldOfWork: row.field_of_work,
    relevantExperienceYears: row.relevant_experience_years,
    foreignExperience: row.foreign_experience,
    drivingLicense: row.driving_license,
    hasCertification: row.has_certification,
    height: row.height,
  }
}

const TALENT_COLUMNS =
  'id, name, photo_url, role_title, location, experience_years, skills, languages, certifications, verified, available, badge, gender, date_of_birth, cnic, city, phone, email, category, qualification, field_of_work, relevant_experience_years, foreign_experience, driving_license, has_certification, height'

export interface TalentQuery {
  search?: string
  limit: number
  offset: number
}

export interface TalentPage {
  profiles: TalentProfile[]
  total: number
  hasMore: boolean
}

function matchesTalentQuery(t: TalentProfile, search: string | undefined): boolean {
  const q = search?.trim().toLowerCase()
  if (!q) return true
  const haystack = `${t.name} ${t.role} ${t.location} ${t.skills.join(' ')}`.toLowerCase()
  return haystack.includes(q)
}

async function attachPrivateFields(talents: TalentProfile[]): Promise<TalentProfile[]> {
  if (talents.length === 0) return talents

  const { data: placements } = await supabase
    .from('placements')
    .select('talent_id, ai_readiness_score, stage, job_order_code, jobs(title, location)')
    .in('talent_id', talents.map(t => t.id))

  if (!placements) return talents

  const placementByTalent = new Map(
    (placements as PlacementRow[]).map(p => [p.talent_id, p])
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

// Falls back to bundled demo profiles whenever the live `talent_profiles`
// table has no rows yet, so the talent pool keeps showing full content for
// client demos until real candidates are onboarded. Once real profiles
// exist, DB rows are paginated server-side and any demo profiles not
// already represented in the DB are appended as trailing pages, so the
// pool never has to download the entire table to render one page.
//
// Employer-only fields (AI readiness, pipeline stage, job order) live in the
// `placements` table and are only fetched — and RLS-enforced — when the
// caller has already determined the viewer can see them (see
// TalentPool.tsx's canSeePrivateFields, mirrored by the `placements` RLS
// policy itself), and only for the talents on the current page.
export async function getTalent(canSeePrivateFields: boolean, query: TalentQuery): Promise<TalentPage> {
  const { search, limit, offset } = query

  let idQuery = supabase.from('talent_profiles').select('id')
  if (search?.trim()) {
    const s = search.trim().replace(/[%,]/g, '')
    idQuery = idQuery.or(`name.ilike.%${s}%,role_title.ilike.%${s}%,location.ilike.%${s}%`)
  }
  const { data: idRows } = await idQuery
  const dbIds = new Set((idRows ?? []).map(r => r.id as string))
  const dbCount = dbIds.size

  const extraMock = mockTalent.filter(t => !dbIds.has(t.id) && matchesTalentQuery(t, search))
  const total = dbCount + extraMock.length

  let page: TalentProfile[] = []

  if (offset < dbCount) {
    let dbQuery = supabase.from('talent_profiles').select(TALENT_COLUMNS).order('name')
    if (search?.trim()) {
      const s = search.trim().replace(/[%,]/g, '')
      dbQuery = dbQuery.or(`name.ilike.%${s}%,role_title.ilike.%${s}%,location.ilike.%${s}%`)
    }
    const { data } = await dbQuery.range(offset, offset + limit - 1)
    page = ((data ?? []) as TalentRow[]).map(mapTalentRow)

    const remaining = limit - page.length
    if (remaining > 0) {
      page = [...page, ...extraMock.slice(0, remaining)]
    }
  } else {
    page = extraMock.slice(offset - dbCount, offset - dbCount + limit)
  }

  const profiles = canSeePrivateFields ? await attachPrivateFields(page) : page

  return { profiles, total, hasMore: offset + page.length < total }
}
