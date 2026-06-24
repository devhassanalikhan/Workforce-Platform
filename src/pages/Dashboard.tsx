import { type ElementType } from 'react'
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plane,
  FileText,
  Globe,
  CreditCard,
  Stethoscope,
  Languages,
  Building2,
  Activity,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// ── Static profile data for Ali Khan (c1 / JO-2841) ──────────────────────────

const PIPELINE_STAGES = [
  { step: 1, label: 'Job Order Matched',  color: 'bg-brand-teal'  },
  { step: 2, label: 'Profile Screened',   color: 'bg-brand-teal'  },
  { step: 3, label: 'Training Enrolled',  color: 'bg-brand-teal'  },
  { step: 4, label: 'Readiness Cleared',  color: 'bg-brand-teal'  },
  { step: 5, label: 'Ethical Placement',  color: 'bg-brand-gold'  },
  { step: 6, label: 'Deployed',           color: 'bg-violet-500'  },
]

const CURRENT_STAGE = 5

const CHECKLIST = [
  {
    id: 'docs',
    label: 'Identity Documents',
    sublabel: 'Passport · NID · Birth Certificate',
    status: 'complete' as const,
    icon: FileText,
    detail: 'Verified by FF OES compliance team · 12 Jun 2026',
  },
  {
    id: 'contract',
    label: 'Employment Contract',
    sublabel: 'Bilingual EN/AR — MOHRE compliant',
    status: 'complete' as const,
    icon: ShieldCheck,
    detail: 'Countersigned by Al-Rashid HR · 10 Jun 2026',
  },
  {
    id: 'medical',
    label: 'Medical Fitness Clearance',
    sublabel: 'GCC approved clinic — Rawalpindi',
    status: 'complete' as const,
    icon: Stethoscope,
    detail: 'Certificate valid through Dec 2026',
  },
  {
    id: 'visa',
    label: 'UAE Work Visa',
    sublabel: 'Residence visa + work permit',
    status: 'complete' as const,
    icon: Globe,
    detail: 'Visa stamped 15 Jun 2026 · Entry permit #UAE-88421',
  },
  {
    id: 'language',
    label: 'Language Proficiency',
    sublabel: 'CEFR B1 English · Basic Arabic',
    status: 'complete' as const,
    icon: Languages,
    detail: 'CEFR result logged on Workfly Skills record',
  },
  {
    id: 'fee',
    label: 'Zero Recruitment Fee',
    sublabel: 'Candidate fee debt: AED 0.00',
    status: 'complete' as const,
    icon: CreditCard,
    detail: 'Ethical compliance certificate issued',
  },
  {
    id: 'flight',
    label: 'Flight & Logistics',
    sublabel: 'ISB → DXB · 22 Jun 2026',
    status: 'pending' as const,
    icon: Plane,
    detail: 'Ticket confirmation awaited from employer',
  },
  {
    id: 'employer',
    label: 'Employer Onboarding Pack',
    sublabel: 'Accommodation details + site induction',
    status: 'pending' as const,
    icon: Building2,
    detail: 'Awaiting employer HR acknowledgment',
  },
]

type ChecklistStatus = 'complete' | 'pending' | 'flagged'

