import { supabase } from '@/lib/supabase'

export interface ScraperRun {
  id:            string
  source:        string
  started_at:    string
  completed_at:  string | null
  jobs_found:    number
  jobs_inserted: number
  jobs_updated:  number
  status:        'running' | 'success' | 'failed'
  error_message: string | null
}

export async function getLastScraperRun(): Promise<ScraperRun | null> {
  const { data } = await supabase
    .from('scraper_runs')
    .select('id, source, started_at, completed_at, jobs_found, jobs_inserted, jobs_updated, status, error_message')
    .eq('source', 'beoe')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (data as ScraperRun | null)
}

export async function getBeoeJobCount(): Promise<number> {
  const { count } = await supabase
    .from('jobs')
    .select('id', { count: 'exact', head: true })
    .eq('source', 'beoe')

  return count ?? 0
}

export async function triggerScraper(): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabase.functions.invoke('scrape-beoe', {
    method: 'POST',
    body:   {},
  })

  if (error) {
    return { success: false, message: error.message ?? 'Unknown error' }
  }

  const result = data as { success?: boolean; inserted?: number; updated?: number; found?: number; error?: string }

  if (!result?.success) {
    return { success: false, message: result?.error ?? 'Scraper returned an error' }
  }

  return {
    success: true,
    message: `Done — ${result.found ?? 0} found, ${result.inserted ?? 0} inserted, ${result.updated ?? 0} updated.`,
  }
}
