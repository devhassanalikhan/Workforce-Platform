// src/components/jobs/JobFormDialog.tsx

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createJob, updateJob, type JobPayload } from '@/lib/data/mutations'

const CATEGORIES = ['Construction','Healthcare','Hospitality','Manufacturing','Logistics','Engineering','Agriculture','Information Technology']
const EXP_LEVELS = ['Entry Level','Mid Level','Senior Level']
const CURRENCIES = ['USD','AED','SAR','EUR','GBP','PKR']
const DESTINATION_COUNTRIES = ['United Arab Emirates','Saudi Arabia','Qatar','Kuwait','Oman','Bahrain','Malaysia','Japan','Germany','Canada','Australia']
const VISA_STATUSES = ['Fully Sponsored','Work Permit Provided','Candidate Must Hold Valid Visa']
const CONTRACT_DURATIONS = ['6 Months','1 Year','2 Years','3 Years','Renewable Contract','Project Based']
const BENEFITS = ['Free Accommodation','Annual Return Air Ticket','Medical Insurance','Food Allowance','Local Transport']

interface ExistingJob {
  id: string
  title: string
  location: string
  destination_country?: string | null
  destination_city?: string | null
  visa_status?: string | null
  contract_duration?: string | null
  oep_license_no?: string | null
  benefits?: string[] | null
  salary_min: number | null
  salary_max: number | null
  salary_frequency?: string | null
  currency: string
  employment_type: string
  category: string
  experience_level: string
  description: string
  requirements: string[]
  is_hot: boolean
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string
  job?: ExistingJob
  onSuccess: () => void
}

const EMPTY: Omit<JobPayload, 'company_id'> = {
  title: '',
  location: '',
  destination_country: DESTINATION_COUNTRIES[0],
  destination_city: '',
  visa_status: VISA_STATUSES[0],
  contract_duration: CONTRACT_DURATIONS[1],
  oep_license_no: null,
  benefits: [],
  salary_min: null,
  salary_max: null,
  salary_frequency: 'monthly',
  currency: 'USD',
  employment_type: 'Full-time',
  category: 'Construction',
  experience_level: 'Entry Level',
  description: '',
  requirements: [],
  is_hot: false,
}

function splitLocation(location: string) {
  const [city = '', country = ''] = location.split(',').map(part => part.trim())
  return { city, country }
}

