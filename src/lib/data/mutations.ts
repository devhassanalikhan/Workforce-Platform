// src/lib/data/mutations.ts

import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface JobPayload {
  title: string
  location: string
  salary_min: number | null
  salary_max: number | null
  currency: string
  employment_type: string
  category: string
  experience_level: string
  description: string
  requirements: string[]
  is_hot: boolean
  company_id: string
}

export interface TalentProfilePayload {
  id: string          // = auth.uid()
  name: string
  photo_url: string | null
  role_title: string
  location: string
  experience_years: number
  skills: string[]
  languages: string[]
  certifications: string[]
  available: boolean
}

export interface CompanyPayload {
  name: string
  logo_url: string | null
}

export interface PlacementPayload {
  talent_id: string
  job_id: string
  stage: number
  job_order_code: string
}

export interface ChecklistItemUpdate {
  status: 'complete' | 'pending' | 'flagged'
  detail?: string
}

export interface DeploymentUpdate {
  status: 'active' | 'check-in-overdue' | 'grievance-open'
  last_check_in?: string
  next_check_in?: string
  wellbeing_score?: number
  escrow_balance?: number
}

export interface GrievancePayload {
  deployment_id: string
  severity: 'low' | 'medium' | 'high'
  summary: string
}

export interface GrievanceUpdate {
  status: 'open' | 'resolved'
  resolution_note?: string
}

export type MutationResult<T = void> = { data: T | null; error: string | null }

// ── Jobs ───────────────────────────────────────────────────────────────────────

export async function createJob(payload: JobPayload): Promise<MutationResult<{ id: string }>> {
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...payload, posted_at: new Date().toISOString() })
    .select('id')
    .single()
  return { data: data as { id: string } | null, error: error?.message ?? null }
}

export async function updateJob(
  id: string,
  payload: Partial<JobPayload>
): Promise<MutationResult> {
  const { error } = await supabase.from('jobs').update(payload).eq('id', id)
  return { data: null, error: error?.message ?? null }
}

export async function deleteJob(id: string): Promise<MutationResult> {
  const { error } = await supabase.from('jobs').delete().eq('id', id)
  return { data: null, error: error?.message ?? null }
}

// ── Talent Profiles ────────────────────────────────────────────────────────────

export async function upsertTalentProfile(
  payload: TalentProfilePayload
): Promise<MutationResult> {
  const { error } = await supabase.from('talent_profiles').upsert(payload, { onConflict: 'id' })
  return { data: null, error: error?.message ?? null }
}

export async function updateTalentProfile(
  id: string,
  payload: Partial<Omit<TalentProfilePayload, 'id'>>
): Promise<MutationResult> {
  const { error } = await supabase.from('talent_profiles').update(payload).eq('id', id)
  return { data: null, error: error?.message ?? null }
}

// ── Companies ──────────────────────────────────────────────────────────────────

export async function updateCompany(
  id: string,
  payload: Partial<CompanyPayload>
): Promise<MutationResult> {
  const { error } = await supabase.from('companies').update(payload).eq('id', id)
  return { data: null, error: error?.message ?? null }
}

// ── Placements ─────────────────────────────────────────────────────────────────

export async function applyToJob(
  payload: PlacementPayload
): Promise<MutationResult<{ id: string }>> {
  const { data, error } = await supabase
    .from('placements')
    .insert(payload)
    .select('id')
    .single()
  return { data: data as { id: string } | null, error: error?.message ?? null }
}

export async function updatePlacementStage(
  id: string,
  stage: number
): Promise<MutationResult> {
  const { error } = await supabase.from('placements').update({ stage }).eq('id', id)
  return { data: null, error: error?.message ?? null }
}

export async function createPlacement(
  payload: PlacementPayload
): Promise<MutationResult<{ id: string }>> {
  const { data, error } = await supabase
    .from('placements')
    .insert(payload)
    .select('id')
    .single()
  return { data: data as { id: string } | null, error: error?.message ?? null }
}

export async function deletePlacement(id: string): Promise<MutationResult> {
  const { error } = await supabase.from('placements').delete().eq('id', id)
  return { data: null, error: error?.message ?? null }
}

