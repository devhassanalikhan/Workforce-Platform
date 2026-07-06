// src/components/jobs/JobApplicationForm.tsx

import { useState, useEffect } from 'react'
import { UploadCloud, FileText, Loader2, User, MapPin, Briefcase, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { uploadApplicantDocument } from '@/lib/data/documents'
import { applyToJob, updateChecklistItem } from '@/lib/data/mutations'
import type { Job } from '@/types/domain'

interface Props {
  job: Job
  userId: string
  onSubmitSuccess: (jobId: string) => void
  onCancel: () => void
}

export default function JobApplicationForm({ job, userId, onSubmitSuccess, onCancel }: Props) {
  const [profile, setProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [coverNote, setCoverNote] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Document states
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  // Fetch applicant profile to display overview
  useEffect(() => {
    if (!userId) return
    ;(async () => {
      const { data } = await supabase
        .from('talent_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (data) {
        setProfile(data)
      }
      setLoadingProfile(false)
    })()
  }, [userId])

  function validateFile(file: File) {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (!allowed.includes(file.type)) return 'Only PDF / JPG / PNG allowed.'
    if (file.size > maxSize) return 'File exceeds 10MB limit.'
    return null
  }

  async function handleFileUpload(file?: File) {
    if (!userId) return toast.error('Sign in to upload documents')
    if (!file) return

    const err = validateFile(file)
    if (err) return toast.error(err)

    setIsUploading(true)
    // Upload document using the standard documents module helper (reusing storage scheme)
    // placementId is undefined for now since the placement hasn't been created yet.
    const res = await uploadApplicantDocument(userId, file, 'docs')
    setIsUploading(false)

    if (res.error) {
      toast.error(res.error)
    } else if (res.documentId) {
      setUploadedDocId(res.documentId)
      setUploadedFileName(file.name)
      toast.success('Resume uploaded successfully.')
    }
  }

  function handleRemoveFile() {
    setUploadedDocId(null)
    setUploadedFileName(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !job) return

    setIsSubmitting(true)

    // Generate a deterministic job order code matching the convention
    const jobOrderCode = `JO-${job.id.slice(0, 8).toUpperCase()}`

    // 1. Create the placement row (stage 1 = applied)
    const { data: placement, error: applyError } = await applyToJob({
      talent_id: userId,
      job_id: job.id,
      stage: 1,
      job_order_code: jobOrderCode,
      cover_note: coverNote.trim() || undefined,
    })

    if (applyError) {
      setIsSubmitting(false)
      if (applyError.toLowerCase().includes('unique') || applyError.toLowerCase().includes('duplicate')) {
        toast.error('You have already applied to this job.')
        onSubmitSuccess(job.id)
      } else {
        toast.error(applyError)
      }
      return
    }

    const placementId = placement?.id

    if (placementId) {
      // 2. Link the uploaded document to this placement, if uploaded
      if (uploadedDocId) {
        const { error: linkError } = await supabase
          .from('compliance_documents')
          .update({ placement_id: placementId })
          .eq('id', uploadedDocId)

        if (!linkError) {
          // 3. Mark the corresponding checklist item as pending
          const { data: checklistItem } = await supabase
            .from('compliance_checklist_items')
            .select('id')
            .eq('placement_id', placementId)
            .eq('item_key', 'docs')
            .maybeSingle()

          if (checklistItem?.id) {
            await updateChecklistItem(checklistItem.id, { status: 'pending' })
          }
        }
      }
    }

    setIsSubmitting(false)
    toast.success(`Application submitted successfully for ${job.title}!`)
    onSubmitSuccess(job.id)
  }

  if (loadingProfile) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
        <span className="text-sm">Loading profile data…</span>
      </div>
    )
  }

  // If the user has not completed their talent profile, block application
  if (!profile) {
    return (
      <div className="py-8 px-4 text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Incomplete Profile</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You must create your talent profile before you can apply for jobs. Please head over to your Dashboard and fill in your details first.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted/50 transition-all"
          >
            Cancel
          </button>
          <a
            href="/dashboard/profile"
            className="px-5 py-2.5 bg-brand-gold text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  const inputCls = 'w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
  const labelCls = 'text-[11px] font-semibold text-foreground uppercase tracking-wider block mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Section 1: Profile Summary Review ── */}
      <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <User className="w-4 h-4 text-brand-gold" />
          <h4 className="text-sm font-semibold text-foreground">Review Profile Details</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block">Full Name</span>
            <span className="font-medium text-foreground">{profile.name}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Role Title</span>
            <span className="font-medium text-foreground">{profile.role_title}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Location</span>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-teal" />
              <span className="font-medium text-foreground">{profile.location}</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Years of Experience</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">{profile.experience_years} years</span>
            </div>
          </div>
        </div>

        {profile.skills && profile.skills.length > 0 && (
          <div className="pt-2">
            <span className="text-xs text-muted-foreground block mb-1.5">Key Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-muted text-[11px] text-muted-foreground border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground bg-brand-teal/5 p-2 rounded-lg border border-brand-teal/10">
          Note: Ethical employers review your fully verified profile. Updates can be made anytime in your dashboard.
        </p>
      </div>

      {/* ── Section 2: Cover Note ── */}
      <div>
        <label htmlFor="cover-note" className={labelCls}>
          Cover Note (Optional)
        </label>
        <textarea
          id="cover-note"
          value={coverNote}
          onChange={e => setCoverNote(e.target.value)}
          className={`${inputCls} h-28 resize-none`}
          placeholder="Briefly explain why you are a good fit for this role..."
        />
      </div>

      {/* ── Section 3: Resume Upload ── */}
      <div className="space-y-2">
        <label className={labelCls}>Attach Resume / CV</label>
        
        {uploadedFileName ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-brand-teal/20 bg-brand-teal/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-5 h-5 text-brand-teal flex-shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">{uploadedFileName}</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={e => handleFileUpload(e.target.files?.[0])}
              disabled={isUploading}
            />
            <label
              htmlFor="resume-file-input"
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl hover:border-brand-gold/40 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all ${
                isUploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-brand-gold mb-2" />
                  <span className="text-sm text-muted-foreground font-medium">Uploading to secure storage…</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-brand-gold transition-colors" />
                  <span className="text-sm text-foreground font-medium">Click to upload your resume</span>
                  <span className="text-[11px] text-muted-foreground mt-1">PDF, JPG, or PNG up to 10MB</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>

      {/* ── Form Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isUploading}
          className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSubmitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}
