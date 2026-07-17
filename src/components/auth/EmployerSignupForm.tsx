// src/components/auth/EmployerSignupForm.tsx

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft, Lock, Eye, EyeOff, AlertCircle, Building2,
  Mail, Briefcase, Hash, MapPin, Phone, Link2, UserSquare2, ImagePlus, X, Flag, ChevronDown,
} from 'lucide-react'
import { BUSINESS_TYPES, COUNTRIES, COUNTRY_CODES } from '@/lib/signupConstants'
import { inputClass, inputErrorClass, labelClass, fieldErrorClass } from '@/components/auth/formFieldStyles'

const employerSchema = z
  .object({
    // Company details
    company_name: z.string().trim().min(1, 'Company name is required'),
    business_type: z.enum(BUSINESS_TYPES, {
      error: 'Please select a business type',
    }),
    registration_number: z.string().trim().min(1, 'Registration number is required'),
    registration_authority: z.string().trim().optional(),
    company_address: z.string().trim().optional(),
    country: z.string().trim().min(1, 'Please select a country'),
    company_website: z
      .string()
      .trim()
      .optional()
      .refine(val => !val || /^https?:\/\/.+\..+/.test(val), 'Enter a valid URL (e.g. https://acme.com)'),

    // Contact person
    contact_person: z.string().trim().min(1, "Contact person's full name is required"),
    designation: z.string().trim().optional(),
    phone_country_code: z.string().trim().min(1, 'Required'),
    phone_number: z.string().trim().min(1, 'Phone number is required'),

    // Account
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })
export type EmployerFormValues = z.infer<typeof employerSchema>

interface Props {
  onBack: () => void
  onSubmit: (data: EmployerFormValues) => void | Promise<void>
  onLogoFileChange: (file: File | null) => void
  isSubmitting: boolean
  error: string | null
}

export default function EmployerSignupForm({ onBack, onSubmit, onLogoFileChange, isSubmitting, error }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployerFormValues>({
    resolver: zodResolver(employerSchema),
    defaultValues: {
      company_name: '',
      business_type: undefined,
      registration_number: '',
      registration_authority: '',
      company_address: '',
      country: '',
      company_website: '',
      contact_person: '',
      designation: '',
      phone_country_code: '+92',
      phone_number: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onBlur',
  })

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('Logo must be an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo must be smaller than 2MB.')
      return
    }
    setLogoError(null)
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    onLogoFileChange(file)
  }

  function clearLogo() {
    setLogoFile(null)
    setLogoPreview(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
    onLogoFileChange(null)
  }

  const displayError = logoError ?? error

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>
      <h2 className="text-base font-semibold text-card-foreground mb-1">Employer Sign Up</h2>
      <p className="text-[12px] text-muted-foreground mb-5">
        Create your company account to start hiring.
      </p>

      <style>{`
        .employer-scroll::-webkit-scrollbar { width: 5px; }
        .employer-scroll::-webkit-scrollbar-track { background: transparent; }
        .employer-scroll::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 9999px; }
        .employer-scroll::-webkit-scrollbar-button { display: none; height: 0; width: 0; }
        .employer-scroll { scrollbar-width: thin; }
      `}</style>
      <div className="relative">
        <form onSubmit={handleSubmit(onSubmit)} className="employer-scroll space-y-5 max-h-[65vh] overflow-y-auto pr-3 -mr-3" noValidate>

          {/* Logo upload */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/40 border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Company logo preview" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <label className={labelClass}>Company Logo <span className="normal-case font-normal text-muted-foreground/70">(optional — can add later)</span></label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] text-foreground hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-colors"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  {logoFile ? 'Change' : 'Upload'}
                </button>
                {logoFile && (
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Company details */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">Company Details</p>

            <div>
              <label className={labelClass}>Company Name</label>
              <input
                type="text"
                placeholder="Acme Corp"
                autoComplete="organization"
                className={`${inputClass} ${errors.company_name ? inputErrorClass : ''}`}
                {...register('company_name')}
              />
              {errors.company_name && <p className={fieldErrorClass}>{errors.company_name.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Business Type</label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  defaultValue=""
                  className={`${inputClass} pl-9 pr-9 appearance-none ${errors.business_type ? inputErrorClass : ''}`}
                  {...register('business_type')}
                >
                  <option value="" disabled>Select type</option>
                  {BUSINESS_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.business_type && <p className={fieldErrorClass}>{errors.business_type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Registration No.</label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. 1234567"
                    className={`${inputClass} pl-9 ${errors.registration_number ? inputErrorClass : ''}`}
                    {...register('registration_number')}
                  />
                </div>
                {errors.registration_number && (
                  <p className={fieldErrorClass}>{errors.registration_number.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Registration Authority</label>
                <input
                  type="text"
                  placeholder="e.g. SECP"
                  className={inputClass}
                  {...register('registration_authority')}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Company Address</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Street, city, country"
                  className={`${inputClass} pl-9`}
                  {...register('company_address')}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Country</label>
              <div className="relative">
                <Flag className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  defaultValue=""
                  className={`${inputClass} pl-9 pr-9 appearance-none ${errors.country ? inputErrorClass : ''}`}
                  {...register('country')}
                >
                  <option value="" disabled>Select country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.country && <p className={fieldErrorClass}>{errors.country.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Company Website</label>
              <div className="relative">
                <Link2 className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  placeholder="https://acme.com"
                  className={`${inputClass} pl-9 ${errors.company_website ? inputErrorClass : ''}`}
                  {...register('company_website')}
                />
              </div>
              {errors.company_website && <p className={fieldErrorClass}>{errors.company_website.message}</p>}
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">Contact Person</p>

            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <UserSquare2 className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className={`${inputClass} pl-9 ${errors.contact_person ? inputErrorClass : ''}`}
                  {...register('contact_person')}
                />
              </div>
              {errors.contact_person && <p className={fieldErrorClass}>{errors.contact_person.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Designation</label>
                <input
                  type="text"
                  placeholder="HR Manager"
                  className={inputClass}
                  {...register('designation')}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-shrink-0 w-[78px]">
                    <select
                      className={`${inputClass} w-full pl-2.5 pr-6 appearance-none truncate`}
                      aria-label="Phone country code"
                      {...register('phone_country_code')}
                    >
                      {Array.from(new Set(COUNTRY_CODES.map(c => c.code))).sort((a, b) => a.length - b.length || a.localeCompare(b)).map(code => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="300 1234567"
                      className={`${inputClass} w-full pl-9 ${errors.phone_number ? inputErrorClass : ''}`}
                      {...register('phone_number')}
                    />
                  </div>
                </div>
                {errors.phone_number && <p className={fieldErrorClass}>{errors.phone_number.message}</p>}
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">Account</p>

            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`${inputClass} pl-9 ${errors.email ? inputErrorClass : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className={fieldErrorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`${inputClass} pr-10 ${errors.password ? inputErrorClass : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className={fieldErrorClass}>{errors.password.message}</p>
              ) : (
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-relaxed">
                  At least 8 characters, with one number and one uppercase letter — e.g. Pakistan@2024
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`${inputClass} ${errors.confirm_password ? inputErrorClass : ''}`}
                {...register('confirm_password')}
              />
              {errors.confirm_password && <p className={fieldErrorClass}>{errors.confirm_password.message}</p>}
            </div>
          </div>

          {displayError && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-gold text-black text-[13px] font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            <Lock className="w-3.5 h-3.5" />
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <div className="pointer-events-none absolute bottom-0 left-0 right-3 h-6 bg-gradient-to-t from-card to-transparent" />
      </div>
    </>
  )
}
