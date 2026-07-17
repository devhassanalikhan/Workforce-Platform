// src/components/jobs/JobApplicationForm.tsx

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UploadCloud, FileText, Loader2, AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { uploadApplicantDocument } from '@/lib/data/documents'
import { applyToJob, updateChecklistItem, updateTalentProfile } from '@/lib/data/mutations'
import type { Job } from '@/types/domain'
import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Option lists
// ─────────────────────────────────────────────────────────────────────────────

const categoryOptions = [
  'Construction',
  'Healthcare',
  'Hospitality',
  'Manufacturing',
  'Logistics',
  'Engineering',
  'Agriculture',
  'Information Technology',
] as const

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
] as const

const qualificationOptions = ['Middle', 'Matric', 'Intermediate', 'Bachelors', 'Masters', 'Other'] as const

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
] as const

const heightOptions = [
  `Below 5'0"`,
  `5'0" - 5'3"`,
  `5'4" - 5'6"`,
  `5'7" - 5'9"`,
  `5'10" and above`,
] as const

const yesNoOptions = ['Yes', 'No'] as const

// ─────────────────────────────────────────────────────────────────────────────
// Zod Schema
// ─────────────────────────────────────────────────────────────────────────────

const applicationSchema = z.object({
  name: z.string().trim().min(1, 'Full Name is required.'),
  gender: z.enum(['Male', 'Female'], { error: 'Gender is required.' }),
  date_of_birth: z
    .string()
    .min(1, 'Date of Birth is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD).'),
  cnic: z
    .string()
    .trim()
    .regex(/^\d{13}$/, 'CNIC must be exactly 13 digits, no dashes.'),
  city: z.enum(cityOptions, { error: 'City is required.' }),
  phone: z.string().trim().min(1, 'Phone Number is required.'),
  email: z.string().trim().optional(),
  category: z.enum(categoryOptions, { error: 'Category is required.' }),
  qualification: z.enum(qualificationOptions, { error: 'Qualification is required.' }),
  field_of_work: z.enum(fieldOfWorkOptions, { error: 'Field of Work is required.' }),
  experience_years: z
    .string()
    .min(1, 'Total Year(s) of Experience is required.')
    .refine(v => !isNaN(parseInt(v, 10)) && parseInt(v, 10) >= 0, {
      message: 'Experience must be a non-negative number.',
    }),
  relevant_experience_years: z
    .string()
    .min(1, 'Year(s) of Job Relevant Experience is required.')
    .refine(v => !isNaN(parseInt(v, 10)) && parseInt(v, 10) >= 0, {
      message: 'Relevant experience must be a non-negative number.',
    }),
  foreign_experience: z.enum(yesNoOptions, { error: 'Foreign Experience is required.' }),
  driving_license: z.enum(yesNoOptions, { error: 'Driving License is required.' }),
  has_certification: z.enum(yesNoOptions, { error: 'Certification is required.' }),
  height: z.enum(heightOptions, { error: 'Height is required.' }),
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  job: Job
  userId: string
  onSubmitSuccess: (jobId: string) => void
  onCancel: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function JobApplicationForm({ job, userId, onSubmitSuccess, onCancel }: Props) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [coverNote, setCoverNote] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      gender: undefined,
      date_of_birth: '',
      cnic: '',
      city: undefined,
      phone: '',
      email: '',
      category: undefined,
      qualification: undefined,
      field_of_work: undefined,
      experience_years: '',
      relevant_experience_years: '',
      foreign_experience: undefined,
      driving_license: undefined,
      has_certification: undefined,
      height: undefined,
    },
  })

  // Fetch applicant profile and pre-fill form with any previously saved values
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
        // DB columns are plain strings; the values were only ever written by
        // this same Zod-validated form, so they already conform to the
        // narrower literal unions below.
        reset({
          name: data.name ?? '',
          gender: (data.gender ?? undefined) as ApplicationFormValues['gender'],
          date_of_birth: data.date_of_birth ?? '',
          cnic: data.cnic ?? '',
          city: (data.city ?? undefined) as ApplicationFormValues['city'],
          phone: data.phone ?? '',
          email: data.email ?? user?.email ?? '',
          category: (data.category ?? undefined) as ApplicationFormValues['category'],
          qualification: (data.qualification ?? undefined) as ApplicationFormValues['qualification'],
          field_of_work: (data.field_of_work ?? undefined) as ApplicationFormValues['field_of_work'],
          experience_years: data.experience_years != null ? String(data.experience_years) : '',
          relevant_experience_years:
            data.relevant_experience_years != null
              ? String(data.relevant_experience_years)
              : '',
          foreign_experience: (data.foreign_experience ?? undefined) as ApplicationFormValues['foreign_experience'],
          driving_license: (data.driving_license ?? undefined) as ApplicationFormValues['driving_license'],
          has_certification: (data.has_certification ?? undefined) as ApplicationFormValues['has_certification'],
          height: (data.height ?? undefined) as ApplicationFormValues['height'],
        })
      }
      setLoadingProfile(false)
    })()
  }, [userId, user?.email, reset])

  function validateFile(file: File) {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10 MB
    if (!allowed.includes(file.type)) return 'Only PDF / JPG / PNG allowed.'
    if (file.size > maxSize) return 'File exceeds 10 MB limit.'
    return null
  }

  async function handleFileUpload(file?: File) {
    if (!userId) return toast.error('Sign in to upload documents')
    if (!file) return
    const err = validateFile(file)
    if (err) return toast.error(err)
    setIsUploading(true)
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

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!userId || !job) return
    setIsSubmitting(true)

    // 1. Persist applicant profile fields — strictly parsed integers for experience years.
    const { error: profileError } = await updateTalentProfile(userId, {
      name: data.name.trim(),
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      cnic: data.cnic.trim(),
      city: data.city,
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      category: data.category,
      qualification: data.qualification,
      field_of_work: data.field_of_work,
      experience_years: parseInt(data.experience_years, 10),
      relevant_experience_years: parseInt(data.relevant_experience_years, 10),
      foreign_experience: data.foreign_experience,
      driving_license: data.driving_license,
      has_certification: data.has_certification,
      height: data.height,
    })

    if (profileError) {
      setIsSubmitting(false)
      toast.error(profileError)
      return
    }

    // 2. Create placement row (stage 1 = applied)
    const jobOrderCode = `JO-${job.id.slice(0, 8).toUpperCase()}`
    const { data: placement, error: applyError } = await applyToJob({
      talent_id: userId,
      job_id: job.id,
      stage: 1,
      job_order_code: jobOrderCode,
      cover_note: coverNote.trim() || undefined,
    })

    if (applyError) {
      setIsSubmitting(false)
      if (
        applyError.toLowerCase().includes('unique') ||
        applyError.toLowerCase().includes('duplicate')
      ) {
        toast.error('You have already applied to this job.')
        onSubmitSuccess(job.id)
      } else {
        toast.error(applyError)
      }
      return
    }

    const placementId = placement?.id

    if (placementId) {
      // 3. Link uploaded document to this placement, if uploaded
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

  // ── Early returns ────────────────────────────────────────────────────────────

  if (loadingProfile) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
        <span className="text-sm">Loading profile data…</span>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="py-8 px-4 text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Incomplete Profile</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You must create your talent profile before you can apply for jobs. Please head over to
            your Dashboard and fill in your details first.
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

  // ── Style tokens ─────────────────────────────────────────────────────────────

  const inputCls =
    'w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
  const inputErrCls = 'border-destructive/50 focus:ring-destructive/40 focus:border-destructive/50'
  const selectCls = `${inputCls} appearance-none cursor-pointer`
  const labelCls = 'text-[11px] font-semibold text-foreground uppercase tracking-wider block mb-1.5'
  const fieldErrCls = 'text-[11px] text-destructive mt-1 flex items-center gap-1'
  const required = <span className="text-red-500">*</span>

  /** Tiny helper that renders an inline field error */
  function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null
    return (
      <p className={fieldErrCls}>
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {msg}
      </p>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* ── Section 1: Applicant Details ── */}
      <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground">Applicant Details</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Full Name */}
          <div>
            <label className={labelCls}>Full Name {required}</label>
            <input
              type="text"
              placeholder="Enter Your Name"
              className={`${inputCls} ${errors.name ? inputErrCls : ''}`}
              {...register('name')}
            />
            <FieldError msg={errors.name?.message} />
          </div>

          {/* Gender */}
          <div>
            <label className={labelCls}>Gender {required}</label>
            <select className={`${selectCls} ${errors.gender ? inputErrCls : ''}`} {...register('gender')}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <FieldError msg={errors.gender?.message} />
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelCls}>Date of Birth {required}</label>
            <input
              type="date"
              className={`${inputCls} ${errors.date_of_birth ? inputErrCls : ''}`}
              {...register('date_of_birth')}
            />
            <FieldError msg={errors.date_of_birth?.message} />
          </div>

          {/* CNIC */}
          <div>
            <label className={labelCls}>CNIC {required}</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={13}
              placeholder="1111111111111"
              className={`${inputCls} ${errors.cnic ? inputErrCls : ''}`}
              {...register('cnic', {
                onChange: e => {
                  // Strip non-digits inline
                  e.target.value = e.target.value.replace(/\D/g, '')
                },
              })}
            />
            <FieldError msg={errors.cnic?.message} />
          </div>

          {/* City */}
          <div>
            <label className={labelCls}>City {required}</label>
            <select className={`${selectCls} ${errors.city ? inputErrCls : ''}`} {...register('city')}>
              <option value="">Select City</option>
              {cityOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FieldError msg={errors.city?.message} />
          </div>

          {/* Email (optional) */}
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              placeholder="abc@gmail.com"
              className={inputCls}
              {...register('email')}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>Phone Number {required}</label>
            <input
              type="tel"
              placeholder="03331234567"
              className={`${inputCls} ${errors.phone ? inputErrCls : ''}`}
              {...register('phone')}
            />
            <FieldError msg={errors.phone?.message} />
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>Select Category {required}</label>
            <select className={`${selectCls} ${errors.category ? inputErrCls : ''}`} {...register('category')}>
              <option value="">Category</option>
              {categoryOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FieldError msg={errors.category?.message} />
          </div>

          {/* Qualification */}
          <div>
            <label className={labelCls}>Qualification {required}</label>
            <select className={`${selectCls} ${errors.qualification ? inputErrCls : ''}`} {...register('qualification')}>
              <option value="">Select</option>
              {qualificationOptions.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <FieldError msg={errors.qualification?.message} />
          </div>

          {/* Field of Work */}
          <div>
            <label className={labelCls}>Field of Work {required}</label>
            <select className={`${selectCls} ${errors.field_of_work ? inputErrCls : ''}`} {...register('field_of_work')}>
              <option value="">Select</option>
              {fieldOfWorkOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <FieldError msg={errors.field_of_work?.message} />
          </div>

          {/* Total Experience */}
          <div>
            <label className={labelCls}>Total Year(s) of Experience {required}</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 3"
              className={`${inputCls} ${errors.experience_years ? inputErrCls : ''}`}
              {...register('experience_years')}
            />
            <FieldError msg={errors.experience_years?.message} />
          </div>

          {/* Relevant Experience */}
          <div>
            <label className={labelCls}>Year(s) of Job Relevant Experience {required}</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 1"
              className={`${inputCls} ${errors.relevant_experience_years ? inputErrCls : ''}`}
              {...register('relevant_experience_years')}
            />
            <FieldError msg={errors.relevant_experience_years?.message} />
          </div>

          {/* Foreign Experience */}
          <div>
            <label className={labelCls}>Foreign Experience {required}</label>
            <select className={`${selectCls} ${errors.foreign_experience ? inputErrCls : ''}`} {...register('foreign_experience')}>
              <option value="">Select</option>
              {yesNoOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <FieldError msg={errors.foreign_experience?.message} />
          </div>

          {/* Driving License */}
          <div>
            <label className={labelCls}>Driving License {required}</label>
            <select className={`${selectCls} ${errors.driving_license ? inputErrCls : ''}`} {...register('driving_license')}>
              <option value="">Select</option>
              {yesNoOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <FieldError msg={errors.driving_license?.message} />
          </div>

          {/* Certification */}
          <div>
            <label className={labelCls}>Certification {required}</label>
            <select className={`${selectCls} ${errors.has_certification ? inputErrCls : ''}`} {...register('has_certification')}>
              <option value="">Select</option>
              {yesNoOptions.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <FieldError msg={errors.has_certification?.message} />
          </div>

          {/* Height */}
          <div>
            <label className={labelCls}>Height {required}</label>
            <select className={`${selectCls} ${errors.height ? inputErrCls : ''}`} {...register('height')}>
              <option value="">Select Height</option>
              {heightOptions.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <FieldError msg={errors.height?.message} />
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground bg-brand-teal/5 p-2 rounded-lg border border-brand-teal/10">
          Note: Ethical employers review your fully verified profile. These details are saved to your
          profile and reused for future applications.
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
                  <span className="text-sm text-muted-foreground font-medium">
                    Uploading to secure storage…
                  </span>
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
