import { useState, useEffect, type ElementType } from 'react'
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
  Loader2,
  UserPlus,
  ClipboardList,
  Pencil,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { getDashboardData, type DashboardData } from '@/lib/data/dashboard'
import { initialsOf } from '@/lib/initials'
import TalentProfileForm from '@/components/profile/TalentProfileForm'
import DocumentUpload from '@/components/profile/DocumentUpload'
import type { TalentProfilePayload } from '@/lib/data/mutations'
import type { ChecklistStatus } from '@/types/domain'

const PIPELINE_STAGES = [
  { step: 1, label: 'Job Order Matched', color: 'bg-brand-teal' },
  { step: 2, label: 'Profile Screened',  color: 'bg-brand-teal' },
  { step: 3, label: 'Training Enrolled', color: 'bg-brand-teal' },
  { step: 4, label: 'Readiness Cleared', color: 'bg-brand-teal' },
  { step: 5, label: 'Ethical Placement', color: 'bg-brand-gold' },
  { step: 6, label: 'Deployed',          color: 'bg-violet-500' },
]

const ITEM_ICON_MAP: Record<string, ElementType> = {
  docs:     FileText,
  contract: ShieldCheck,
  medical:  Stethoscope,
  visa:     Globe,
  language: Languages,
  fee:      CreditCard,
  flight:   Plane,
  employer: Building2,
}

const STATUS_CONFIG: Record<ChecklistStatus, { icon: ElementType; classes: string; label: string }> = {
  complete: { icon: CheckCircle2, classes: 'text-brand-teal', label: 'Verified'    },
  pending:  { icon: Clock,        classes: 'text-brand-gold', label: 'In Progress' },
  flagged:  { icon: Activity,     classes: 'text-red-400',    label: 'Flagged'     },
}