const statusConfig: Record<ChecklistStatus, { icon: ElementType; classes: string; label: string }> = {
  complete: { icon: CheckCircle2, classes: 'text-brand-teal',  label: 'Verified'     },
  pending:  { icon: Clock,        classes: 'text-brand-gold',  label: 'In Progress'  },
  flagged:  { icon: Activity,     classes: 'text-red-400',     label: 'Flagged'      },
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ApplicantDashboard() {
  const { user } = useAuth()
  const firstName = user?.fullName.split(' ')[0] ?? 'Candidate'

  const completedCount = CHECKLIST.filter(c => c.status === 'complete').length
  const totalCount     = CHECKLIST.length

  return (
    <div className="pt-[96px] min-h-screen bg-background">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <section className="py-10 border-b border-border bg-card/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-2 block">
                Applicant Status Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome back, <span className="text-brand-gold">{firstName}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                Track your personal placement journey and document compliance status in real time.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 self-start sm:self-auto">
              <Activity className="w-4 h-4 text-brand-gold" />
              <span className="text-[13px] font-semibold text-brand-gold tabular-nums">
                Stage {CURRENT_STAGE} of 6
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ── Top row: Profile card + Pipeline ───────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Your Profile
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/25">
                <ShieldCheck className="w-3 h-3 text-brand-teal" />
                <span className="text-[9px] font-semibold text-brand-teal">Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-lg font-bold text-brand-gold tabular-nums flex-shrink-0">
                {user?.avatarInitials ?? 'AK'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-card-foreground">{user?.fullName ?? 'Ali Khan'}</h2>
                <p className="text-sm text-muted-foreground">Construction Supervisor</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                <span>Rawalpindi, Punjab</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Globe className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                <span>Destination: Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Building2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                <span>Al-Rashid Construction LLC</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                <span className="tabular-nums">JO-2841</span>
              </div>
            </div>
          </div>

          {/* Journey Pipeline */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Your Journey
              </span>
              <span className="text-[11px] font-semibold text-brand-gold tabular-nums">
                {CURRENT_STAGE} / {PIPELINE_STAGES.length} Stages
              </span>
            </div>

            {/* 6-segment bar */}
            <div className="flex gap-1">
              {PIPELINE_STAGES.map(stage => (
                <div
                  key={stage.step}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    stage.step <= CURRENT_STAGE ? stage.color : 'bg-border'
                  }`}
                />
              ))}
            </div>

            {/* Stage list */}
            <div className="space-y-2">
              {PIPELINE_STAGES.map(stage => {
                const isDone    = stage.step < CURRENT_STAGE
                const isCurrent = stage.step === CURRENT_STAGE
                const isFuture  = stage.step > CURRENT_STAGE
                return (
                  <div key={stage.step} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 tabular-nums ${
                      isDone    ? 'bg-brand-teal/20'               :
                      isCurrent ? 'bg-brand-gold/20'               :
                                  'bg-border'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-3 h-3 text-brand-teal" />
                      ) : (
                        <span className={`text-[9px] font-bold ${isCurrent ? 'text-brand-gold' : 'text-muted-foreground/40'}`}>
                          {stage.step}
                        </span>
                      )}
                    </div>
                    <span className={`text-[12px] font-medium ${
                      isDone    ? 'text-muted-foreground line-through' :
                      isCurrent ? 'text-brand-gold'                   :
                                  'text-muted-foreground/50'
                    }`}>
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="ml-auto text-[9px] font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-1.5 py-0.5 rounded-full">
                        CURRENT
                      </span>
                    )}
                    {isFuture && (
                      <span className="ml-auto text-[9px] text-muted-foreground/40 tabular-nums">
                        Upcoming
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Compliance Checklist ────────────────────────────────────────── */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">Compliance Checklist</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                All documents required for ethical deployment to UAE
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-brand-teal tabular-nums">
                {completedCount}/{totalCount}
              </div>
              <div className="text-[10px] text-muted-foreground">Items Cleared</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-border">
            <div
              className="h-full bg-brand-teal rounded-r-full transition-all duration-700"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>

          <div className="divide-y divide-border">
            {CHECKLIST.map(item => {
              const cfg = statusConfig[item.status]
              const StatusIcon = cfg.icon
              const ItemIcon   = item.icon
              return (
                <div key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors">
                  {/* Item icon */}
                  <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ItemIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-medium text-card-foreground">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.sublabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5 tabular-nums">
                      {item.detail}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1 flex-shrink-0 ${cfg.classes}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">{cfg.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Support Banner ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-brand-teal/5 border border-brand-teal/15">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-teal flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Your rights are protected.</p>
              <p className="text-[11px] text-muted-foreground">
                WorkforceX guarantees zero recruitment fee and full ethical compliance under international labour standards.
              </p>
            </div>
          </div>
          <button className="text-[12px] font-semibold text-brand-teal border border-brand-teal/30 px-4 py-2 rounded-xl hover:bg-brand-teal/10 transition-all flex-shrink-0">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  )
}
