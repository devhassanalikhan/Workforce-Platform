// src/lib/data/employer.ts

import { supabase } from '@/lib/supabase'
import { mockActiveJobOrder } from '@/data/mockActiveJobOrder'
import type { ActiveJobOrder, ComplianceItem } from '@/types/domain'
import { initialsOf } from '@/lib/initials'
import type { Database } from '@/types/supabase'

export type CompanyJob = Pick<
  Database['public']['Tables']['jobs']['Row'],
  | 'id' | 'title' | 'location' | 'destination_country' | 'destination_city' | 'visa_status'
  | 'contract_duration' | 'oep_license_no' | 'benefits' | 'salary_min' | 'salary_max'
  | 'salary_frequency' | 'currency' | 'employment_type' | 'category' | 'experience_level'
  | 'description' | 'requirements' | 'is_hot' | 'posted_at'
>

export async function getCompanyJobs(companyId: string): Promise<CompanyJob[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, location, destination_country, destination_city, visa_status, contract_duration, oep_license_no, benefits, salary_min, salary_max, salary_frequency, currency, employment_type, category, experience_level, description, requirements, is_hot, posted_at')
    .eq('company_id', companyId)
    .order('posted_at', { ascending: false })

  if (error || !data) return []
  return data as CompanyJob[]
}

type PlacementWithJoinsRow = Pick<
  Database['public']['Tables']['placements']['Row'],
  'id' | 'job_order_code' | 'ai_readiness_score' | 'stage'
> & {
  talent_profiles: Pick<Database['public']['Tables']['talent_profiles']['Row'], 'name' | 'location'> | null
  jobs: Pick<Database['public']['Tables']['jobs']['Row'], 'title' | 'location'> | null
}

type ComplianceItemRow = Pick<Database['public']['Tables']['compliance_checklist_items']['Row'], 'label'> & {
  status: 'complete' | 'pending' | 'flagged'
}

// Falls back to the bundled demo job order whenever the caller's company has
// no live placements yet, so the employer portal keeps showing full content
// for client demos until a real placement exists.
//
// Relies on RLS ("employers read their own company placements") to already
// scope this to the signed-in employer's company — no manual company_id
// filtering needed here.
export async function getActiveJobOrder(): Promise<ActiveJobOrder> {
  const { data: placement, error } = await supabase
    .from('placements')
    .select('id, job_order_code, ai_readiness_score, stage, talent_profiles(name, location), jobs(title, location)')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !placement) {
    return mockActiveJobOrder
  }

  const row = placement as PlacementWithJoinsRow

  const { data: complianceRows } = await supabase
    .from('compliance_checklist_items')
    .select('label, status')
    .eq('placement_id', row.id)

  const complianceItems: ComplianceItem[] =
    complianceRows && complianceRows.length > 0
      ? (complianceRows as ComplianceItemRow[])
      : mockActiveJobOrder.complianceItems

  return {
    jobOrderCode: row.job_order_code,
    candidateName: row.talent_profiles?.name ?? 'Unknown Candidate',
    candidateInitials: initialsOf(row.talent_profiles?.name ?? '??'),
    origin: row.talent_profiles?.location ?? 'Unknown',
    destination: row.jobs?.location ?? 'Unknown',
    aiScore: row.ai_readiness_score ?? 0,
    stage: row.stage,
    jobTitle: row.jobs?.title ?? '',
    complianceItems,
  }
}
