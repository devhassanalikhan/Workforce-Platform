// src/components/employers/CompanySettingsDialog.tsx

import { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, Building2, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { BUSINESS_TYPES, COUNTRIES, COUNTRY_CODES } from '@/pages/SignupPage'

interface CompanyDetails {
  id: string
  name: string
  logo_url: string | null
  business_type?: string | null
  registration_number?: string | null
  registration_authority?: string | null
  company_address?: string | null
  country?: string | null
  company_website?: string | null
  contact_person?: string | null
  designation?: string | null
  phone_country_code?: string | null
  phone_number?: string | null
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: CompanyDetails | null
  onSuccess: () => void
}

export default function CompanySettingsDialog({ open, onOpenChange, company, onSuccess }: Props) {
  const { user } = useAuth()
  
  // Form states
  const [name, setName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [regAuthority, setRegAuthority] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [website, setWebsite] = useState('')
  const [contactName, setContactName] = useState('')
  const [designation, setDesignation] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('+92')
  const [phoneNum, setPhoneNum] = useState('')
  
  // Logo upload states
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize values when company changes
  useEffect(() => {
    if (company && open) {
      setName(company.name ?? '')
      setBusinessType(company.business_type ?? '')
      setRegNumber(company.registration_number ?? '')
      setRegAuthority(company.registration_authority ?? '')
      setAddress(company.company_address ?? '')
      setCountry(company.country ?? '')
      setWebsite(company.company_website ?? '')
      setContactName(company.contact_person ?? '')
      setDesignation(company.designation ?? '')
      setPhoneCountry(company.phone_country_code ?? '+92')
      setPhoneNum(company.phone_number ?? '')
      
      setLogoPreview(company.logo_url)
      setLogoFile(null)
      setError(null)
    }
  }, [company, open])

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Logo must be an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be smaller than 2MB.')
      return
    }
    setError(null)
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function clearLogo() {
    setLogoFile(null)
    setLogoPreview(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company || !user) return
    
    setIsSaving(true)
    setError(null)

    try {
      let finalLogoUrl = company.logo_url

      // 1. Upload logo if updated
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        // Use a unique name timestamp to bypass browser caching of old logo URLs
        const path = `${user.id}/logo_${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('company-logos')
          .upload(path, logoFile, { upsert: true })

        if (uploadErr) {
          throw new Error(`Failed to upload logo: ${uploadErr.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(path)
          
        finalLogoUrl = publicUrl
      } else if (logoPreview === null) {
        finalLogoUrl = null // Logo was cleared
      }

      // 2. Update company table in database
      const payload = {
        name: name.trim(),
        business_type: businessType || null,
        registration_number: regNumber.trim() || null,
        registration_authority: regAuthority.trim() || null,
        company_address: address.trim() || null,
        country: country || null,
        company_website: website.trim() || null,
        contact_person: contactName.trim() || null,
        designation: designation.trim() || null,
        phone_country_code: phoneCountry,
        phone_number: phoneNum.trim() || null,
        logo_url: finalLogoUrl,
      }

      const { error: updateErr } = await supabase
        .from('companies')
        .update(payload)
        .eq('id', company.id)

      if (updateErr) {
        throw new Error(updateErr.message)
      }

      toast.success('Company settings saved successfully!')
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message ?? 'An error occurred while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 bg-muted/30 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
  const labelCls = 'text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5'
  const selectCls = 'w-full px-3 py-2 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <Dialog.Title className="text-base font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-gold" />
              Company Profile Settings
            </Dialog.Title>
            <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
              
              {/* Logo Upload Section */}
              <div className="flex items-center gap-4 bg-muted/15 p-4 rounded-xl border border-border">
                <div className="relative w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="text-xs font-semibold text-foreground">Company Logo</div>
                  <div className="text-[10px] text-muted-foreground">Supported format: PNG, JPG (Max 2MB)</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold/10 hover:bg-brand-gold/15 text-brand-gold border border-brand-gold/20 rounded-lg text-xs font-semibold transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Logo
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={clearLogo}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 rounded-lg text-xs font-semibold transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Company Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Company Name *</label>
                  <input
                    className={inputCls}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Acme Construction Ltd."
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>Business Type *</label>
                  <select
                    className={selectCls}
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    required
                  >
                    <option value="">Select Type</option>
                    {BUSINESS_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Registration Number *</label>
                  <input
                    className={inputCls}
                    value={regNumber}
                    onChange={e => setRegNumber(e.target.value)}
                    placeholder="e.g. REG-12345"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>Registration Authority</label>
                  <input
                    className={inputCls}
                    value={regAuthority}
                    onChange={e => setRegAuthority(e.target.value)}
                    placeholder="e.g. SECP, Chamber of Commerce"
                  />
                </div>

                <div>
                  <label className={labelCls}>Country *</label>
                  <select
                    className={selectCls}
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    required
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Website URL</label>
                  <input
                    className={inputCls}
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="e.g. https://acme.com"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Company Address</label>
                <textarea
                  className={`${inputCls} resize-none h-16`}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street details, building, city..."
                />
              </div>

              {/* Contact Person Section */}
              <div className="border-t border-border pt-3 mt-4">
                <div className="text-xs font-semibold text-brand-gold mb-3 uppercase tracking-wider">Contact Person Details</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Contact Person Full Name *</label>
                    <input
                      className={inputCls}
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Designation / Job Title</label>
                    <input
                      className={inputCls}
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      placeholder="e.g. HR Manager"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelCls}>Contact Phone Number *</label>
                    <div className="flex gap-2">
                      <select
                        className={`${selectCls} w-32 flex-shrink-0`}
                        value={phoneCountry}
                        onChange={e => setPhoneCountry(e.target.value)}
                        required
                      >
                        {COUNTRY_CODES.map(item => (
                          <option key={`${item.name}-${item.code}`} value={item.code}>
                            {item.code} ({item.name})
                          </option>
                        ))}
                      </select>
                      <input
                        className={inputCls}
                        value={phoneNum}
                        onChange={e => setPhoneNum(e.target.value)}
                        placeholder="e.g. 3001234567"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px] leading-snug">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-muted/65 hover:bg-muted/90 rounded-xl text-sm font-semibold text-foreground transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:opacity-95 hover:bg-brand-gold-light transition-all shadow-glow disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isSaving ? 'Saving Changes…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