export default function JobFormDialog({ open, onOpenChange, companyId, job, onSuccess }: Props) {
  const isEdit = !!job
  const [form, setForm] = useState<Omit<JobPayload, 'company_id'>>(EMPTY)
  const [reqInput, setReqInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (job) {
        const fallbackLocation = splitLocation(job.location)
        setForm({
          title: job.title,
          location: job.location,
          destination_country: job.destination_country || fallbackLocation.country || DESTINATION_COUNTRIES[0],
          destination_city: job.destination_city || fallbackLocation.city,
          visa_status: job.visa_status ?? VISA_STATUSES[0],
          contract_duration: job.contract_duration ?? CONTRACT_DURATIONS[1],
          oep_license_no: job.oep_license_no ?? null,
          benefits: [...(job.benefits ?? [])],
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          salary_frequency: job.salary_frequency ?? 'monthly',
          currency: job.currency,
          employment_type: job.employment_type,
          category: job.category,
          experience_level: job.experience_level,
          description: job.description,
          requirements: [...job.requirements],
          is_hot: job.is_hot,
        })
      } else {
        setForm(EMPTY)
      }
      setReqInput('')
    }
  }, [open, job])

  function field<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function addReq() {
    const v = reqInput.trim()
    if (!v) return
    field('requirements', [...form.requirements, v])
    setReqInput('')
  }

  function removeReq(i: number) {
    field('requirements', form.requirements.filter((_, idx) => idx !== i))
  }

  function toggleBenefit(benefit: string) {
    field(
      'benefits',
      form.benefits.includes(benefit)
        ? form.benefits.filter(item => item !== benefit)
        : [...form.benefits, benefit]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.destination_country || !form.destination_city || !form.description) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (form.salary_min !== null && form.salary_max !== null && form.salary_min > form.salary_max) {
      toast.error('Salary minimum cannot be greater than salary maximum.')
      return
    }

    setIsLoading(true)
    const location = `${form.destination_city}, ${form.destination_country}`
    const payload: JobPayload = {
      ...form,
      location,
      oep_license_no: form.oep_license_no?.trim() || null,
      company_id: companyId,
    }
    const { error } = isEdit
      ? await updateJob(job!.id, payload)
      : await createJob(payload)
    setIsLoading(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success(isEdit ? 'Job updated successfully.' : 'Job posted successfully.')
      onOpenChange(false)
      onSuccess()
    }
  }

  const inputCls = 'w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
  const labelCls = 'text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5'
  const selectCls = `${inputCls} cursor-pointer appearance-none`

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <Dialog.Title className="text-base font-semibold text-foreground">
              {isEdit ? 'Edit Job Listing' : 'Post a New Job'}
            </Dialog.Title>
            <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-6 space-y-5">
              <div>
                <label className={labelCls}>Job Title *</label>
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={e => field('title', e.target.value)}
                  placeholder="e.g. Construction Supervisor"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={selectCls} value={form.category}
                    onChange={e => field('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Experience Level</label>
                  <select className={selectCls} value={form.experience_level}
                    onChange={e => field('experience_level', e.target.value)}>
                    {EXP_LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <section className="rounded-2xl border border-border bg-muted/20 p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-card-foreground">Overseas Logistics</h3>
                  <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">International</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Destination Country *</label>
                    <select className={selectCls} value={form.destination_country}
                      onChange={e => field('destination_country', e.target.value)} required>
                      {DESTINATION_COUNTRIES.map(country => <option key={country}>{country}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Destination City *</label>
                    <input
                      className={inputCls}
                      value={form.destination_city}
                      onChange={e => field('destination_city', e.target.value)}
                      placeholder="e.g. Dubai"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Visa/Work Permit Status</label>
                    <select className={selectCls} value={form.visa_status}
                      onChange={e => field('visa_status', e.target.value)}>
                      {VISA_STATUSES.map(status => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Contract Duration</label>
                    <select className={selectCls} value={form.contract_duration}
                      onChange={e => field('contract_duration', e.target.value)}>
                      {CONTRACT_DURATIONS.map(duration => <option key={duration}>{duration}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>OEP License No. Optional</label>
                    <input
                      className={inputCls}
                      value={form.oep_license_no ?? ''}
                      onChange={e => field('oep_license_no', e.target.value)}
                      placeholder="e.g. OP&HRD/1234"
                    />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className={labelCls}>Currency</label>
                  <select className={selectCls} value={form.currency}
                    onChange={e => field('currency', e.target.value)}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Salary Min</label>
                  <input className={inputCls} type="number" min={0}
                    value={form.salary_min ?? ''}
                    onChange={e => field('salary_min', e.target.value ? Number(e.target.value) : null)}
                    placeholder="e.g. 2000" />
                </div>
                <div>
                  <label className={labelCls}>Salary Max</label>
                  <input className={inputCls} type="number" min={0}
                    value={form.salary_max ?? ''}
                    onChange={e => field('salary_max', e.target.value ? Number(e.target.value) : null)}
                    placeholder="e.g. 4000" />
                </div>
                <div>
                  <label className={labelCls}>Salary Frequency</label>
                  <div className="grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1">
                    {(['monthly', 'yearly'] as const).map(frequency => (
                      <button
                        key={frequency}
                        type="button"
                        onClick={() => field('salary_frequency', frequency)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                          form.salary_frequency === frequency
                            ? 'bg-brand-gold text-black'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {frequency}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>Benefits</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BENEFITS.map(benefit => {
                    const checked = form.benefits.includes(benefit)
                    return (
                      <label
                        key={benefit}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all cursor-pointer ${
                          checked
                            ? 'border-brand-teal/50 bg-brand-teal/10 text-card-foreground'
                            : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBenefit(benefit)}
                          className="h-4 w-4 accent-brand-teal"
                        />
                        <span>{benefit}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className={labelCls}>Job Description *</label>
                <textarea className={`${inputCls} resize-none h-28`}
                  value={form.description}
                  onChange={e => field('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and work environment..."
                  required />
              </div>

              <div>
                <label className={labelCls}>Requirements</label>
                <div className="flex gap-2 mb-2">
                  <input className={inputCls} value={reqInput}
                    onChange={e => setReqInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addReq() } }}
                    placeholder="Type a requirement and press Enter" />
                  <button type="button" onClick={addReq}
                    className="flex-shrink-0 px-3 py-2.5 bg-brand-gold/10 text-brand-gold rounded-xl hover:bg-brand-gold/20 transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {form.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.requirements.map((req, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border text-[12px] text-foreground">
                        {req}
                        <button type="button" onClick={() => removeReq(i)}
                          className="text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => field('is_hot', !form.is_hot)}
                  className={`w-10 h-5 rounded-full transition-all relative ${
                    form.is_hot ? 'bg-brand-gold' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    form.is_hot ? 'left-5' : 'left-0.5'
                  }`} />
                </button>
                <label className="text-sm text-muted-foreground">Mark as Hot listing</label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 pt-0 flex-shrink-0">
              <Dialog.Close className="px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-all">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Post Job'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
