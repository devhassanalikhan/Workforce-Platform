// src/pages/EmployerPortal.tsx

import { useCallback, useEffect, useState } from 'react'
import {
  Building2,
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Activity,
  MapPin,
  Globe,
  Zap,
  FileText,
  CheckCircle2,
  Clock,
  Settings,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { getActiveJobOrder, getCompanyJobs, type CompanyJob } from '@/lib/data/employer'
import { createCompany, joinCompany, deleteJob } from '@/lib/data/mutations'
import JobFormDialog from '@/components/jobs/JobFormDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import CompanySettingsDialog from '@/components/employers/CompanySettingsDialog'
import type { ActiveJobOrder } from '@/types/domain'
import { STAGE_LABELS, TOTAL_STAGES } from '@/lib/pipelineStages'

// Sourcing funnel — not yet modeled in the schema (placements.stage covers
// post-match journey only). Kept as illustrative mock until sourcing tracking
// is added to the DB.
const JO_PIPELINE = [
  { label: 'Sourced',   count: 12, color: 'bg-brand-gold'  },
  { label: 'Screened',  count: 8,  color: 'bg-brand-teal'  },
  { label: 'Shortlist', count: 3,  color: 'bg-blue-500'    },
  { label: 'Confirmed', count: 1,  color: 'bg-emerald-500' },
]

export default function EmployerPortal() {
  const { user } = useAuth()

  const [companyId,   setCompanyId]   = useState<string | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [settingUp,   setSettingUp]   = useState(false)
  const [company,     setCompany]     = useState<any | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [jobs,           setJobs]           = useState<CompanyJob[]>([])
  const [activeJobOrder, setActiveJobOrder] = useState<ActiveJobOrder | null>(null)
  const [loading,        setLoading]        = useState(true)

  const [jobFormOpen,  setJobFormOpen]  = useState(false)
  const [selectedJob,  setSelectedJob]  = useState<CompanyJob | null>(null)
  const [deleteOpen,   setDeleteOpen]   = useState(false)
  const [jobToDelete,  setJobToDelete]  = useState<CompanyJob | null>(null)
  const [deleting,     setDeleting]     = useState(false)

  useEffect(() => {
    if (!user) return
    loadPortal()
  }, [user])

  async function loadCompanyDetails(cId: string) {
    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('id', cId)
      .maybeSingle()
    if (data) {
      setCompany(data)
    }
  }

  async function loadPortal() {
    if (!user) return
    setLoading(true)

    const { data } = await supabase
      .from('company_members')
      .select('company_id')
      .eq('user_id', user.id)
      .maybeSingle()

    const cId = (data as { company_id: string } | null)?.company_id ?? null
    setCompanyId(cId)

    if (cId) {
      const [jobsData, jobOrder] = await Promise.all([
        getCompanyJobs(cId),
        getActiveJobOrder(),
        loadCompanyDetails(cId),
      ])
      setJobs(jobsData)
      setActiveJobOrder(jobOrder)
    }

    setLoading(false)
  }

  async function handleSetupCompany(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !companyName.trim()) return
    setSettingUp(true)

    const { data: company, error: ceErr } = await createCompany(companyName.trim())
    if (ceErr || !company) {
      toast.error(ceErr ?? 'Failed to create company.')
      setSettingUp(false)
      return
    }

    const { error: meErr } = await joinCompany(user.id, company.id)
    if (meErr) {
      toast.error(meErr)
      setSettingUp(false)
      return
    }

    setCompanyId(company.id)
    const [jobsData, jobOrder] = await Promise.all([
      getCompanyJobs(company.id),
      getActiveJobOrder(),
      loadCompanyDetails(company.id),
    ])
    setJobs(jobsData)
    setActiveJobOrder(jobOrder)
    setSettingUp(false)
    toast.success('Company profile created! You can now post jobs.')
  }

  const openNew = useCallback(() => {
    setSelectedJob(null)
    setJobFormOpen(true)
  }, [])

  const openEdit = useCallback((job: CompanyJob) => {
    setSelectedJob(job)
    setJobFormOpen(true)
  }, [])

  const openDelete = useCallback((job: CompanyJob) => {
    setJobToDelete(job)
    setDeleteOpen(true)
  }, [])

  const handleJobSuccess = useCallback(() => {
    if (!companyId) return
    getCompanyJobs(companyId).then(setJobs)
    getActiveJobOrder().then(setActiveJobOrder)
  }, [companyId])

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return
    setDeleting(true)
    const { error } = await deleteJob(jobToDelete.id)
    setDeleting(false)
    setDeleteOpen(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Job removed.')
      setJobs(prev => prev.filter(j => j.id !== jobToDelete.id))
      setJobToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="pt-[96px] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    )
  }

  return (
    <div className="pt-[96px] min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Company Logo */}
            {companyId && (
              <div className="w-14 h-14 rounded-2xl border border-border bg-card flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {company?.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name ?? 'Company logo'}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-7 h-7 text-muted-foreground/40" />
                )}
              </div>
            )}
            <div>
              <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] block mb-0.5">
                Employer Portal
              </span>
              <h1 className="text-2xl font-bold text-foreground">
                {company?.name ?? 'Job Management'}
              </h1>
              {company?.country && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {company.country}
                  {company?.business_type && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-muted border border-border text-[10px]">{company.business_type}</span>}
                </p>
              )}
            </div>
          </div>
          {companyId && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-muted/60 hover:bg-muted border border-border rounded-xl text-sm font-semibold text-foreground transition-all"
                title="Company Settings"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                Company Settings
              </button>
              <button
                onClick={openNew}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all shadow-glow"
              >
                <Plus className="w-4 h-4" />
                Post a Job
              </button>
            </div>
          )}
        </div>

        {/* Company Setup — shown when employer has no company_members row */}
        {!companyId && (
          <div className="max-w-md">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Set Up Your Company</h2>
                  <p className="text-xs text-muted-foreground">Required before posting jobs</p>
                </div>
              </div>
              <form onSubmit={handleSetupCompany} className="space-y-3">
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Al-Rashid Construction LLC"
                  required
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={settingUp || !companyName.trim()}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {settingUp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Get Started
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Job Listings */}
        {companyId && (
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-gold" />
              Your Job Listings ({jobs.length})
            </h2>

            {jobs.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-card border border-dashed border-border">
                <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No jobs posted yet.</p>
                <button
                  onClick={openNew}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border hover:border-brand-gold/20 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-foreground">{job.title}</span>
                        {job.is_hot && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-50 dark:bg-red-500/15 text-red-500 text-[10px] font-bold">
                            Hot
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span>{job.employment_type}</span>
                        <span>{job.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEdit(job)}
                        className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit job"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDelete(job)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Active Job Order */}
        {companyId && activeJobOrder && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-gold" />
                Active Job Order
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20">
                <Activity className="w-3 h-3 text-brand-gold" />
                <span className="text-[10px] font-semibold text-brand-gold tabular-nums">1 Active</span>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-card-foreground tabular-nums">
                        {activeJobOrder.jobOrderCode}
                      </span>
                      <span className="text-[9px] font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-1.5 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {activeJobOrder.jobTitle} · {activeJobOrder.destination}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeJobOrder.destination}</span>
                </div>
              </div>

              <div className="p-6 grid lg:grid-cols-3 gap-6">
                {/* Candidate snapshot */}
                <div className="space-y-4">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">
                    Confirmed Candidate
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-sm font-bold text-brand-gold flex-shrink-0">
                      {activeJobOrder.candidateInitials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-card-foreground">
                        {activeJobOrder.candidateName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{activeJobOrder.jobTitle}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-brand-teal flex-shrink-0" />
                      <span>{activeJobOrder.origin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-brand-gold flex-shrink-0" />
                      <span>Destination: {activeJobOrder.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-brand-teal flex-shrink-0" />
                      <span className="tabular-nums">AI Match: {activeJobOrder.aiScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline bar */}
                <div className="space-y-4">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">
                    Placement Journey
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: TOTAL_STAGES }, (_, i) => i + 1).map(step => (
                      <div
                        key={step}
                        className={`flex-1 h-2 rounded-full ${
                          step < activeJobOrder.stage  ? 'bg-brand-teal' :
                          step === activeJobOrder.stage ? 'bg-brand-gold' :
                                                          'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-brand-gold font-semibold tabular-nums">
                    Stage {activeJobOrder.stage} of {TOTAL_STAGES} — {STAGE_LABELS[activeJobOrder.stage]}
                  </div>
                  <div className="space-y-1.5">
                    {JO_PIPELINE.map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16">{item.label}</span>
                        <div className="flex-1 h-1 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${(item.count / 12) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance checklist */}
                <div className="space-y-4">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">
                    Document Status
                  </span>
                  <div className="space-y-2">
                    {activeJobOrder.complianceItems.map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[12px] text-muted-foreground">{item.label}</span>
                        </div>
                        {item.status === 'complete' ? (
                          <div className="flex items-center gap-1 text-brand-teal">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-semibold">Verified</span>
                          </div>
                        ) : item.status === 'flagged' ? (
                          <div className="flex items-center gap-1 text-red-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-semibold">Flagged</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-brand-gold">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-semibold">Pending</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Dialogs */}
      {companyId && (
        <JobFormDialog
          open={jobFormOpen}
          onOpenChange={setJobFormOpen}
          companyId={companyId}
          job={selectedJob ?? undefined}
          onSuccess={handleJobSuccess}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Job Listing"
        description={`Remove "${jobToDelete?.title}" from the marketplace? This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
      />

      {/* Company Settings Dialog */}
      <CompanySettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        company={company}
        onSuccess={() => {
          if (companyId) loadCompanyDetails(companyId)
        }}
      />
    </div>
  )
}
