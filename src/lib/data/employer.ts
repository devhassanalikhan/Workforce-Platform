import { supabase } from '@/lib/supabase'
import { mockActiveJobOrder } from '@/data/mockActiveJobOrder'
import type { ActiveJobOrder, ComplianceItem } from '@/types/domain'

interface PlacementWithJoinsRow {
  id: string
  job_order_code: string
  ai_readiness_score: number | null
  stage: number
  talent_profiles: { name: string; location: string } | null
  jobs: { title: string; location: string } | null
}

interface ComplianceItemRow {
  label: string
  status: 'complete' | 'pending' | 'flagged'
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
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

  const row = placement as unknown as PlacementWithJoinsRow

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
