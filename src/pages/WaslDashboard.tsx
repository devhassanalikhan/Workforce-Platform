import { useCallback, useEffect, useState } from 'react'
import {
  Plane,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Shield,
  DollarSign,
  Activity,
  Globe,
  ChevronDown,
  User,
  Building2,
  TrendingUp,
} from 'lucide-react'
import { getDeployedWorkers } from '@/lib/data/deployments'
import type { DeployedWorker, WorkerStatus, GrievanceSeverity } from '@/types/domain'
import { LogCheckInModal, ReleaseEscrowModal, FileGrievanceModal } from '@/components/wasl/ActionModals'

// ── Config ─────────────────────────────────────────────────────────────────────

const statusConfig: Record<WorkerStatus, { label: string; classes: string; dot: string }> = {
  'active':             { label: 'Active',           classes: 'text-brand-teal bg-brand-teal/10 border-brand-teal/25', dot: 'bg-brand-teal' },
  'check-in-overdue':   { label: 'Check-in Overdue', classes: 'text-brand-gold bg-brand-gold/10 border-brand-gold/25', dot: 'bg-brand-gold' },
  'grievance-open':     { label: 'Grievance Open',   classes: 'text-red-400 bg-red-500/10 border-red-500/25',          dot: 'bg-red-400'   },
}

