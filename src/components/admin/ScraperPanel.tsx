import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle2, XCircle, Clock, Loader2, Rss } from 'lucide-react'
import { toast } from 'sonner'
import { getLastScraperRun, getBeoeJobCount, triggerScraper, type ScraperRun } from '@/lib/data/scraper'

export default function ScraperPanel() {
  const [run,       setRun]       = useState<ScraperRun | null>(null)
  const [count,     setCount]     = useState<number>(0)
  const [loading,   setLoading]   = useState(true)
  const [running,   setRunning]   = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [lastRun, beoeCount] = await Promise.all([
      getLastScraperRun(),
      getBeoeJobCount(),
    ])
    setRun(lastRun)
    setCount(beoeCount)
    setLoading(false)
  }

  async function handleRun() {
    setRunning(true)
    const result = await triggerScraper()
    setRunning(false)
    if (result.success) {
      toast.success(`Scraper complete — ${result.message}`)
    } else {
      toast.error(`Scraper failed: ${result.message}`)
    }
    await load()
  }

  function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  const StatusIcon = run?.status === 'success'
    ? CheckCircle2
    : run?.status === 'failed'
    ? XCircle
    : run?.status === 'running'
    ? Loader2
    : Clock

  const statusColor = run?.status === 'success'
    ? 'text-brand-teal'
    : run?.status === 'failed'
    ? 'text-red-400'
    : 'text-muted-foreground'

  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between gap-4">
        {/* Left: label + last run */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
            <Rss className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">BEOE Scraper</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded tabular-nums">
                {count} jobs
              </span>
            </div>
            {loading ? (
              <span className="text-[11px] text-muted-foreground">Loading…</span>
            ) : run ? (
              <div className={`flex items-center gap-1 text-[11px] ${statusColor}`}>
                <StatusIcon className={`w-3 h-3 ${run.status === 'running' ? 'animate-spin' : ''}`} />
                <span className="capitalize">{run.status}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{formatDate(run.completed_at ?? run.started_at)}</span>
                {run.status === 'success' && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="tabular-nums">+{run.jobs_inserted} new</span>
                  </>
                )}
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground">Never run</span>
            )}
          </div>
        </div>

        {/* Right: trigger button */}
        <button
          onClick={handleRun}
          disabled={running || run?.status === 'running'}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/10 text-brand-teal text-[12px] font-medium hover:bg-brand-teal/20 transition-colors disabled:opacity-50"
        >
          {running ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          {running ? 'Running…' : 'Run Now'}
        </button>
      </div>

      {run?.status === 'failed' && run.error_message && (
        <p className="mt-3 text-[11px] text-red-400 bg-red-500/10 rounded-lg px-3 py-2 leading-relaxed">
          {run.error_message}
        </p>
      )}
    </div>
  )
}
