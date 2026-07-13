// src/components/jobs/JobDetailModal.tsx

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  X,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  LogIn,
  Briefcase,
} from 'lucide-react'
import { Link } from 'react-router'
import JobApplicationForm from './JobApplicationForm'
import type { Job } from '@/types/domain'

interface Props {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  isApplicant: boolean
  alreadyApplied: boolean
  onApplySuccess: (jobId: string) => void
}

function destinationOf(job: Job) {
  if (job.destinationCity && job.destinationCountry) return `${job.destinationCity}, ${job.destinationCountry}`
  return job.destinationCountry ?? job.location
}

export default function JobDetailModal({
  job,
  open,
  onOpenChange,
  userId,
  isApplicant,
  alreadyApplied,
  onApplySuccess,
}: Props) {
  const [showApplyForm, setShowApplyForm] = useState(false)

  // Reset to the job details view whenever the modal opens or closes
  useEffect(() => {
    if (!open) {
      setShowApplyForm(false)
    }
  }, [open])

  if (!job) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-6 border-b border-border flex-shrink-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                <img src={job.logo} alt={job.company} className="w-9 h-9 object-contain" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {showApplyForm ? `Apply for ${job.title}` : job.title}
                </Dialog.Title>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                    {destinationOf(job)}
                  </span>
                </div>
              </div>
            </div>
            <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {showApplyForm && userId ? (
            /* Step 2: Application Form */
            <div className="overflow-y-auto flex-1 p-6">
              <JobApplicationForm
                job={job}
                userId={userId}
                onSubmitSuccess={(jobId) => {
                  onApplySuccess(jobId)
                  onOpenChange(false)
                }}
                onCancel={() => setShowApplyForm(false)}
              />
            </div>
          ) : (
            /* Step 1: Job Details */
            <>
              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 p-6">
                <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
                  {/* Left Column: Requirements, Qualifications, etc. */}
                  <div className="space-y-6">
                    {/* Job Requirement */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                        Job Requirement
                      </h3>
                      {job.requirements && job.requirements.length > 0 ? (
                        <ol className="list-decimal pl-5 space-y-2.5 text-sm text-muted-foreground">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="leading-relaxed">
                              {req}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No requirements listed.</p>
                      )}
                    </div>

                    {/* Qualifications/Experience */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                        Qualifications/Experience
                      </h3>
                      <div className="p-4 rounded-xl border border-border bg-muted/10 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {job.qualifications || (
                          <p className="italic">
                            Experience: {job.experience}. Qualifications details not listed.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Job Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                        Job Description
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {job.description || 'No description provided for this listing.'}
                      </p>
                    </div>

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                          Benefits
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map(benefit => (
                            <span
                              key={benefit}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-teal/10 text-[12px] text-brand-teal border border-brand-teal/20"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Match */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        <span className="text-[12px] text-muted-foreground">AI Match Score</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-24 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-gold"
                              style={{ width: `${job.aiMatch}%` }}
                            />
                          </div>
                          <span className="text-[12px] font-semibold text-brand-gold">{job.aiMatch}%</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Posted {job.posted}</span>
                    </div>

                    {/* Login Notice */}
                    {!userId && (
                      <div className="text-center py-4 bg-muted/20 border border-border rounded-xl">
                        <span className="text-sm text-muted-foreground">
                          Please{' '}
                          <Link to="/login" className="text-brand-gold hover:underline font-semibold">
                            Login
                          </Link>{' '}
                          OR{' '}
                          <Link to="/signup" className="text-brand-gold hover:underline font-semibold">
                            Signup
                          </Link>{' '}
                          to apply.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Job Summary Sidebar */}
                  <div>
                    <div className="bg-brand-gold/[0.03] border border-brand-gold/15 rounded-2xl p-5 space-y-4 shadow-sm">
                      <h3 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
                        <Briefcase className="w-4 h-4 text-brand-gold" />
                        Job Summary
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Published On:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.publishedOn || job.posted}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Job Nature:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.jobNature || job.type}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Project:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.project || job.company}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Location:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{destinationOf(job)}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Experience:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.experience}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Age Limit:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.ageLimit || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Salary Range:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.salary}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Field of Work:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.fieldOfWork || job.category}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-[13px]">
                          <span className="text-brand-gold font-bold select-none">›</span>
                          <div>
                            <span className="text-muted-foreground font-medium">Available Till:</span>{' '}
                            <span className="text-foreground font-semibold ml-1">{job.availableTill || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-border/50 text-[12px] text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-brand-gold">Note:</span> {job.note || 'No CVs in hardcopy will be entertained. Only apply online through FF OES Jobs Portal.'}
                      </div>

                      <div className="pt-3 text-[11px] font-bold text-center text-brand-gold tracking-wider uppercase border-t border-border/30 bg-brand-gold/[0.01] rounded-lg">
                        Terms & Conditions and Service Charges Apply
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer — Apply action */}
              <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border flex-shrink-0">
                {!userId ? (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign in to Apply
                  </Link>
                ) : !isApplicant ? (
                  <span className="text-sm text-muted-foreground">
                    Only applicant accounts can apply to jobs.
                  </span>
                ) : alreadyApplied ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal/10 text-brand-teal text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Already Applied
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
