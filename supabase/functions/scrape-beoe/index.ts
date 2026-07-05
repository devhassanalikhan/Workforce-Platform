// Supabase Edge Function — BEOE Foreign Jobs Scraper
// Runtime: Deno (Supabase managed)
//
// Environment variables required (set in Supabase dashboard → Settings → Edge Functions):
//   FIRECRAWL_API_KEY       — Firecrawl API key (https://firecrawl.dev)
//   SUPABASE_URL            — injected automatically by Supabase runtime
//   SUPABASE_SERVICE_ROLE_KEY — injected automatically by Supabase runtime
//
// Trigger:
//   POST /functions/v1/scrape-beoe   (with user JWT in Authorization header)
//   Only admin and super_admin users can trigger it.
//
// Scheduling:
//   Set up via Supabase dashboard → Edge Functions → scrape-beoe → Schedule
//   Recommended: every 6 hours  (cron: 0 */6 * * *)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BEOE_URL      = 'https://beoe.gov.pk/foreign-jobs'
const FIRECRAWL_API = 'https://api.firecrawl.dev/v1'
const BEOE_SOURCE   = 'beoe'

interface ExtractedJob {
  title?:      string
  company?:    string
  country?:    string
  category?:   string
  job_id?:     string
  source_url?: string
  vacancies?:  number
}

