// src/components/jobs/JobApplicationForm.tsx

import { useState, useEffect } from 'react'
import { UploadCloud, FileText, Loader2, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { uploadApplicantDocument } from '@/lib/data/documents'
import { applyToJob, updateChecklistItem, updateTalentProfile } from '@/lib/data/mutations'
import type { Job } from '@/types/domain'

interface Props {
  job: Job
  userId: string
  onSubmitSuccess: (jobId: string) => void
  onCancel: () => void
}

const categoryOptions = [
  'Construction',
  'Healthcare',
  'Hospitality',
  'Manufacturing',
  'Logistics',
  'Engineering',
  'Agriculture',
  'Information Technology',
]

const cityOptions = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Other',
]

const qualificationOptions = ['Middle', 'Matric', 'Intermediate', 'Bachelors', 'Masters', 'Other']

const fieldOfWorkOptions = [
  'AC Technician',
  'Electrician',
  'Plumber',
  'Welder',
  'Mason',
  'Carpenter',
  'Driver',
  'Cook / Chef',
  'Waiter',
  'Housekeeping / Cleaner',
  'Security Guard',
  'Caregiver',
  'Nurse',
  'Factory Worker',
  'Other',
]

const heightOptions = [
  `Below 5'0"`,
  `5'0" - 5'3"`,
  `5'4" - 5'6"`,
  `5'7" - 5'9"`,
  `5'10" and above`,
]

const yesNoOptions = ['Yes', 'No']

interface FormState {
  name: string
  gender: string
  dateOfBirth: string
  cnic: string
  city: string
  phone: string
  email: string
  category: string
  qualification: string
  fieldOfWork: string
  experienceYears: string
  relevantExperienceYears: string
  foreignExperience: string
  drivingLicense: string
  hasCertification: string
  height: string
}

const emptyForm: FormState = {
  name: '',
  gender: '',
  dateOfBirth: '',
  cnic: '',
  city: '',
  phone: '',
  email: '',
  category: '',
  qualification: '',
  fieldOfWork: '',
  experienceYears: '',
  relevantExperienceYears: '',
  foreignExperience: '',
  drivingLicense: '',
  hasCertification: '',
  height: '',
}