const severityConfig: Record<GrievanceSeverity, { classes: string; label: string }> = {
  low:    { classes: 'text-brand-teal bg-brand-teal/10 border-brand-teal/20', label: 'Low'    },
  medium: { classes: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20', label: 'Medium' },
  high:   { classes: 'text-red-400 bg-red-500/10 border-red-500/20',          label: 'High'   },
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function WaslDashboard() {
  const [workers, setWorkers]         = useState<DeployedWorker[]>([])
  const [filter, setFilter]           = useState<'all' | WorkerStatus>('all')
  const [expanded, setExpanded]       = useState<string | null>(null)

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [activeWorker, setActiveWorker]     = useState<DeployedWorker | null>(null)
  const [checkInOpen, setCheckInOpen]       = useState(false)
  const [escrowOpen, setEscrowOpen]         = useState(false)
  const [grievanceOpen, setGrievanceOpen]   = useState(false)

  const refresh = useCallback(() => { getDeployedWorkers().then(setWorkers) }, [])

  useEffect(() => { getDeployedWorkers().then(setWorkers) }, [])

  function openCheckIn(worker: DeployedWorker) { setActiveWorker(worker); setCheckInOpen(true) }
  function openEscrow(worker: DeployedWorker)  { setActiveWorker(worker); setEscrowOpen(true) }
  function openGrievance(worker: DeployedWorker) { setActiveWorker(worker); setGrievanceOpen(true) }

  const filtered = filter === 'all' ? workers : workers.filter(w => w.status === filter)

  const totalActive    = workers.filter(w => w.status === 'active').length
  const totalOverdue   = workers.filter(w => w.status === 'check-in-overdue').length
  const totalGrievance = workers.filter(w => w.status === 'grievance-open').length
  const totalEscrow    = 284000

  return (
    <div className="pt-[96px] min-h-screen bg-background">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <section className="py-10 border-b border-border bg-card/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-3">
                <Plane className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-[0.12em]">
                  Stage 6 · Wasl Platform
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Deployment & Support Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1.5 max-w-xl">
                Live monitoring of deployed workers — check-in status, escrow balances, and grievance resolution across all active placements.
              </p>
            </div>
            {/* KPI strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="text-xl font-bold text-violet-400">847</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Workers</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
                <div className="text-xl font-bold text-brand-gold">{totalOverdue}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Overdue Check-in</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="text-xl font-bold text-red-400">3</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Open Grievances</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl bg-brand-teal/10 border border-brand-teal/20">
                <div className="text-xl font-bold text-brand-teal">${(totalEscrow / 1000).toFixed(0)}k</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Escrow Protected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Tabs ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all',               label: `All Workers (${workers.length})`,  classes: 'text-foreground border-border hover:border-violet-500/40' },
            { key: 'active',            label: `Active (${totalActive})`,          classes: 'text-brand-teal border-brand-teal/30 hover:bg-brand-teal/10' },
            { key: 'check-in-overdue',  label: `Overdue (${totalOverdue})`,        classes: 'text-brand-gold border-brand-gold/30 hover:bg-brand-gold/10' },
            { key: 'grievance-open',    label: `Grievances (${totalGrievance})`,   classes: 'text-red-400 border-red-500/30 hover:bg-red-500/10' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all duration-150 ${tab.classes} ${
                filter === tab.key ? 'bg-muted/60' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Worker Cards Grid ────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(worker => {
            const sc        = statusConfig[worker.status]
            const isExpanded = expanded === worker.id
            return (
              <div
                key={worker.id}
                className={`rounded-2xl border bg-card transition-all duration-200 overflow-hidden ${
                  worker.status === 'grievance-open'    ? 'border-red-500/30' :
                  worker.status === 'check-in-overdue'  ? 'border-brand-gold/30' :
                  'border-border hover:border-violet-500/20'
                }`}
              >
                {/* Card header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {worker.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{worker.name}</div>
                        <div className="text-[11px] text-muted-foreground">{worker.role}</div>
                      </div>
                    </div>
                    {/* Status pill */}
                    <span className={`flex-shrink-0 flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${sc.classes}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3" />{worker.city}, {worker.country}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Building2 className="w-3 h-3" />{worker.employer}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-brand-gold font-medium">
                      <Globe className="w-3 h-3" />{worker.jobOrderId}
                    </span>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 divide-x divide-border/50">
                  <div className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Last Check-in</div>
                    <div className="text-[11px] font-semibold text-foreground">{worker.lastCheckIn}</div>
                  </div>
                  <div className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3 text-brand-teal" />
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Escrow</div>
                    <div className="text-[11px] font-semibold text-brand-teal">
                      {worker.escrowBalance.toLocaleString()} {worker.escrowCurrency}
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Wellbeing</div>
                    <div className={`text-[11px] font-semibold ${
                      worker.wellbeingScore >= 80 ? 'text-brand-teal' :
                      worker.wellbeingScore >= 60 ? 'text-brand-gold' :
                      'text-red-400'
                    }`}>{worker.wellbeingScore}/100</div>
                  </div>
                </div>

                {/* Wellbeing bar */}
                <div className="px-4 pb-3">
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        worker.wellbeingScore >= 80 ? 'bg-brand-teal' :
                        worker.wellbeingScore >= 60 ? 'bg-brand-gold' :
                        'bg-red-400'
                      }`}
                      style={{ width: `${worker.wellbeingScore}%` }}
                    />
                  </div>
                </div>

                {/* Grievance alert */}
                {worker.grievance && (
                  <div className="mx-4 mb-3 p-3 rounded-lg bg-red-500/8 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityConfig[worker.grievance.severity].classes}`}>
                        {severityConfig[worker.grievance.severity].label} Severity
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-auto">Opened {worker.grievance.opened}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{worker.grievance.summary}</p>
                  </div>
                )}

                {/* Action bar */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : worker.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-all text-[11px] font-medium text-muted-foreground mb-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      Worker Actions
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        id={`checkin-btn-${worker.id}`}
                        onClick={() => openCheckIn(worker)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-brand-teal/10 border border-brand-teal/20 hover:bg-brand-teal/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                        <span className="text-[10px] text-brand-teal font-semibold leading-tight text-center">Log Check-in</span>
                      </button>
                      <button
                        id={`escrow-btn-${worker.id}`}
                        onClick={() => openEscrow(worker)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all"
                      >
                        <DollarSign className="w-4 h-4 text-violet-400" />
                        <span className="text-[10px] text-violet-400 font-semibold leading-tight text-center">Release Escrow</span>
                      </button>
                      <button
                        id={`grievance-btn-${worker.id}`}
                        onClick={() => openGrievance(worker)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-brand-gold/10 border border-brand-gold/20 hover:bg-brand-gold/20 transition-all"
                      >
                        <MessageSquare className="w-4 h-4 text-brand-gold" />
                        <span className="text-[10px] text-brand-gold font-semibold leading-tight text-center">File Grievance</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Platform footer note ─────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15 flex items-start gap-3">
          <Shield className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-violet-400 mb-0.5">Wasl Protection Guarantee</div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              All escrow funds are held in a regulated third-party account. Funds are released only upon confirmed worker check-in and satisfaction of contractual milestones. Grievance cases are escalated to a licensed mediator within 48 hours.
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-brand-teal" />
            <span className="text-[11px] font-semibold text-brand-teal">98.4% resolution rate</span>
          </div>
        </div>
      </div>

      {/* ── Action Modals ─────────────────────────────────────────────────── */}
      {activeWorker && (
        <>
          <LogCheckInModal
            open={checkInOpen}
            onOpenChange={setCheckInOpen}
            deploymentId={activeWorker.id}
            workerName={activeWorker.name}
            onSuccess={refresh}
          />
          <ReleaseEscrowModal
            open={escrowOpen}
            onOpenChange={setEscrowOpen}
            deploymentId={activeWorker.id}
            workerName={activeWorker.name}
            currentBalance={activeWorker.escrowBalance}
            currency={activeWorker.escrowCurrency}
            onSuccess={refresh}
          />
          <FileGrievanceModal
            open={grievanceOpen}
            onOpenChange={setGrievanceOpen}
            deploymentId={activeWorker.id}
            workerName={activeWorker.name}
            onSuccess={refresh}
          />
        </>
      )}
    </div>
  )
}
