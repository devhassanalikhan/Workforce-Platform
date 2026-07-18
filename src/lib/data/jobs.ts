// src/lib/data/jobs.ts

import { supabase } from '@/lib/supabase'
import { mockJobs } from '@/data/mockJobs'
import type { Job } from '@/types/domain'
import type { Database } from '@/types/supabase'

type JobRow = Database['public']['Tables']['jobs']['Row'] & {
  companies: Pick<Database['public']['Tables']['companies']['Row'], 'name' | 'logo_url'> | null
}

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  frequency: string | null
): string {
  const suffix = frequency === 'yearly' ? '/yr' : '/mo'
  if (min == null && max == null) return 'Salary not disclosed'
  if (min != null && max != null) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}${suffix}`
  const value = min ?? max
  return `${currency} ${value!.toLocaleString()}${suffix}`
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
    logo: row.companies?.logo_url ?? '/images/logo-placeholder.svg',
    location: row.location,
    destinationCountry: row.destination_country,
    destinationCity: row.destination_city,
    visaStatus: row.visa_status,
    contractDuration: row.contract_duration,
    oepLicenseNo: row.oep_license_no,
    benefits: row.benefits ?? [],
    salaryFrequency: row.salary_frequency ?? 'monthly',
    salary: formatSalary(row.salary_min, row.salary_max, row.currency, row.salary_frequency),
    type: row.employment_type,
    category: row.category,
    experience: row.experience_level,
    posted: formatPosted(row.posted_at),
    description: row.description ?? '',
    requirements: row.requirements ?? [],
    // AI match scoring is part of the deferred AI Assistant slice — real jobs
    // show 0 until that's wired up.
    aiMatch: 0,
    saved: false,
    hot: row.is_hot ?? false,
    publishedOn: row.published_on,
    jobNature: row.job_nature,
    project: row.project,
    ageLimit: row.age_limit,
    fieldOfWork: row.field_of_work,
    availableTill: row.available_till,
    qualifications: row.qualifications,
    note: row.note,
    termsApplied: row.terms_applied ?? undefined,
  }
}

// Returns the set of job IDs the user has saved. Empty Set for guests.
export async function getSavedJobIds(userId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('user_id', userId)

  return new Set((data ?? []).map(r => r.job_id))
}

// Returns the set of job IDs the applicant has already applied to (i.e. has
// an existing placements row for), so the UI can show "Already Applied"
// instead of letting them hit the unique_talent_job constraint. Empty Set
// for guests or applicants with no applications yet.
export async function getAppliedJobIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('placements')
    .select('job_id')
    .eq('talent_id', userId)

  if (error || !data) return new Set()
  return new Set(data.map(r => r.job_id).filter((id): id is string => id != null))
}

const JOB_COLUMNS =
  'id, title, location, destination_country, destination_city, visa_status, contract_duration, oep_license_no, benefits, salary_min, salary_max, salary_frequency, currency, employment_type, category, experience_level, description, requirements, is_hot, posted_at, published_on, job_nature, project, age_limit, field_of_work, available_till, qualifications, note, terms_applied, companies(name, logo_url)'

export interface JobsQuery {
  search?: string
  category?: string
  location?: string
  experience?: string
  type?: string
  sortBy?: string
  limit: number
  offset: number
  /** Restrict results to these job IDs (used for the "Saved" filter toggle). */
  savedJobIds?: string[]
}

export interface JobsPage {
  jobs: Job[]
  total: number
  hasMore: boolean
}

function matchesJobQuery(job: Job, query: JobsQuery): boolean {
  const search = query.search?.trim().toLowerCase()
  if (search) {
    const destination = `${job.destinationCity ?? ''} ${job.destinationCountry ?? ''}`.toLowerCase()
    const haystack = `${job.title} ${job.company} ${job.category} ${job.location} ${destination}`.toLowerCase()
    if (!haystack.includes(search)) return false
  }
  if (query.category && query.category !== 'All Categories' && job.category !== query.category) return false
  if (
    query.location &&
    query.location !== 'All Locations' &&
    !job.location.includes(query.location) &&
    !`${job.destinationCity ?? ''} ${job.destinationCountry ?? ''}`.includes(query.location)
  ) {
    return false
  }
  if (query.experience && query.experience !== 'All Levels' && job.experience !== query.experience) return false
  if (query.type && query.type !== 'All Types' && job.type !== query.type) return false
  if (query.savedJobIds && !query.savedJobIds.includes(job.id)) return false
  return true
}

function paginateMockJobs(query: JobsQuery): JobsPage {
  const filtered = mockJobs.filter(job => matchesJobQuery(job, query))
  const page = filtered.slice(query.offset, query.offset + query.limit)
  return { jobs: page, total: filtered.length, hasMore: query.offset + page.length < filtered.length }
}

// Falls back to bundled demo listings whenever the live `jobs` table has no
// rows at all, so the marketplace keeps showing full content for client
// demos until real jobs are posted. Once the table has data, filtering,
// sorting, and pagination all happen server-side via Supabase's `.range()`
// so the client never has to download the entire jobs table.
export async function getJobs(query: JobsQuery): Promise<JobsPage> {
  const { count: totalCount } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })

  if (!totalCount) {
    return paginateMockJobs(query)
  }

  let dbQuery = supabase.from('jobs').select(JOB_COLUMNS, { count: 'exact' })

  const search = query.search?.trim()
  if (search) {
    const s = search.replace(/[%,]/g, '')
    dbQuery = dbQuery.or(
      `title.ilike.%${s}%,location.ilike.%${s}%,category.ilike.%${s}%,destination_country.ilike.%${s}%,destination_city.ilike.%${s}%`
    )
  }
  if (query.category && query.category !== 'All Categories') {
    dbQuery = dbQuery.eq('category', query.category)
  }
  if (query.location && query.location !== 'All Locations') {
    const l = query.location.replace(/[%,]/g, '')
    dbQuery = dbQuery.or(`location.ilike.%${l}%,destination_country.ilike.%${l}%`)
  }
  if (query.experience && query.experience !== 'All Levels') {
    dbQuery = dbQuery.eq('experience_level', query.experience)
  }
  if (query.type && query.type !== 'All Types') {
    dbQuery = dbQuery.eq('employment_type', query.type)
  }
  if (query.savedJobIds) {
    if (query.savedJobIds.length === 0) {
      return { jobs: [], total: 0, hasMore: false }
    }
    dbQuery = dbQuery.in('id', query.savedJobIds)
  }

  switch (query.sortBy) {
    case 'Salary: High to Low':
      dbQuery = dbQuery.order('salary_max', { ascending: false, nullsFirst: false })
      break
    case 'Salary: Low to High':
      dbQuery = dbQuery.order('salary_min', { ascending: true, nullsFirst: false })
      break
    case 'Newest':
      dbQuery = dbQuery.order('posted_at', { ascending: false })
      break
    default:
      dbQuery = dbQuery.order('is_hot', { ascending: false }).order('posted_at', { ascending: false })
  }
  dbQuery = dbQuery.range(query.offset, query.offset + query.limit - 1)

  const { data, count, error } = await dbQuery

  if (error || !data) {
    return { jobs: [], total: 0, hasMore: false }
  }

  const jobs = (data as JobRow[]).map(mapRow)
  const total = count ?? jobs.length
  return { jobs, total, hasMore: query.offset + jobs.length < total }
}