export default function JobApplicationForm({ job, userId, onSubmitSuccess, onCancel }: Props) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [coverNote, setCoverNote] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Document states
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  // Fetch applicant profile and pre-fill the form with any previously saved values
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
        setForm({
          name: data.name ?? '',
          gender: data.gender ?? '',
          dateOfBirth: data.date_of_birth ?? '',
          cnic: data.cnic ?? '',
          city: data.city ?? '',
          phone: data.phone ?? '',
          email: data.email ?? user?.email ?? '',
          category: data.category ?? '',
          qualification: data.qualification ?? '',
          fieldOfWork: data.field_of_work ?? '',
          experienceYears: data.experience_years != null ? String(data.experience_years) : '',
          relevantExperienceYears:
            data.relevant_experience_years != null ? String(data.relevant_experience_years) : '',
          foreignExperience: data.foreign_experience ?? '',
          drivingLicense: data.driving_license ?? '',
          hasCertification: data.has_certification ?? '',
          height: data.height ?? '',
        })
      }
      setLoadingProfile(false)
    })()
  }, [userId, user?.email])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

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

  function validateForm(): string | null {
    if (!form.name.trim()) return 'Full Name is required.'
    if (!form.gender) return 'Gender is required.'
    if (!form.dateOfBirth) return 'Date of Birth is required.'
    if (!/^\d{13}$/.test(form.cnic.trim())) return 'CNIC must be exactly 13 digits, no dashes.'
    if (!form.city) return 'City is required.'
    if (!form.phone.trim()) return 'Phone Number is required.'
    if (!form.category) return 'Category is required.'
    if (!form.qualification) return 'Qualification is required.'
    if (!form.fieldOfWork) return 'Field of Work is required.'
    if (form.experienceYears === '' || Number(form.experienceYears) < 0)
      return 'Total Year(s) of Experience is required.'
    if (form.relevantExperienceYears === '' || Number(form.relevantExperienceYears) < 0)
      return 'Year(s) of Job Relevant Experience is required.'
    if (!form.foreignExperience) return 'Foreign Experience is required.'
    if (!form.drivingLicense) return 'Driving License is required.'
    if (!form.hasCertification) return 'Certification is required.'
    if (!form.height) return 'Height is required.'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !job) return

    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }

    setIsSubmitting(true)

    // 1. Persist the applicant's profile fields captured on this form so
    // future applications reuse them.
    const { error: profileError } = await updateTalentProfile(userId, {
      name: form.name.trim(),
      gender: form.gender,
      date_of_birth: form.dateOfBirth,
      cnic: form.cnic.trim(),
      city: form.city,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      category: form.category,
      qualification: form.qualification,
      field_of_work: form.fieldOfWork,
      experience_years: Number(form.experienceYears),
      relevant_experience_years: Number(form.relevantExperienceYears),
      foreign_experience: form.foreignExperience,
      driving_license: form.drivingLicense,
      has_certification: form.hasCertification,
      height: form.height,
    })

    if (profileError) {
      setIsSubmitting(false)
      toast.error(profileError)
      return
    }

    // Generate a deterministic job order code matching the convention
    const jobOrderCode = `JO-${job.id.slice(0, 8).toUpperCase()}`

    // 2. Create the placement row (stage 1 = applied)
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
      // 3. Link the uploaded document to this placement, if uploaded
      if (uploadedDocId) {
        const { error: linkError } = await supabase
          .from('compliance_documents')
          .update({ placement_id: placementId })
          .eq('id', uploadedDocId)

        if (!linkError) {
          // 4. Mark the corresponding checklist item as pending
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
  const selectCls = `${inputCls} appearance-none cursor-pointer`
  const labelCls = 'text-[11px] font-semibold text-foreground uppercase tracking-wider block mb-1.5'
  const required = <span className="text-red-500">*</span>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Section 1: Applicant Details ── */}
      <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Applicant Details</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Full Name {required}</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              className={inputCls}
              placeholder="Enter Your Name"
            />
          </div>
          <div>
            <label className={labelCls}>Gender {required}</label>
            <select value={form.gender} onChange={e => setField('gender', e.target.value)} className={selectCls}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Date of Birth {required}</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={e => setField('dateOfBirth', e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>CNIC {required}</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={13}
              value={form.cnic}
              onChange={e => setField('cnic', e.target.value.replace(/\D/g, ''))}
              className={inputCls}
              placeholder="1111111111111"
            />
          </div>
          <div>
            <label className={labelCls}>City {required}</label>
            <select value={form.city} onChange={e => setField('city', e.target.value)} className={selectCls}>
              <option value="">Select City</option>
              {cityOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setField('email', e.target.value)}
              className={inputCls}
              placeholder="abc@gmail.com"
            />
          </div>

          <div>
            <label className={labelCls}>Phone Number {required}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
              className={inputCls}
              placeholder="03331234567"
            />
          </div>
          <div>
            <label className={labelCls}>Select Category {required}</label>
            <select value={form.category} onChange={e => setField('category', e.target.value)} className={selectCls}>
              <option value="">Category</option>
              {categoryOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Qualification {required}</label>
            <select
              value={form.qualification}
              onChange={e => setField('qualification', e.target.value)}
              className={selectCls}
            >
              <option value="">Select</option>
              {qualificationOptions.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Field of Work {required}</label>
            <select
              value={form.fieldOfWork}
              onChange={e => setField('fieldOfWork', e.target.value)}
              className={selectCls}
            >
              <option value="">Select</option>
              {fieldOfWorkOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Total Year(s) of Experience {required}</label>
            <input
              type="number"
              min={0}
              value={form.experienceYears}
              onChange={e => setField('experienceYears', e.target.value)}
              className={inputCls}
              placeholder="Select Experience in Years"
            />
          </div>
          <div>
            <label className={labelCls}>Year(s) of Job Relevant Experience {required}</label>
            <input
              type="number"
              min={0}
              value={form.relevantExperienceYears}
              onChange={e => setField('relevantExperienceYears', e.target.value)}
              className={inputCls}
              placeholder="Select Year(s)"
            />
          </div>

          <div>
            <label className={labelCls}>Foreign Experience {required}</label>
            <select
              value={form.foreignExperience}
              onChange={e => setField('foreignExperience', e.target.value)}
              className={selectCls}
            >
              <option value="">Select</option>
              {yesNoOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Driving License {required}</label>
            <select
              value={form.drivingLicense}
              onChange={e => setField('drivingLicense', e.target.value)}
              className={selectCls}
            >
              <option value="">Select</option>
              {yesNoOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Certification {required}</label>
            <select
              value={form.hasCertification}
              onChange={e => setField('hasCertification', e.target.value)}
              className={selectCls}
            >
              <option value="">Select</option>
              {yesNoOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Height {required}</label>
            <select value={form.height} onChange={e => setField('height', e.target.value)} className={selectCls}>
              <option value="">Select Height</option>
              {heightOptions.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground bg-brand-teal/5 p-2 rounded-lg border border-brand-teal/10">
          Note: Ethical employers review your fully verified profile. These details are saved to your profile and reused for future applications.
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
