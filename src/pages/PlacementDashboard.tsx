import { useEffect, useState } from 'react'
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  ChevronDown,
  Briefcase,
  MapPin,
  Globe,
  ShieldCheck,
  FileText,
  CreditCard,
  Stethoscope,
  Languages,
  Plane,
  Building2,
  Stamp,
  ShieldAlert,
  HeartHandshake,
} from 'lucide-react'
import { getPlacementCandidates } from '@/lib/data/placementCandidates'
import type { PlacementCandidate, PlacementChecklistItem, ChecklistStatus } from '@/types/domain'

// ── Helpers ────────────────────────────────────────────────────────────────────

// Checklist item icons are keyed by `item_key` (see compliance_checklist_items
// schema) since icon components can't come from the database.
const CHECKLIST_ICONS: Record<string, React.ElementType> = {
  docs: FileText,
  contract: FileCheck,
  medical: Stethoscope,
  visa: Globe,
  language: Languages,
  fee: CreditCard,
  flight: Plane,
  employer: Building2,
  // Pakistani overseas employment (BEOE / emigration clearance process)
  emigration_clearance: Stamp,
  police_clearance:     ShieldAlert,
  welfare_fund:         HeartHandshake,
}

const statusConfig: Record<ChecklistStatus, { icon: React.ElementType; classes: string; label: string }> = {
  complete: { icon: CheckCircle2, classes: 'text-brand-teal bg-brand-teal/10 border-brand-teal/25',   label: 'Complete' },
  pending:  { icon: Clock,        classes: 'text-brand-gold bg-brand-gold/10 border-brand-gold/25',    label: 'Pending'  },
  flagged:  { icon: AlertCircle,  classes: 'text-red-400 bg-red-500/10 border-red-500/25',             label: 'Flagged'  },
}