export default function ApplicantDashboard() {
  const { user } = useAuth()
  const [data, setData]                       = useState<DashboardData | null>(null)
  const [loading, setLoading]                 = useState(true)
  const [profileFormOpen, setProfileFormOpen] = useState(false)
  const [existingProfile, setExistingProfile] = useState<Partial<TalentProfilePayload> | undefined>(undefined)

  useEffect(() => {
    if (!user) return
    getDashboardData(user.id).then(result => {
      setData(result)
      if (result.profile) {
        setExistingProfile({
          id:         user.id,
          name:       result.profile.name,
          role_title: result.profile.roleTitle,
          location:   result.profile.location,
        })
      }
      setLoading(false)
    })
  }, [user])

  const firstName =
    data?.profile?.name.split(' ')[0] ??
    user?.fullName.split(' ')[0] ??
    'Candidate'

  if (loading) {
    return (
      <div className="pt-[96px] min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading your dashboard…</span>
        </div>
      </div>
    )
  }

  if (!data?.profile) {
    return (
      <div className="pt-[96px] min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm px-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto">
            <UserPlus className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Complete your profile</h2>
            <p className="text-sm text-muted-foreground">
              Your talent profile hasn't been set up yet. Create your profile now to unlock placements and compliant document uploads.
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setProfileFormOpen(true)}
              className="px-6 py-3 rounded-2xl bg-brand-gold text-black font-semibold transition hover:bg-brand-gold/90"
            >
              Create Profile
            </button>
          </div>
        </div>

        {user && (
          <Dialog.Root open={profileFormOpen} onOpenChange={setProfileFormOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-base font-semibold text-foreground">Create Your Profile</Dialog.Title>
                  <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors text-lg leading-none">&times;</Dialog.Close>
                </div>
                <TalentProfileForm
                  userId={user.id}
                  existingProfile={existingProfile}
                  onSuccess={handleProfileSaved}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>
    )
  }

  if (!data.placement) {
    return (
      <div className="pt-[96px] min-h-screen bg-background">
        <section className="py-10 border-b border-border bg-card/30">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-2 block">
              Applicant Status Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome, <span className="text-brand-gold">{firstName}</span>
            </h1>
          </div>
        </section>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto">
              <ClipboardList className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold text-foreground">No active placement</h2>
            <p className="text-sm text-muted-foreground">
              You haven't been matched to a job order yet. Our team will notify you when a placement is assigned.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { profile, placement, checklist } = data
  const currentStage   = placement.stage
  const completedCount = checklist.filter(c => c.status === 'complete').length
  const totalCount     = checklist.length
  const avatarInitials = initialsOf(profile.name)

  function handleProfileSaved() {
    setProfileFormOpen(false)
    if (user) {
      getDashboardData(user.id).then(result => {
        setData(result)
        if (result.profile) {
          setExistingProfile({
            id:         user.id,
            name:       result.profile.name,
            role_title: result.profile.roleTitle,
            location:   result.profile.location,
          })
        }
      })
    }
  }

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
                Stage {currentStage} of 6
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/25">
                  <ShieldCheck className="w-3 h-3 text-brand-teal" />
                  <span className="text-[9px] font-semibold text-brand-teal">Verified</span>
                </div>
                <button
                  id="edit-profile-btn"
                  onClick={() => setProfileFormOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                  title="Edit your profile"
                >
                  <Pencil className="w-3 h-3" />
                  <span className="text-[10px] font-medium">Edit</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-lg font-bold text-brand-gold flex-shrink-0">
                {avatarInitials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-card-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.roleTitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>
              {placement.destination && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                  <span className="truncate">Destination: {placement.destination}</span>
                </div>
              )}
              {placement.employer && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                  <span className="truncate">{placement.employer}</span>
                </div>
              )}
              {placement.jobOrderCode && (
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                  <span className="tabular-nums">{placement.jobOrderCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Journey Pipeline */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Your Journey
              </span>
              <span className="text-[11px] font-semibold text-brand-gold tabular-nums">
                {currentStage} / {PIPELINE_STAGES.length} Stages
              </span>
            </div>

            <div className="flex gap-1">
              {PIPELINE_STAGES.map(stage => (
                <div
                  key={stage.step}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    stage.step <= currentStage ? stage.color : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-2">
              {PIPELINE_STAGES.map(stage => {
                const isDone    = stage.step < currentStage
                const isCurrent = stage.step === currentStage
                const isFuture  = stage.step > currentStage
                return (
                  <div key={stage.step} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDone    ? 'bg-brand-teal/20' :
                      isCurrent ? 'bg-brand-gold/20' :
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
                      <span className="ml-auto text-[9px] text-muted-foreground/40">
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
        {checklist.length > 0 && (
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">Compliance Checklist</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  All documents required for ethical deployment
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-brand-teal tabular-nums">
                  {completedCount}/{totalCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Items Cleared</div>
              </div>
            </div>

            <div className="h-1 bg-border">
              <div
                className="h-full bg-brand-teal rounded-r-full transition-all duration-700"
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
              />
            </div>

            <div className="divide-y divide-border">
              {checklist.map(item => {
                const cfg        = STATUS_CONFIG[item.status]
                const StatusIcon = cfg.icon
                const ItemIcon   = ITEM_ICON_MAP[item.itemKey] ?? FileText
                return (
                  <div key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ItemIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-medium text-card-foreground">
                          {item.label}
                        </span>
                        {item.sublabel && (
                          <span className="text-[10px] text-muted-foreground">
                            {item.sublabel}
                          </span>
                        )}
                      </div>
                      {item.detail && (
                        <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                          {item.detail}
                        </p>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 flex-shrink-0 ${cfg.classes}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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

      {/* ── Profile Edit Dialog ────────────────────────────────────────────── */}
      {user && (
        <Dialog.Root open={profileFormOpen} onOpenChange={setProfileFormOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-base font-semibold text-foreground">Edit Your Profile</Dialog.Title>
                <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors text-lg leading-none">&times;</Dialog.Close>
              </div>
              <TalentProfileForm
                userId={user.id}
                existingProfile={existingProfile}
                onSuccess={handleProfileSaved}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  )
}