// ── Compliance Checklist ───────────────────────────────────────────────────────

export async function updateChecklistItem(
  id: string,
  payload: ChecklistItemUpdate
): Promise<MutationResult> {
  const { error } = await supabase
    .from('compliance_checklist_items')
    .update(payload)
    .eq('id', id)
  return { data: null, error: error?.message ?? null }
}

// ── Deployments ────────────────────────────────────────────────────────────────

export async function updateDeployment(
  id: string,
  payload: DeploymentUpdate
): Promise<MutationResult> {
  const { error } = await supabase.from('deployments').update(payload).eq('id', id)
  return { data: null, error: error?.message ?? null }
}

export async function logCheckIn(deploymentId: string): Promise<MutationResult> {
  const now = new Date().toISOString()
  // next check-in = 30 days from now
  const next = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  const { error } = await supabase
    .from('deployments')
    .update({ last_check_in: now, next_check_in: next, status: 'active' })
    .eq('id', deploymentId)
  return { data: null, error: error?.message ?? null }
}

export async function releaseEscrow(
  deploymentId: string,
  amount: number
): Promise<MutationResult> {
  // Decrement the escrow balance by `amount`
  const { data: current, error: fetchErr } = await supabase
    .from('deployments')
    .select('escrow_balance')
    .eq('id', deploymentId)
    .single()
  if (fetchErr) return { data: null, error: fetchErr.message }
  const row = current as { escrow_balance: number } | null
  const newBalance = Math.max(0, (row?.escrow_balance ?? 0) - amount)
  const { error } = await supabase
    .from('deployments')
    .update({ escrow_balance: newBalance })
    .eq('id', deploymentId)
  return { data: null, error: error?.message ?? null }
}

// ── Grievances ─────────────────────────────────────────────────────────────────

export async function fileGrievance(
  payload: GrievancePayload
): Promise<MutationResult<{ id: string }>> {
  const { data, error } = await supabase
    .from('grievances')
    .insert({ ...payload, status: 'open', opened_at: new Date().toISOString() })
    .select('id')
    .single()
  return { data: data as { id: string } | null, error: error?.message ?? null }
}

export async function resolveGrievance(
  id: string,
  payload: GrievanceUpdate
): Promise<MutationResult> {
  const { error } = await supabase.from('grievances').update(payload).eq('id', id)
  return { data: null, error: error?.message ?? null }
}

// ── Training Enrollments ───────────────────────────────────────────────────────

export async function enrollInCourse(
  talentId: string,
  courseId: string
): Promise<MutationResult<{ id: string }>> {
  const { data, error } = await supabase
    .from('training_enrollments')
    .insert({ talent_id: talentId, course_id: courseId, progress: 0, enrolled_at: new Date().toISOString() })
    .select('id')
    .single()
  return { data: data as { id: string } | null, error: error?.message ?? null }
}

export async function updateCourseProgress(
  talentId: string,
  courseId: string,
  progress: number
): Promise<MutationResult> {
  const { error } = await supabase
    .from('training_enrollments')
    .update({ progress })
    .eq('talent_id', talentId)
    .eq('course_id', courseId)
  return { data: null, error: error?.message ?? null }
}

// ── Blog Articles ──────────────────────────────────────────────────────────────

export interface ArticlePayload {
  title: string
  excerpt: string
  image_url: string | null
  category: string
  read_time: string
  trending: boolean
}

export async function createArticle(
  payload: ArticlePayload
): Promise<MutationResult<{ id: string }>> {
  const { data, error } = await supabase
    .from('blog_articles')
    .insert({ ...payload, published_at: new Date().toISOString() })
    .select('id')
    .single()
  return { data: data as { id: string } | null, error: error?.message ?? null }
}

export async function updateArticle(
  id: string,
  payload: Partial<ArticlePayload>
): Promise<MutationResult> {
  const { error } = await supabase.from('blog_articles').update(payload).eq('id', id)
  return { data: null, error: error?.message ?? null }
}

export async function deleteArticle(id: string): Promise<MutationResult> {
  const { error } = await supabase.from('blog_articles').delete().eq('id', id)
  return { data: null, error: error?.message ?? null }
}
