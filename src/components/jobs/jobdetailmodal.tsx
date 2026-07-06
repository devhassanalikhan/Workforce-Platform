// src/components/jobs/JobDetailModal.tsx

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, MapPin, DollarSign, Clock, Building2, Sparkles, CheckCircle2, LogIn } from 'lucide-react'
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
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
                <div className="flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{job.company}</span>
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
              <div className="overflow-y-auto flex-1 p-6 space-y-5">
                {/* Quick facts */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-4 border-b border-border">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-brand-teal" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-brand-gold" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {job.type}
                  </div>
                  <div className="text-sm text-muted-foreground">Posted {job.posted}</div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                    Job Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {job.description || 'No description provided for this listing.'}
                  </p>
                </div>

                {/* Requirements */}
                {job.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                      Requirements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map(req => (
                        <span
                          key={req}
                          className="px-2.5 py-1 rounded-md bg-muted text-[12px] text-muted-foreground border border-border"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Match */}
                <div className="flex items-center gap-2 pt-2">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span className="text-[12px] text-muted-foreground">AI Match Score:</span>
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
