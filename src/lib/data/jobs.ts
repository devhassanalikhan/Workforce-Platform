import { supabase } from '@/lib/supabase'
import { mockJobs } from '@/data/mockJobs'
import type { Job } from '@/types/domain'

interface JobRow {
  id: string
  title: string
  location: string
  salary_min: number | null
  salary_max: number | null
  currency: string
  employment_type: string
  category: string
  experience_level: string
  description: string | null
  requirements: string[]
  is_hot: boolean
  posted_at: string
  companies: { name: string; logo_url: string | null } | null
}

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (min == null && max == null) return 'Salary not disclosed'
  if (min != null && max != null) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}/mo`
  const value = min ?? max
  return `${currency} ${value!.toLocaleString()}/mo`
}

function formatPosted(postedAt: string): string {
  const days = Math.floor((Date.now() - new Date(postedAt).getTime()) / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function mapRow(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.companies?.name ?? 'Unknown Company',
    logo: row.companies?.logo_url ?? '/images/logo-placeholder.png',
    location: row.location,
    salary: formatSalary(row.salary_min, row.salary_max, row.currency),
    type: row.employment_type,
    category: row.category,
    experience: row.experience_level,
    posted: formatPosted(row.posted_at),
    description: row.description ?? '',
    requirements: row.requirements,
    // AI match scoring is part of the deferred AI Assistant slice — real jobs
    // show 0 until that's wired up.
    aiMatch: 0,
    saved: false,
    hot: row.is_hot,
  }
}

// Falls back to bundled demo listings whenever the live `jobs` table has no
// rows yet, so the marketplace keeps showing full content for client demos
// until real jobs are posted.
export async function getJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      'id, title, location, salary_min, salary_max, currency, employment_type, category, experience_level, description, requirements, is_hot, posted_at, companies(name, logo_url)'
    )

  if (error || !data || data.length === 0) {
    return mockJobs
  }

  return (data as unknown as JobRow[]).map(mapRow)
}
