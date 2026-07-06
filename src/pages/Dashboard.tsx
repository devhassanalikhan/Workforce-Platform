import { useState, useEffect, type ElementType } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router'
import {
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
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useAuth } from '@/contexts/AuthContext'
import { getDashboardData, type DashboardData, type DashboardProfile, type DashboardPlacement, type DashboardChecklistItem } from '@/lib/data/dashboard'
import TalentProfileForm from '@/components/profile/TalentProfileForm'
import DocumentUpload from '@/components/profile/DocumentUpload'
import type { TalentProfilePayload } from '@/lib/data/mutations'
import type { ChecklistStatus } from '@/types/domain'

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

const DASHBOARD_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'applications', label: 'Applications' },
  { id: 'skills', label: 'Skills' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'relocation', label: 'Visa & Relocation' },
] as const

function DashboardSubNavbar() {
  return (
    <div className="sticky top-[60px] z-40 border-b border-border bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 py-3">
          {DASHBOARD_TABS.map(tab => (
            <NavLink
              key={tab.id}
              to={`/dashboard/${tab.id}`}
              end
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-gold text-black'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ profile, placement, onEditProfile }: {
  profile: DashboardProfile
  placement: DashboardPlacement | null
  onEditProfile: () => void
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
      <div className="rounded-2xl bg-card border border-border p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Profile Overview</h2>
            <p className="text-sm text-muted-foreground">Your applicant details and career readiness summary.</p>
          </div>
          <button
            onClick={onEditProfile}
            className="px-3 py-2 rounded-xl bg-muted/70 text-muted-foreground hover:bg-muted transition"
          >
            Edit profile
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-brand-gold/10 border border-brand-gold/20 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Name</p>
            <p className="font-semibold text-card-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{profile.roleTitle}</p>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Location</p>
            <p className="font-semibold text-card-foreground">{profile.location}</p>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Experience</p>
            <p className="font-semibold text-card-foreground">{profile.experienceYears} years</p>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Availability</p>
            <p className="font-semibold text-card-foreground">{profile.available ? 'Ready for deployment' : 'Not available'}</p>
          </div>
        </div>

        <div className="space-y-4">
          {profile.skills.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-muted border border-border text-[11px] text-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.languages.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map(lang => (
                  <span key={lang} className="px-3 py-1 rounded-full bg-muted border border-border text-[11px] text-foreground">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.certifications.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map(cert => (
                  <span key={cert} className="px-3 py-1 rounded-full bg-muted border border-border text-[11px] text-foreground">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Match Snapshot</h3>
        {placement ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-muted/40 border border-border p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Current position</p>
              <p className="font-semibold text-card-foreground">{placement.jobTitle}</p>
              <p className="text-sm text-muted-foreground mt-1">Order {placement.jobOrderCode}</p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl bg-muted/40 border border-border p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Employer</p>
                <p className="font-semibold text-card-foreground">{placement.employer}</p>
              </div>
              <div className="rounded-2xl bg-muted/40 border border-border p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Destination</p>
                <p className="font-semibold text-card-foreground">{placement.destination}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-muted/40 border border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">No active placement yet. We are matching you to ethical opportunities.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationsTab({ placement }: { placement: DashboardPlacement | null }) {
  if (!placement) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Applications Tracker</h2>
        <p className="mt-3 text-sm text-muted-foreground">You have not been assigned to a placement yet. Your applications are still under review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Current application</p>
            <h2 className="text-xl font-semibold text-foreground">{placement.jobTitle}</h2>
            <p className="text-sm text-muted-foreground mt-1">Job Order {placement.jobOrderCode}</p>
          </div>
          <div className="rounded-full bg-brand-gold/10 px-3 py-1 text-[11px] font-semibold text-brand-gold">Stage {placement.stage}</div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Employer</p>
            <p className="font-semibold text-card-foreground">{placement.employer}</p>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Destination</p>
            <p className="font-semibold text-card-foreground">{placement.destination}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Application milestones</h3>
        <div className="grid gap-3">
          {DASHBOARD_TABS.slice(0, 4).map(tab => (
            <div key={tab.id} className="rounded-2xl bg-muted/40 border border-border p-4">
              <p className="text-sm font-medium text-card-foreground">{tab.label}</p>
              <p className="text-sm text-muted-foreground mt-1">Reviewing your {tab.label.toLowerCase()} details for compliance and fit.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillsTab({ profile }: { profile: DashboardProfile }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_0.9fr]">
      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Key skills and certifications</h2>
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-full bg-muted border border-border text-[11px] text-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map(lang => (
                <span key={lang} className="px-3 py-1 rounded-full bg-muted border border-border text-[11px] text-foreground">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map(cert => (
                <span key={cert} className="px-3 py-1 rounded-full bg-muted border border-border text-[11px] text-foreground">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Skills progress</h2>
        <p className="text-sm text-muted-foreground">Continue building your profile value with targeted training and certifications aligned to placement demand.</p>
        <div className="mt-6 rounded-2xl bg-muted/40 border border-border p-4">
          <p className="text-sm font-semibold text-foreground">Tip</p>
          <p className="text-sm text-muted-foreground mt-2">Update this tab as you complete new training so the matching engine can surface the best opportunities.</p>
        </div>
      </div>
    </div>
  )
}

function ComplianceTab({ checklist, userId }: { checklist: DashboardChecklistItem[]; userId: string }) {
  if (checklist.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Compliance Vault</h2>
        <p className="mt-3 text-sm text-muted-foreground">No compliance items are available yet. This section will show required documents and upload actions once you have an active placement.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Compliance Vault</h2>
          <p className="text-sm text-muted-foreground">Upload documents and track verification status.</p>
        </div>
        <div className="text-sm text-muted-foreground">{checklist.filter(item => item.status === 'complete').length}/{checklist.length} completed</div>
      </div>
      <div className="divide-y divide-border">
        {checklist.map(item => {
          const cfg = STATUS_CONFIG[item.status]
          const ItemIcon = ITEM_ICON_MAP[item.itemKey] ?? FileText
          return (
            <div key={item.id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
                  <ItemIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  {item.sublabel && <p className="text-sm text-muted-foreground mt-1">{item.sublabel}</p>}
                  {item.detail && <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div className={`flex items-center gap-1 text-[11px] font-semibold ${cfg.classes}`}>
                  <cfg.icon className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                </div>
                <DocumentUpload userId={userId} itemKey={item.itemKey} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RelocationTab({ placement, checklist }: { placement: DashboardPlacement | null; checklist: DashboardChecklistItem[] }) {
  if (!placement) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Visa & Relocation</h2>
        <p className="mt-3 text-sm text-muted-foreground">Relocation milestones will appear once you are matched to a placement.</p>
      </div>
    )
  }

  const relocationItems = checklist.filter(item => ['visa', 'flight', 'employer', 'medical'].includes(item.itemKey))

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_0.9fr]">
      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Relocation Overview</h2>
        <div className="grid gap-3">
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Destination</p>
            <p className="font-semibold text-card-foreground">{placement.destination}</p>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Current stage</p>
            <p className="font-semibold text-card-foreground">Stage {placement.stage} of 6</p>
          </div>
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Job order</p>
            <p className="font-semibold text-card-foreground">{placement.jobOrderCode}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Relocation checklist</h2>
        {relocationItems.length > 0 ? (
          <div className="space-y-3">
            {relocationItems.map(item => (
              <div key={item.id} className="rounded-2xl bg-muted/40 border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-card-foreground">{item.label}</p>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-[0.15em]">{item.status}</span>
                </div>
                {item.detail && <p className="text-sm text-muted-foreground mt-2">{item.detail}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">We're still collecting relocation milestones for your placement.</p>
        )}
      </div>
    </div>
  )
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

  const { profile, placement, checklist } = data
  const currentStage = placement?.stage ?? 0

  return (
    <div className="pt-[96px] min-h-screen bg-background">
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
                {placement
                  ? 'Track your personal placement journey and document compliance status in real time.'
                  : 'Your profile is ready. We are matching you to the best ethical placement.'}
              </p>
            </div>
            {placement ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 self-start sm:self-auto">
                <Activity className="w-4 h-4 text-brand-gold" />
                <span className="text-[13px] font-semibold text-brand-gold tabular-nums">
                  Stage {currentStage} of 6
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <DashboardSubNavbar />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Routes>
          <Route index element={<Navigate replace to="/dashboard/profile" />} />
          <Route
            path="profile"
            element={<ProfileTab profile={profile} placement={placement} onEditProfile={() => setProfileFormOpen(true)} />}
          />
          <Route path="applications" element={<ApplicationsTab placement={placement} />} />
          <Route path="skills" element={<SkillsTab profile={profile} />} />
          <Route path="compliance" element={<ComplianceTab checklist={checklist} userId={user?.id ?? ''} />} />
          <Route path="relocation" element={<RelocationTab placement={placement} checklist={checklist} />} />
          <Route path="*" element={<Navigate replace to="/dashboard/profile" />} />
        </Routes>
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
