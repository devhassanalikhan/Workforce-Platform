import { supabase } from '@/lib/supabase'
import { mockPlacementCandidates } from '@/data/mockPlacementCandidates'
import { initialsOf } from '@/lib/initials'
import type { ChecklistStatus, PlacementCandidate } from '@/types/domain'

interface PlacementRow {
  id: string
  job_order_code: string
  talent_profiles: { name: string } | null
  jobs: { title: string; location: string } | null
  companies: { name: string } | null
}

interface ComplianceItemRow {
  placement_id: string
  item_key: string
  label: string
  sublabel: string | null
  status: ChecklistStatus
  detail: string | null
}

// Falls back to bundled demo candidates whenever there are no live Stage 5
// placements visible to the caller yet, so the Placement Dashboard keeps
// showing full content for client demos until real candidates reach this
// stage.
//
// Relies on RLS ("internal ops read all placements" / "employers read their
// own company placements") to scope results — no manual filtering here
// beyond stage = 5, which is what "Stage 5 · FF OES Agency" means.
export async function getPlacementCandidates(): Promise<PlacementCandidate[]> {
  const { data: placements, error } = await supabase
    .from('placements')
    .select('id, job_order_code, talent_profiles(name), jobs(title, location), companies(name)')
    .eq('stage', 5)

  if (error || !placements || placements.length === 0) {
    return mockPlacementCandidates
  }

  const rows = placements as unknown as PlacementRow[]
  const placementIds = rows.map(r => r.id)

  const { data: checklistRows } = await supabase
    .from('compliance_checklist_items')
    .select('placement_id, item_key, label, sublabel, status, detail')
    .in('placement_id', placementIds)

  const checklistByPlacement = new Map<string, ComplianceItemRow[]>()
  for (const item of (checklistRows as ComplianceItemRow[] | null) ?? []) {
    const list = checklistByPlacement.get(item.placement_id) ?? []
    list.push(item)
    checklistByPlacement.set(item.placement_id, list)
  }

  return rows.map(row => {
    const name = row.talent_profiles?.name ?? 'Unknown Candidate'
    return {
      id: row.id,
      name,
      role: row.jobs?.title ?? '',
      country: row.jobs?.location ?? '',
      employer: row.companies?.name ?? 'Unknown Employer',
      jobOrderId: row.job_order_code,
      avatar: initialsOf(name),
      checklist: (checklistByPlacement.get(row.id) ?? []).map(item => ({
        key: item.item_key,
        label: item.label,
        sublabel: item.sublabel ?? '',
        status: item.status,
        detail: item.detail ?? undefined,
      })),
    }
  })
}
