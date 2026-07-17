// src/lib/data/adminEmployers.ts
//
// Admin-only queries. Kept separate from employer.ts on purpose — employer.ts
// serves the single-company employer-facing view (RLS-scoped to their own
// company), while this module serves the admin oversight view (unrestricted,
// across ALL companies). Mixing the two into one function was exactly the
// bug that caused getActiveJobOrder() to only ever return a single row —
// don't repeat that pattern here.

import { supabase } from '@/lib/supabase'
import { getCompanyJobs, type CompanyJob } from '@/lib/data/employer'
import { initialsOf } from '@/lib/initials'
import type { Database } from '@/types/supabase'

// Stage at which a candidate is considered "shortlisted" for the admin
// overview counts. NOTE: EmployerPortal.tsx's "Shortlist" label in its
// JO_PIPELINE funnel is hardcoded mock data, not tied to a real
// placements.stage value — there is no existing convention to match here.
// Defaulting to stage >= 4 ("Readiness Cleared" onward, i.e. cleared to be
// shown to an employer) — revisit this threshold once real placement
// volume makes the distinction matter.
const SHORTLISTED_MIN_STAGE = 4

export interface AdminCompanyRow {
  id: string
  name: string
  logo_url: string | null
  planTier: string
  businessType: string | null
  country: string | null
  registrationNumber: string | null
  registrationAuthority: string | null
  companyAddress: string | null
  companyWebsite: string | null
  contactPerson: string | null
  designation: string | null
  phoneCountryCode: string | null
  phoneNumber: string | null
  jobCount: number
  applicationCount: number
  shortlistedCount: number
}

type PlacementStageRow = Pick<Database['public']['Tables']['placements']['Row'], 'stage'> & {
  jobs: Pick<Database['public']['Tables']['jobs']['Row'], 'company_id'> | null
}

// Two queries total (not N+1): one for companies + job counts, one for all
// placements joined to their job's company_id, aggregated client-side.
export async function getAdminCompanyOverview(): Promise<AdminCompanyRow[]> {
  // Query 1 — companies. plan_tier may not exist yet if that migration
  // hasn't been applied — fall back gracefully rather than erroring the
  // whole page.
  let companies: Pick<
    Database['public']['Tables']['companies']['Row'],
    | 'id' | 'name' | 'logo_url' | 'plan_tier' | 'business_type' | 'country'
    | 'registration_number' | 'registration_authority' | 'company_address' | 'company_website'
    | 'contact_person' | 'designation' | 'phone_country_code' | 'phone_number'
  >[] = []
  {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, logo_url, plan_tier, business_type, country, registration_number, registration_authority, company_address, company_website, contact_person, designation, phone_country_code, phone_number')
    if (error) {
      // Likely because new columns don't exist yet — fall back to basics.
      const fallback = await supabase.from('companies').select('id, name')
      companies = (fallback.data ?? []).map(c => ({
        ...c,
        logo_url: null, plan_tier: null, business_type: null, country: null,
        registration_number: null, registration_authority: null, company_address: null,
        company_website: null, contact_person: null, designation: null,
        phone_country_code: null, phone_number: null,
      }))
    } else {
      companies = data ?? []
    }
  }

  // Query 2 — job counts per company.
  const { data: jobRows } = await supabase.from('jobs').select('id, company_id')
  const jobCountByCompany = new Map<string, number>()
  for (const j of jobRows ?? []) {
    if (!j.company_id) continue
    jobCountByCompany.set(j.company_id, (jobCountByCompany.get(j.company_id) ?? 0) + 1)
  }

  // Query 3 — all placements joined to their job's company_id, for
  // application + shortlisted counts. Admin has FOR ALL on both tables, so
  // this returns everything with no manual filtering needed.
  const { data: placementRows } = await supabase
    .from('placements')
    .select('stage, jobs!inner(company_id)')

  const applicationCountByCompany = new Map<string, number>()
  const shortlistedCountByCompany = new Map<string, number>()
  for (const p of (placementRows ?? []) as PlacementStageRow[]) {
    const companyId = p.jobs?.company_id
    if (!companyId) continue
    applicationCountByCompany.set(companyId, (applicationCountByCompany.get(companyId) ?? 0) + 1)
    if (p.stage >= SHORTLISTED_MIN_STAGE) {
      shortlistedCountByCompany.set(companyId, (shortlistedCountByCompany.get(companyId) ?? 0) + 1)
    }
  }

  return companies.map(c => ({
    id: c.id,
    name: c.name,
    logo_url: c.logo_url ?? null,
    planTier: c.plan_tier ?? 'Not set',
    businessType: c.business_type ?? null,
    country: c.country ?? null,
    registrationNumber: c.registration_number ?? null,
    registrationAuthority: c.registration_authority ?? null,
    companyAddress: c.company_address ?? null,
    companyWebsite: c.company_website ?? null,
    contactPerson: c.contact_person ?? null,
    designation: c.designation ?? null,
    phoneCountryCode: c.phone_country_code ?? null,
    phoneNumber: c.phone_number ?? null,
    jobCount: jobCountByCompany.get(c.id) ?? 0,
    applicationCount: applicationCountByCompany.get(c.id) ?? 0,
    shortlistedCount: shortlistedCountByCompany.get(c.id) ?? 0,
  }))
}

// Thin re-export so the admin page imports everything it needs from one
// module, while the underlying query logic stays defined once in employer.ts.
export async function getAdminCompanyJobs(companyId: string): Promise<CompanyJob[]> {
  return getCompanyJobs(companyId)
}

export interface AdminApplicationRow {
  id: string
  jobTitle: string
  stage: number
  talentName: string
  talentInitials: string
  talentRoleTitle: string
  talentLocation: string
  appliedAt: string
}

type AdminApplicationJoinRow = Pick<
  Database['public']['Tables']['placements']['Row'],
  'id' | 'stage' | 'created_at'
> & {
  jobs: Pick<Database['public']['Tables']['jobs']['Row'], 'title'> | null
  talent_profiles: Pick<
    Database['public']['Tables']['talent_profiles']['Row'],
    'name' | 'role_title' | 'location'
  > | null
}

// Full-detail applications list for one company — admin only, unrestricted
// (no masking, unlike the employer-facing view being built separately).
export async function getAdminCompanyApplications(companyId: string): Promise<AdminApplicationRow[]> {
  const { data, error } = await supabase
    .from('placements')
    .select('id, stage, created_at, jobs!inner(title, company_id), talent_profiles(name, role_title, location)')
    .eq('jobs.company_id', companyId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as AdminApplicationJoinRow[]).map(row => ({
    id: row.id,
    jobTitle: row.jobs?.title ?? 'Unknown Job',
    stage: row.stage,
    talentName: row.talent_profiles?.name ?? 'Unknown Candidate',
    talentInitials: initialsOf(row.talent_profiles?.name ?? '??'),
    talentRoleTitle: row.talent_profiles?.role_title ?? '',
    talentLocation: row.talent_profiles?.location ?? 'Unknown',
    appliedAt: row.created_at,
  }))
}