function completionStats(items: PlacementChecklistItem[]) {
  const total    = items.length
  const complete = items.filter(i => i.status === 'complete').length
  const flagged  = items.filter(i => i.status === 'flagged').length
  return { total, complete, flagged, pct: total === 0 ? 0 : Math.round((complete / total) * 100) }
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function PlacementDashboard() {
  const [candidates, setCandidates] = useState<PlacementCandidate[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expanded, setExpanded]     = useState<string | null>(null)

  useEffect(() => {
    getPlacementCandidates().then(data => {
      setCandidates(data)
      setSelectedId(data[0]?.id ?? null)
    })
  }, [])

  const candidate = candidates.find(c => c.id === selectedId)
  const stats     = candidate ? completionStats(candidate.checklist) : { total: 0, complete: 0, flagged: 0, pct: 0 }

  return (
    <div className="pt-[96px] min-h-screen bg-background">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <section className="py-10 border-b border-border bg-card/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-3">
                <FileCheck className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[11px] font-semibold text-brand-gold uppercase tracking-[0.12em]">
                  Stage 5 · FF OES Agency
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ethical Placement Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1.5 max-w-xl">
                Compliance checklist and handover status for each candidate transitioning from Workfly training to licensed deployment.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-3 rounded-xl bg-brand-teal/10 border border-brand-teal/20">
                <div className="text-xl font-bold text-brand-teal">47</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">In Pipeline</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
                <div className="text-xl font-bold text-brand-gold">12</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending Action</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="text-xl font-bold text-green-400">284</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Deployed YTD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Candidate Selector ── */}
          <aside className="lg:w-72 flex-shrink-0 space-y-2.5">
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3">
              Candidates in Stage 5
            </h2>
            {candidates.map(c => {
              const s = completionStats(c.checklist)
              const isSelected = c.id === selectedId
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-gold/10 border-brand-gold/30 shadow-sm'
                      : 'bg-card border-border hover:border-border/80 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isSelected ? 'bg-brand-gold text-navy-950' : 'bg-muted text-muted-foreground'
                    }`}>
                      {c.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{c.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-[11px] text-muted-foreground">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Briefcase className="w-3 h-3 text-brand-gold flex-shrink-0" />
                    <span className="text-[11px] text-brand-gold font-semibold">{c.jobOrderId}</span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="flex gap-0.5">
                    {c.checklist.map(item => (
                      <div
                        key={item.key}
                        className={`flex-1 h-1 rounded-full ${
                          item.status === 'complete' ? 'bg-brand-teal' :
                          item.status === 'pending'  ? 'bg-brand-gold/60' :
                          'bg-red-400'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1.5">{s.complete}/{s.total} complete</div>
                </button>
              )
            })}
          </aside>

          {/* ── Checklist Panel ── */}
          {candidate && (
          <main className="flex-1 min-w-0">

            {/* Candidate header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-card border border-border mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold text-navy-950 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {candidate.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-foreground">{candidate.name}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-semibold">
                      {candidate.jobOrderId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <User className="w-3 h-3" />{candidate.role}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />{candidate.country}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <Building2 className="w-3 h-3" />{candidate.employer}
                    </span>
                  </div>
                </div>
              </div>
              {/* Completion donut-like stat */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${stats.pct === 100 ? 'text-brand-teal' : stats.flagged > 0 ? 'text-red-400' : 'text-brand-gold'}`}>
                    {stats.pct}%
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Complete</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-teal">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {stats.complete} complete
                  </div>
                  {stats.flagged > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-red-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {stats.flagged} flagged
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="mb-6">
              <div className="flex gap-1">
                {candidate.checklist.map(item => (
                  <div
                    key={item.key}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      item.status === 'complete' ? 'bg-brand-teal' :
                      item.status === 'pending'  ? 'bg-brand-gold/50' :
                      'bg-red-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
                {candidate.checklist.length}-Point Compliance Checklist · FF OES Protocol
              </h3>
              {candidate.checklist.map((item) => {
                const cfg         = statusConfig[item.status]
                const isExpanded  = expanded === item.key
                const StatusIcon  = cfg.icon
                const ItemIcon    = CHECKLIST_ICONS[item.key] ?? FileText
                return (
                  <div
                    key={item.key}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      item.status === 'flagged' ? 'border-red-500/30 bg-red-500/5' :
                      item.status === 'pending' ? 'border-brand-gold/20 bg-card' :
                      'border-border bg-card'
                    }`}
                  >
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      onClick={() => setExpanded(isExpanded ? null : item.key)}
                    >
                      {/* Status icon */}
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 ${cfg.classes}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                      </div>
                      {/* Category icon */}
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <ItemIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      {/* Labels */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">
                          {item.label}
                          {item.key === 'medical' && item.gamcaApproved && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-teal/10 border border-brand-teal/25 px-2 py-0.5 text-[10px] font-semibold text-brand-teal uppercase tracking-wider">GAMCA ✓</span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{item.sublabel}</div>
                      </div>
                      {/* Status badge + chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.classes}`}>
                          {cfg.label}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {/* Detail expand */}
                    {isExpanded && item.detail && (
                      <div className="px-4 pb-3.5 pt-0 border-t border-border/50">
                        <div className="flex items-start gap-2 mt-3">
                          <ShieldCheck className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                          <p className="text-[12px] text-muted-foreground leading-relaxed">{item.detail}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action footer */}
            {stats.pct === 100 && (
              <div className="mt-6 p-4 rounded-xl bg-brand-teal/10 border border-brand-teal/25 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-teal flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-brand-teal">Ready for Wasl Handover</div>
                  <div className="text-[11px] text-muted-foreground">All compliance items cleared. Candidate can be promoted to Stage 6 deployment tracking.</div>
                </div>
                <button className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-brand-teal text-white rounded-lg text-xs font-semibold hover:bg-brand-teal/90 transition-all">
                  <Plane className="w-3.5 h-3.5" />
                  Hand Over to Wasl
                </button>
              </div>
            )}

          </main>
          )}
        </div>
      </div>
    </div>
  )
}
