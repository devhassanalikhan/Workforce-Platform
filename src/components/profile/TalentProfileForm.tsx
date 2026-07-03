// src/components/profile/TalentProfileForm.tsx

import { useState } from 'react'
import { Plus, Trash2, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { upsertTalentProfile, type TalentProfilePayload } from '@/lib/data/mutations'

const ROLES = [
  'Construction Supervisor', 'Site Engineer', 'Electrician', 'Plumber',
  'Nurse (RN)', 'Caregiver', 'Chef', 'Hospitality Staff',
  'Logistics Coordinator', 'Heavy Equipment Operator', 'Welder',
  'Security Guard', 'IT Support Technician', 'Agricultural Worker', 'Other',
]

interface Props {
  userId: string
  existingProfile?: Partial<TalentProfilePayload>
  onSuccess: () => void
}

export default function TalentProfileForm({ userId, existingProfile, onSuccess }: Props) {
  const [name, setName]         = useState(existingProfile?.name ?? '')
  const [roleTitle, setRoleTitle] = useState(existingProfile?.role_title ?? '')
  const [location, setLocation] = useState(existingProfile?.location ?? '')
  const [expYears, setExpYears] = useState<number>(existingProfile?.experience_years ?? 0)
  const [skills, setSkills]     = useState<string[]>(existingProfile?.skills ?? [])
  const [langs, setLangs]       = useState<string[]>(existingProfile?.languages ?? [])
  const [certs, setCerts]       = useState<string[]>(existingProfile?.certifications ?? [])
  const [available, setAvailable] = useState(existingProfile?.available ?? true)
  const [photoUrl, setPhotoUrl] = useState(existingProfile?.photo_url ?? null)

  const [skillInput, setSkillInput] = useState('')
  const [langInput, setLangInput]   = useState('')
  const [certInput, setCertInput]   = useState('')
  const [isLoading, setIsLoading]   = useState(false)

  function addTag(list: string[], setList: (l: string[]) => void, value: string, setValue: (v: string) => void) {
    const v = value.trim()
    if (!v || list.includes(v)) return
    setList([...list, v])
    setValue('')
  }

  function removeTag(list: string[], setList: (l: string[]) => void, i: number) {
    setList(list.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !roleTitle || !location) {
      toast.error('Please fill in all required fields.')
      return
    }
    setIsLoading(true)
    const payload: TalentProfilePayload = {
      id: userId,
      name, role_title: roleTitle, location,
      experience_years: expYears,
      skills, languages: langs, certifications: certs,
      available, photo_url: photoUrl,
    }
    const { error } = await upsertTalentProfile(payload)
    setIsLoading(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Profile saved successfully!')
      onSuccess()
    }
  }

  const inputCls = 'w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
  const labelCls = 'text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5'

  function TagInput({ label, list, input, setInput, setList }: {
    label: string; list: string[]; input: string
    setInput: (v: string) => void; setList: (l: string[]) => void
  }) {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        <div className="flex gap-2 mb-2">
          <input className={inputCls} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(list, setList, input, setInput) } }}
            placeholder={`Add ${label.toLowerCase()} and press Enter`} />
          <button type="button"
            onClick={() => addTag(list, setList, input, setInput)}
            className="flex-shrink-0 px-3 py-2.5 bg-brand-gold/10 text-brand-gold rounded-xl hover:bg-brand-gold/20 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {list.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {list.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border text-[12px] text-foreground">
                {item}
                <button type="button" onClick={() => removeTag(list, setList, i)}
                  className="text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Role */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input className={inputCls} value={name} onChange={e => setName(e.target.value)}
            placeholder="Your full name" required />
        </div>
        <div>
          <label className={labelCls}>Role Title *</label>
          <select className={`${inputCls} cursor-pointer appearance-none`}
            value={roleTitle} onChange={e => setRoleTitle(e.target.value)}>
            <option value="">Select a role…</option>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Location + Experience */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Location *</label>
          <input className={inputCls} value={location} onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Lahore, Pakistan" required />
        </div>
        <div>
          <label className={labelCls}>Years of Experience</label>
          <input className={inputCls} type="number" min={0} max={50}
            value={expYears} onChange={e => setExpYears(Number(e.target.value))} />
        </div>
      </div>

      {/* Skills / Languages / Certs */}
      <TagInput label="Skills" list={skills} input={skillInput} setInput={setSkillInput} setList={setSkills} />
      <TagInput label="Languages" list={langs} input={langInput} setInput={setLangInput} setList={setLangs} />
      <TagInput label="Certifications" list={certs} input={certInput} setInput={setCertInput} setList={setCerts} />

      {/* Availability toggle */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border">
        <button type="button" onClick={() => setAvailable(v => !v)}
          className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${
            available ? 'bg-brand-teal' : 'bg-muted-foreground/30'
          }`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
            available ? 'left-5' : 'left-0.5'
          }`} />
        </button>
        <div>
          <div className="text-sm font-medium text-foreground">{available ? 'Available for placement' : 'Not currently available'}</div>
          <div className="text-[11px] text-muted-foreground">Employers can see your availability status</div>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-gold text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isLoading ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