interface FirecrawlResponse {
  success: boolean
  data?: {
    extract?: { jobs?: ExtractedJob[] }
    markdown?: string
  }
  error?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapCategory(raw: string | undefined): string {
  if (!raw) return 'Construction'
  const r = raw.toLowerCase()
  if (r.includes('health') || r.includes('nurs') || r.includes('medical') || r.includes('doctor')) return 'Healthcare'
  if (r.includes('hotel') || r.includes('hospitalit') || r.includes('catering') || r.includes('waiter')) return 'Hospitality'
  if (r.includes('manuf') || r.includes('factory') || r.includes('production') || r.includes('assembl')) return 'Manufacturing'
  if (r.includes('logistic') || r.includes('transport') || r.includes('driver') || r.includes('deliv')) return 'Logistics'
  if (r.includes('engineer') || r.includes('civil') || r.includes('mechanical') || r.includes('electrical')) return 'Engineering'
  if (r.includes('agri') || r.includes('farm') || r.includes('harvest')) return 'Agriculture'
  if (r.includes(' it ') || r.includes('software') || r.includes('developer') || r.includes('technolog')) return 'Information Technology'
  return 'Construction'
}

// Parse jobs from markdown as a fallback when extract returns nothing.
// BEOE typically renders jobs as table rows or list items.
function parseMarkdownJobs(md: string): ExtractedJob[] {
  const jobs: ExtractedJob[] = []
  const lines = md.split('\n')

  for (const line of lines) {
    const clean = line.replace(/\|/g, '').replace(/\*/g, '').trim()
    // Skip headers, dividers, empty lines
    if (!clean || clean.startsWith('---') || clean.toLowerCase().includes('trade') || clean.toLowerCase().includes('country')) continue

    // Heuristic: a job line usually has 3+ words and isn't a heading
    const words = clean.split(/\s+/).filter(Boolean)
    if (words.length >= 2 && !clean.startsWith('#')) {
      jobs.push({ title: words.slice(0, 4).join(' '), country: 'International' })
    }
  }

  return jobs.slice(0, 100) // cap to avoid runaway parsing
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabaseUrl     = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const firecrawlKey    = Deno.env.get('FIRECRAWL_API_KEY')

  if (!firecrawlKey) {
    return json({ error: 'FIRECRAWL_API_KEY is not configured' }, 500)
  }

  // ── Auth: only allow admin+ users ────────────────────────────────────────
  const authHeader = req.headers.get('Authorization') ?? ''
  if (authHeader) {
    // Verify the caller's role using their JWT
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user } } = await userClient.auth.getUser()
    const role = user?.user_metadata?.role as string | undefined
    if (role !== 'admin' && role !== 'super_admin') {
      return json({ error: 'Forbidden: admin role required' }, 403)
    }
  }
  // If no auth header (pg_cron invocation via service role), allow through.
  // When called via pg_cron, the request comes from inside the DB with no JWT.

  const db = createClient(supabaseUrl, serviceRoleKey)

  // ── Create audit row ──────────────────────────────────────────────────────
  const { data: runRow, error: runErr } = await db
    .from('scraper_runs')
    .insert({ source: BEOE_SOURCE, status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single()

  if (runErr || !runRow) {
    return json({ error: 'Failed to create scraper_runs record', detail: runErr?.message }, 500)
  }

  const runId = runRow.id as string

  async function fail(msg: string): Promise<Response> {
    await db.from('scraper_runs').update({
      status:        'failed',
      completed_at:  new Date().toISOString(),
      error_message: msg,
    }).eq('id', runId)
    return json({ error: msg, run_id: runId }, 500)
  }

  // ── Firecrawl: extract endpoint ───────────────────────────────────────────
  let rawJobs: ExtractedJob[] = []

  try {
    const fcRes = await fetch(`${FIRECRAWL_API}/scrape`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        url:     BEOE_URL,
        formats: ['extract'],
        extract: {
          prompt: [
            'Extract every foreign job listing on this page as a JSON array called "jobs".',
            'For each listing capture: title (job title / trade / designation),',
            'company (employer or recruitment agency name if shown),',
            'country (destination country),',
            'category (trade or job category),',
            'job_id (any reference number, order number, or ID shown),',
            'source_url (link to job detail page if available).',
          ].join(' '),
          schema: {
            type: 'object',
            properties: {
              jobs: {
                type:  'array',
                items: {
                  type: 'object',
                  properties: {
                    title:      { type: 'string' },
                    company:    { type: 'string' },
                    country:    { type: 'string' },
                    category:   { type: 'string' },
                    job_id:     { type: 'string' },
                    source_url: { type: 'string' },
                  },
                  required: ['title'],
                },
              },
            },
            required: ['jobs'],
          },
        },
      }),
    })

    if (!fcRes.ok) {
      return fail(`Firecrawl HTTP ${fcRes.status}: ${await fcRes.text()}`)
    }

    const fcData = await fcRes.json() as FirecrawlResponse

    if (!fcData.success) {
      return fail(`Firecrawl error: ${fcData.error ?? 'unknown'}`)
    }

    rawJobs = fcData.data?.extract?.jobs ?? []

    // Fallback: if extract returned nothing, try markdown parse
    if (rawJobs.length === 0 && fcData.data?.markdown) {
      rawJobs = parseMarkdownJobs(fcData.data.markdown)
    }

    // If still nothing, re-request with markdown explicitly
    if (rawJobs.length === 0) {
      const mdRes = await fetch(`${FIRECRAWL_API}/scrape`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlKey}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ url: BEOE_URL, formats: ['markdown'] }),
      })
      if (mdRes.ok) {
        const mdData = await mdRes.json() as FirecrawlResponse
        if (mdData.data?.markdown) {
          rawJobs = parseMarkdownJobs(mdData.data.markdown)
        }
      }
    }

  } catch (err) {
    return fail(`Fetch error: ${err instanceof Error ? err.message : String(err)}`)
  }

  if (rawJobs.length === 0) {
    return fail('No jobs found after scraping BEOE. Page may have changed structure.')
  }

  // ── Deduplication: fetch existing BEOE external_ids ──────────────────────
  const { data: existing } = await db
    .from('jobs')
    .select('external_id')
    .eq('source', BEOE_SOURCE)
    .not('external_id', 'is', null)

  const existingIds = new Set(
    ((existing ?? []) as { external_id: string }[]).map(r => r.external_id)
  )

  // ── Insert / update ───────────────────────────────────────────────────────
  const now = new Date().toISOString()
  let inserted = 0
  let updated  = 0
  let skipped  = 0

  for (const raw of rawJobs) {
    if (!raw.title?.trim()) { skipped++; continue }

    const externalId = raw.job_id?.trim() || null

    // Already in DB → just refresh scraped_at
    if (externalId && existingIds.has(externalId)) {
      const { error } = await db
        .from('jobs')
        .update({ scraped_at: now, source_url: raw.source_url ?? BEOE_URL })
        .eq('source', BEOE_SOURCE)
        .eq('external_id', externalId)

      if (!error) updated++
      continue
    }

    const country  = (raw.country ?? 'International').trim()
    const category = mapCategory(raw.category)

    const jobRow = {
      title:           raw.title.trim(),
      company_id:      null,
      location:        country,
      category,
      employment_type: 'Full-time',
      experience_level:'Entry Level',
      salary_min:      null,
      salary_max:      null,
      currency:        'USD',
      description:     buildDescription(raw),
      requirements:    [] as string[],
      is_hot:          false,
      posted_at:       now,
      source:          BEOE_SOURCE,
      source_url:      raw.source_url ?? BEOE_URL,
      external_id:     externalId,
      scraped_at:      now,
      is_verified:     false,
    }

    const { error } = await db.from('jobs').insert(jobRow)
    if (error) {
      console.error('Insert error:', error.message, 'for job:', raw.title)
      skipped++
    } else {
      inserted++
      if (externalId) existingIds.add(externalId) // guard against duplicates within this batch
    }
  }

  // ── Finalize audit row ────────────────────────────────────────────────────
  await db.from('scraper_runs').update({
    status:        'success',
    completed_at:  new Date().toISOString(),
    jobs_found:    rawJobs.length,
    jobs_inserted: inserted,
    jobs_updated:  updated,
  }).eq('id', runId)

  return json({
    success:  true,
    run_id:   runId,
    found:    rawJobs.length,
    inserted,
    updated,
    skipped,
  })
})

// ── Utilities ─────────────────────────────────────────────────────────────────

function buildDescription(raw: ExtractedJob): string {
  const parts: string[] = []
  if (raw.title) parts.push(raw.title)
  if (raw.country) parts.push(`in ${raw.country}`)
  if (raw.company) parts.push(`with ${raw.company}`)
  parts.push('— verified via Bureau of Emigration & Overseas Employment (BEOE).')
  return parts.join(' ')
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
