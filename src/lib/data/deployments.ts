import { supabase } from '@/lib/supabase'
import { mockDeployedWorkers } from '@/data/mockDeployedWorkers'
import { initialsOf } from '@/lib/initials'
import type { DeployedWorker, GrievanceSeverity, WorkerStatus } from '@/types/domain'

interface DeploymentRow {
  id: string
  status: WorkerStatus
  deployed_date: string | null
  last_check_in: string | null
  next_check_in: string | null
  escrow_balance: number
  escrow_currency: string
  wellbeing_score: number | null
  placements: {
    job_order_code: string
    talent_profiles: { name: string } | null
    jobs: { title: string; location: string; companies: { name: string } | null } | null
  } | null
}

interface GrievanceRow {
  deployment_id: string
  severity: GrievanceSeverity
  summary: string
  opened_at: string
}

// Job/company location strings in this project are consistently stored as
// "City, Country" (see mockJobs.ts) — reused here to split the Wasl
// dashboard's separate city/country fields.
function splitLocation(location: string): { city: string; country: string } {
  const parts = location.split(',').map(s => s.trim())
  if (parts.length >= 2) return { city: parts[0], country: parts.slice(1).join(', ') }
  return { city: location, country: '' }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Falls back to bundled demo deployments whenever there are no live
// `deployments` rows visible to the caller yet, so the Wasl dashboard keeps
// showing full content for client demos until real workers are deployed.
//
// Relies on the same RLS chain as placements/compliance_checklist_items
// ("same access as parent placement") to scope results to internal ops
// (admin/super_admin) or the deploying employer's own company.
export async function getDeployedWorkers(): Promise<DeployedWorker[]> {
  const { data: deployments, error } = await supabase
    .from('deployments')
    .select(
      'id, status, deployed_date, last_check_in, next_check_in, escrow_balance, escrow_currency, wellbeing_score, placements(job_order_code, talent_profiles(name), jobs(title, location, companies(name)))'
    )

  if (error || !deployments || deployments.length === 0) {
    return mockDeployedWorkers
  }

  const rows = deployments as unknown as DeploymentRow[]

  const { data: grievanceRows } = await supabase
    .from('grievances')
    .select('deployment_id, severity, summary, opened_at')
    .eq('status', 'open')

  const grievanceByDeployment = new Map(
    ((grievanceRows as GrievanceRow[] | null) ?? []).map(g => [g.deployment_id, g])
  )

  return rows.map(row => {
    const { city, country } = splitLocation(row.placements?.jobs?.location ?? '')
    const grievance = grievanceByDeployment.get(row.id)
    const name = row.placements?.talent_profiles?.name ?? 'Unknown Worker'

    return {
      id: row.id,
      name,
      role: row.placements?.jobs?.title ?? '',
      employer: row.placements?.jobs?.companies?.name ?? 'Unknown Employer',
      country,
      city,
      avatar: initialsOf(name),
      status: row.status,
      jobOrderId: row.placements?.job_order_code ?? '',
      deployedDate: formatDate(row.deployed_date),
      lastCheckIn: formatDate(row.last_check_in),
      nextCheckIn: row.status === 'check-in-overdue'
        ? `${formatDate(row.next_check_in)} (OVERDUE)`
        : formatDate(row.next_check_in),
      escrowBalance: row.escrow_balance,
      escrowCurrency: row.escrow_currency,
      wellbeingScore: row.wellbeing_score ?? 0,
      grievance: grievance
        ? { severity: grievance.severity, summary: grievance.summary, opened: formatDate(grievance.opened_at) }
        : undefined,
    }
  })
}
