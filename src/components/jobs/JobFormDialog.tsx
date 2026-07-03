// src/components/jobs/JobFormDialog.tsx

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createJob, updateJob, type JobPayload } from '@/lib/data/mutations'

const CATEGORIES = ['Construction','Healthcare','Hospitality','Manufacturing','Logistics','Engineering','Agriculture','Information Technology']
const EXP_LEVELS = ['Entry Level','Mid Level','Senior Level']
const EMP_TYPES  = ['Full-time','Contract','Temporary','Seasonal']
const CURRENCIES = ['USD','AED','SAR','EUR','GBP','PKR']

interface ExistingJob {
  id: string
  title: string
  location: string
  salary_min: number | null
  salary_max: number | null
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
  title: '', location: '', salary_min: null, salary_max: null,
  currency: 'USD', employment_type: 'Full-time', category: 'Construction',
  experience_level: 'Entry Level', description: '', requirements: [], is_hot: false,
}

export default function JobFormDialog({ open, onOpenChange, companyId, job, onSuccess }: Props) {
  const isEdit = !!job
  const [form, setForm] = useState<Omit<JobPayload, 'company_id'>>(EMPTY)
  const [reqInput, setReqInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(job ? {
        title: job.title, location: job.location,
        salary_min: job.salary_min, salary_max: job.salary_max,
        currency: job.currency, employment_type: job.employment_type,
        category: job.category, experience_level: job.experience_level,
        description: job.description, requirements: [...job.requirements],
        is_hot: job.is_hot,
      } : EMPTY)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.location || !form.description) {
      toast.error('Please fill in all required fields.')
      return
    }
    setIsLoading(true)
    const payload: JobPayload = { ...form, company_id: companyId }
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <Dialog.Title className="text-base font-semibold text-foreground">
              {isEdit ? 'Edit Job Listing' : 'Post a New Job'}
            </Dialog.Title>
            <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-6 space-y-5">

              {/* Title */}
              <div>
                <label className={labelCls}>Job Title *</label>
                <input className={inputCls} value={form.title}
                  onChange={e => field('title', e.target.value)}
                  placeholder="e.g. Construction Supervisor" required />
              </div>

              {/* Location + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Location *</label>
                  <input className={inputCls} value={form.location}
                    onChange={e => field('location', e.target.value)}
                    placeholder="e.g. Dubai, UAE" required />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={selectCls} value={form.category}
                    onChange={e => field('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Employment Type + Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Employment Type</label>
                  <select className={selectCls} value={form.employment_type}
                    onChange={e => field('employment_type', e.target.value)}>
                    {EMP_TYPES.map(t => <option key={t}>{t}</option>)}
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

              {/* Salary */}
              <div className="grid grid-cols-3 gap-4">
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
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Job Description *</label>
                <textarea className={`${inputCls} resize-none h-28`}
                  value={form.description}
                  onChange={e => field('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and work environment…"
                  required />
              </div>

              {/* Requirements */}
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

              {/* Hot toggle */}
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

            {/* Footer */}
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
