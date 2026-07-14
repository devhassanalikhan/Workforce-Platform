// src/pages/SignupPage.tsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Globe, Lock, Eye, EyeOff, AlertCircle, User, Building2, ArrowLeft,
  Mail, CheckCircle2, Briefcase, Hash, MapPin, Phone, Link2,
  UserSquare2, ImagePlus, X, Flag, ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

type Step = 'choice' | 'applicant' | 'employer' | 'verify'

const BUSINESS_TYPES = [
  'Direct Employer',
  'Recruitment Agency',
  'Manpower Export Company',
  'Staffing / Outsourcing Firm',
  'Other',
] as const

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana',
  'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon',
  'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
  'Congo (DRC)', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark',
  'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
  'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
]

// name + dialing code, used for the phone-number country-code select
const COUNTRY_CODES: { name: string; code: string }[] = [
  { name: 'Afghanistan', code: '+93' }, { name: 'Albania', code: '+355' },
  { name: 'Algeria', code: '+213' }, { name: 'Andorra', code: '+376' },
  { name: 'Angola', code: '+244' }, { name: 'Antigua and Barbuda', code: '+1268' },
  { name: 'Argentina', code: '+54' }, { name: 'Armenia', code: '+374' },
  { name: 'Australia', code: '+61' }, { name: 'Austria', code: '+43' },
  { name: 'Azerbaijan', code: '+994' }, { name: 'Bahamas', code: '+1242' },
  { name: 'Bahrain', code: '+973' }, { name: 'Bangladesh', code: '+880' },
  { name: 'Barbados', code: '+1246' }, { name: 'Belarus', code: '+375' },
  { name: 'Belgium', code: '+32' }, { name: 'Belize', code: '+501' },
  { name: 'Benin', code: '+229' }, { name: 'Bhutan', code: '+975' },
  { name: 'Bolivia', code: '+591' }, { name: 'Bosnia and Herzegovina', code: '+387' },
  { name: 'Botswana', code: '+267' }, { name: 'Brazil', code: '+55' },
  { name: 'Brunei', code: '+673' }, { name: 'Bulgaria', code: '+359' },
  { name: 'Burkina Faso', code: '+226' }, { name: 'Burundi', code: '+257' },
  { name: 'Cabo Verde', code: '+238' }, { name: 'Cambodia', code: '+855' },
  { name: 'Cameroon', code: '+237' }, { name: 'Canada', code: '+1' },
  { name: 'Central African Republic', code: '+236' }, { name: 'Chad', code: '+235' },
  { name: 'Chile', code: '+56' }, { name: 'China', code: '+86' },
  { name: 'Colombia', code: '+57' }, { name: 'Comoros', code: '+269' },
  { name: 'Congo', code: '+242' }, { name: 'Congo (DRC)', code: '+243' },
  { name: 'Costa Rica', code: '+506' }, { name: "Cote d'Ivoire", code: '+225' },
  { name: 'Croatia', code: '+385' }, { name: 'Cuba', code: '+53' },
  { name: 'Cyprus', code: '+357' }, { name: 'Czechia', code: '+420' },
  { name: 'Denmark', code: '+45' }, { name: 'Djibouti', code: '+253' },
  { name: 'Dominica', code: '+1767' }, { name: 'Dominican Republic', code: '+1809' },
  { name: 'Ecuador', code: '+593' }, { name: 'Egypt', code: '+20' },
  { name: 'El Salvador', code: '+503' }, { name: 'Equatorial Guinea', code: '+240' },
  { name: 'Eritrea', code: '+291' }, { name: 'Estonia', code: '+372' },
  { name: 'Eswatini', code: '+268' }, { name: 'Ethiopia', code: '+251' },
  { name: 'Fiji', code: '+679' }, { name: 'Finland', code: '+358' },
  { name: 'France', code: '+33' }, { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' }, { name: 'Georgia', code: '+995' },
  { name: 'Germany', code: '+49' }, { name: 'Ghana', code: '+233' },
  { name: 'Greece', code: '+30' }, { name: 'Grenada', code: '+1473' },
  { name: 'Guatemala', code: '+502' }, { name: 'Guinea', code: '+224' },
  { name: 'Guinea-Bissau', code: '+245' }, { name: 'Guyana', code: '+592' },
  { name: 'Haiti', code: '+509' }, { name: 'Honduras', code: '+504' },
  { name: 'Hungary', code: '+36' }, { name: 'Iceland', code: '+354' },
  { name: 'India', code: '+91' }, { name: 'Indonesia', code: '+62' },
  { name: 'Iran', code: '+98' }, { name: 'Iraq', code: '+964' },
  { name: 'Ireland', code: '+353' }, { name: 'Israel', code: '+972' },
  { name: 'Italy', code: '+39' }, { name: 'Jamaica', code: '+1876' },
  { name: 'Japan', code: '+81' }, { name: 'Jordan', code: '+962' },
  { name: 'Kazakhstan', code: '+7' }, { name: 'Kenya', code: '+254' },
  { name: 'Kiribati', code: '+686' }, { name: 'Kosovo', code: '+383' },
  { name: 'Kuwait', code: '+965' }, { name: 'Kyrgyzstan', code: '+996' },
  { name: 'Laos', code: '+856' }, { name: 'Latvia', code: '+371' },
  { name: 'Lebanon', code: '+961' }, { name: 'Lesotho', code: '+266' },
  { name: 'Liberia', code: '+231' }, { name: 'Libya', code: '+218' },
  { name: 'Liechtenstein', code: '+423' }, { name: 'Lithuania', code: '+370' },
  { name: 'Luxembourg', code: '+352' }, { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' }, { name: 'Malaysia', code: '+60' },
  { name: 'Maldives', code: '+960' }, { name: 'Mali', code: '+223' },
  { name: 'Malta', code: '+356' }, { name: 'Marshall Islands', code: '+692' },
  { name: 'Mauritania', code: '+222' }, { name: 'Mauritius', code: '+230' },
  { name: 'Mexico', code: '+52' }, { name: 'Micronesia', code: '+691' },
  { name: 'Moldova', code: '+373' }, { name: 'Monaco', code: '+377' },
  { name: 'Mongolia', code: '+976' }, { name: 'Montenegro', code: '+382' },
  { name: 'Morocco', code: '+212' }, { name: 'Mozambique', code: '+258' },
  { name: 'Myanmar', code: '+95' }, { name: 'Namibia', code: '+264' },
  { name: 'Nauru', code: '+674' }, { name: 'Nepal', code: '+977' },
  { name: 'Netherlands', code: '+31' }, { name: 'New Zealand', code: '+64' },
  { name: 'Nicaragua', code: '+505' }, { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' }, { name: 'North Korea', code: '+850' },
  { name: 'North Macedonia', code: '+389' }, { name: 'Norway', code: '+47' },
  { name: 'Oman', code: '+968' }, { name: 'Pakistan', code: '+92' },
  { name: 'Palau', code: '+680' }, { name: 'Palestine', code: '+970' },
  { name: 'Panama', code: '+507' }, { name: 'Papua New Guinea', code: '+675' },
  { name: 'Paraguay', code: '+595' }, { name: 'Peru', code: '+51' },
  { name: 'Philippines', code: '+63' }, { name: 'Poland', code: '+48' },
  { name: 'Portugal', code: '+351' }, { name: 'Qatar', code: '+974' },
  { name: 'Romania', code: '+40' }, { name: 'Russia', code: '+7' },
  { name: 'Rwanda', code: '+250' }, { name: 'Saint Kitts and Nevis', code: '+1869' },
  { name: 'Saint Lucia', code: '+1758' }, { name: 'Saint Vincent and the Grenadines', code: '+1784' },
  { name: 'Samoa', code: '+685' }, { name: 'San Marino', code: '+378' },
  { name: 'Sao Tome and Principe', code: '+239' }, { name: 'Saudi Arabia', code: '+966' },
  { name: 'Senegal', code: '+221' }, { name: 'Serbia', code: '+381' },
  { name: 'Seychelles', code: '+248' }, { name: 'Sierra Leone', code: '+232' },
  { name: 'Singapore', code: '+65' }, { name: 'Slovakia', code: '+421' },
  { name: 'Slovenia', code: '+386' }, { name: 'Solomon Islands', code: '+677' },
  { name: 'Somalia', code: '+252' }, { name: 'South Africa', code: '+27' },
  { name: 'South Korea', code: '+82' }, { name: 'South Sudan', code: '+211' },
  { name: 'Spain', code: '+34' }, { name: 'Sri Lanka', code: '+94' },
  { name: 'Sudan', code: '+249' }, { name: 'Suriname', code: '+597' },
  { name: 'Sweden', code: '+46' }, { name: 'Switzerland', code: '+41' },
  { name: 'Syria', code: '+963' }, { name: 'Taiwan', code: '+886' },
  { name: 'Tajikistan', code: '+992' }, { name: 'Tanzania', code: '+255' },
  { name: 'Thailand', code: '+66' }, { name: 'Timor-Leste', code: '+670' },
  { name: 'Togo', code: '+228' }, { name: 'Tonga', code: '+676' },
  { name: 'Trinidad and Tobago', code: '+1868' }, { name: 'Tunisia', code: '+216' },
  { name: 'Turkey', code: '+90' }, { name: 'Turkmenistan', code: '+993' },
  { name: 'Tuvalu', code: '+688' }, { name: 'Uganda', code: '+256' },
  { name: 'Ukraine', code: '+380' }, { name: 'United Arab Emirates', code: '+971' },
  { name: 'United Kingdom', code: '+44' }, { name: 'United States', code: '+1' },
  { name: 'Uruguay', code: '+598' }, { name: 'Uzbekistan', code: '+998' },
  { name: 'Vanuatu', code: '+678' }, { name: 'Vatican City', code: '+379' },
  { name: 'Venezuela', code: '+58' }, { name: 'Vietnam', code: '+84' },
  { name: 'Yemen', code: '+967' }, { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' },
]

// ─────────────────────────────────────────────────────────────────────────
// Zod schemas
// ─────────────────────────────────────────────────────────────────────────

const applicantSchema = z.object({
  full_name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type ApplicantFormValues = z.infer<typeof applicantSchema>

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
type EmployerFormValues = z.infer<typeof employerSchema>

export default function SignupPage() {
  const { user, signUp, getHomeForRole } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Support ?as=employer / ?as=applicant to jump straight into the right
  // form (used by "Post a Job Now" on the public marketing page) instead of
  // always landing on the choice screen.
  const preselect = searchParams.get('as')
  const initialStep: Step = preselect === 'employer' || preselect === 'applicant' ? preselect : 'choice'

  const [step, setStep] = useState<Step>(initialStep)
  const [showPassword, setShowPassword] = useState(false)

  // Logo upload lives outside the form schema — it's a File, not form data,
  // and never blocks submission.
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Server-side error (e.g. "email already registered") — separate from
  // field-level validation errors, which RHF/Zod handle.
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [submittedEmail, setSubmittedEmail] = useState('')

  const applicantForm = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    defaultValues: { full_name: '', email: '', password: '' },
    mode: 'onBlur',
  })

  const employerForm = useForm<EmployerFormValues>({
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

  useEffect(() => {
    if (user) navigate(getHomeForRole(user.role), { replace: true })
  }, [user, navigate, getHomeForRole])

  function resetForm() {
    applicantForm.reset()
    employerForm.reset()
    setLogoFile(null)
    setLogoPreview(null)
    setError(null)
  }

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

  // Best-effort logo upload — never blocks or fails the signup itself.
  async function uploadLogoIfPresent() {
    if (!logoFile) return
    try {
      const { data: { user: authedUser } } = await supabase.auth.getUser()
      if (!authedUser) return // e.g. email verification pending — upload later from profile
      const ext = logoFile.name.split('.').pop()
      const path = `${authedUser.id}/logo.${ext}`
      await supabase.storage.from('company-logos').upload(path, logoFile, { upsert: true })
    } catch {
      // Silently skip — the employer can always add a logo from their profile settings later.
    }
  }

  async function completeSignup(
    role: 'applicant' | 'employer',
    email: string,
    password: string,
    metadata: Record<string, unknown>,
  ) {
    setError(null)
    setIsSubmitting(true)

    const { error: signUpError, needsEmailVerification } = await signUp(email.trim(), password, {
      role,
      ...metadata,
    })

    if (signUpError) {
      setIsSubmitting(false)
      setError(signUpError)
      return
    }

    if (role === 'employer') {
      await uploadLogoIfPresent()
    }

    setIsSubmitting(false)

    if (needsEmailVerification) {
      setSubmittedEmail(email.trim())
      setStep('verify')
    } else {
      navigate(getHomeForRole(role), { replace: true })
    }
  }

  const onSubmitApplicant = applicantForm.handleSubmit(async data => {
    await completeSignup('applicant', data.email, data.password, {
      full_name: data.full_name.trim(),
    })
  })

  const onSubmitEmployer = employerForm.handleSubmit(async data => {
    await completeSignup('employer', data.email, data.password, {
      full_name: data.contact_person.trim(),
      company_name: data.company_name.trim(),
      business_type: data.business_type,
      registration_number: data.registration_number.trim(),
      registration_authority: (data.registration_authority ?? '').trim(),
      company_address: (data.company_address ?? '').trim(),
      country: data.country,
      contact_person: data.contact_person.trim(),
      designation: (data.designation ?? '').trim(),
      phone_country_code: data.phone_country_code,
      phone_number: data.phone_number.trim(),
      company_website: (data.company_website ?? '').trim(),
    })
  })

  async function handleResend() {
    setResendStatus('sending')
    await supabase.auth.resend({ type: 'signup', email: submittedEmail })
    setResendStatus('sent')
  }

  const inputClass =
    'w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
  const inputErrorClass = 'border-destructive/50 focus:ring-destructive/40 focus:border-destructive/50'
  const labelClass = 'text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5'
  const fieldErrorClass = 'text-[11px] text-destructive mt-1'

  const {
    register: registerApplicant,
    formState: { errors: applicantErrors },
  } = applicantForm

  const {
    register: registerEmployer,
    formState: { errors: employerErrors },
  } = employerForm

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className={`w-full ${step === 'employer' ? 'max-w-xl' : 'max-w-md'}`}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-brand-gold" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Workforce<span className="text-brand-gold">X</span>
          </h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.18em] mt-1">
            Ethical Mobility Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6">

            {/* ── Step: choice ── */}
            {step === 'choice' && (
              <>
                <h2 className="text-base font-semibold text-card-foreground mb-1">Create Your Account</h2>
                <p className="text-[12px] text-muted-foreground mb-5">
                  Choose how you'll use WorkforceX.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => { resetForm(); setStep('applicant') }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-brand-teal" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-card-foreground">Sign up as Talent / Applicant</div>
                      <div className="text-[11px] text-muted-foreground">Find verified international job opportunities</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { resetForm(); setStep('employer') }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-card-foreground">Sign up as an Employer</div>
                      <div className="text-[11px] text-muted-foreground">Hire verified, ethically-recruited talent</div>
                    </div>
                  </button>
                </div>
                <p className="text-[12px] text-muted-foreground text-center mt-5">
                  Already have an account?{' '}
                  <a href="/login" className="text-brand-gold hover:underline">Sign in</a>
                </p>
              </>
            )}

            {/* ── Step: applicant ── */}
            {step === 'applicant' && (
              <>
                <button
                  onClick={() => { resetForm(); setStep('choice') }}
                  className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <h2 className="text-base font-semibold text-card-foreground mb-1">Talent / Applicant Sign Up</h2>
                <p className="text-[12px] text-muted-foreground mb-5">
                  Create your account to start browsing verified jobs.
                </p>

                <form onSubmit={onSubmitApplicant} className="space-y-3" noValidate>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      className={`${inputClass} ${applicantErrors.full_name ? inputErrorClass : ''}`}
                      {...registerApplicant('full_name')}
                    />
                    {applicantErrors.full_name && (
                      <p className={fieldErrorClass}>{applicantErrors.full_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`${inputClass} ${applicantErrors.email ? inputErrorClass : ''}`}
                      {...registerApplicant('email')}
                    />
                    {applicantErrors.email && (
                      <p className={fieldErrorClass}>{applicantErrors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={`${inputClass} pr-10 ${applicantErrors.password ? inputErrorClass : ''}`}
                        {...registerApplicant('password')}
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
                    {applicantErrors.password && (
                      <p className={fieldErrorClass}>{applicantErrors.password.message}</p>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
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
              </>
            )}

            {/* ── Step: employer ── */}
            {step === 'employer' && (
              <>
                <button
                  onClick={() => { resetForm(); setStep('choice') }}
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
                  <form onSubmit={onSubmitEmployer} className="employer-scroll space-y-5 max-h-[65vh] overflow-y-auto pr-3 -mr-3" noValidate>

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
                        className={`${inputClass} ${employerErrors.company_name ? inputErrorClass : ''}`}
                        {...registerEmployer('company_name')}
                      />
                      {employerErrors.company_name && (
                        <p className={fieldErrorClass}>{employerErrors.company_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Business Type</label>
                      <div className="relative">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          defaultValue=""
                          className={`${inputClass} pl-9 pr-9 appearance-none ${employerErrors.business_type ? inputErrorClass : ''}`}
                          {...registerEmployer('business_type')}
                        >
                          <option value="" disabled>Select type</option>
                          {BUSINESS_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {employerErrors.business_type && (
                        <p className={fieldErrorClass}>{employerErrors.business_type.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Registration No.</label>
                        <div className="relative">
                          <Hash className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="e.g. 1234567"
                            className={`${inputClass} pl-9 ${employerErrors.registration_number ? inputErrorClass : ''}`}
                            {...registerEmployer('registration_number')}
                          />
                        </div>
                        {employerErrors.registration_number && (
                          <p className={fieldErrorClass}>{employerErrors.registration_number.message}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>Registration Authority</label>
                        <input
                          type="text"
                          placeholder="e.g. SECP"
                          className={inputClass}
                          {...registerEmployer('registration_authority')}
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
                          {...registerEmployer('company_address')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Country</label>
                      <div className="relative">
                        <Flag className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          defaultValue=""
                          className={`${inputClass} pl-9 pr-9 appearance-none ${employerErrors.country ? inputErrorClass : ''}`}
                          {...registerEmployer('country')}
                        >
                          <option value="" disabled>Select country</option>
                          {COUNTRIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {employerErrors.country && (
                        <p className={fieldErrorClass}>{employerErrors.country.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Company Website</label>
                      <div className="relative">
                        <Link2 className="w-3.5 h-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="url"
                          placeholder="https://acme.com"
                          className={`${inputClass} pl-9 ${employerErrors.company_website ? inputErrorClass : ''}`}
                          {...registerEmployer('company_website')}
                        />
                      </div>
                      {employerErrors.company_website && (
                        <p className={fieldErrorClass}>{employerErrors.company_website.message}</p>
                      )}
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
                          className={`${inputClass} pl-9 ${employerErrors.contact_person ? inputErrorClass : ''}`}
                          {...registerEmployer('contact_person')}
                        />
                      </div>
                      {employerErrors.contact_person && (
                        <p className={fieldErrorClass}>{employerErrors.contact_person.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Designation</label>
                        <input
                          type="text"
                          placeholder="HR Manager"
                          className={inputClass}
                          {...registerEmployer('designation')}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number</label>
                        <div className="flex gap-2">
                          <div className="relative flex-shrink-0 w-[78px]">
                            <select
                              className={`${inputClass} w-full pl-2.5 pr-6 appearance-none truncate`}
                              aria-label="Phone country code"
                              {...registerEmployer('phone_country_code')}
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
                              className={`${inputClass} w-full pl-9 ${employerErrors.phone_number ? inputErrorClass : ''}`}
                              {...registerEmployer('phone_number')}
                            />
                          </div>
                        </div>
                        {employerErrors.phone_number && (
                          <p className={fieldErrorClass}>{employerErrors.phone_number.message}</p>
                        )}
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
                          className={`${inputClass} pl-9 ${employerErrors.email ? inputErrorClass : ''}`}
                          {...registerEmployer('email')}
                        />
                      </div>
                      {employerErrors.email && (
                        <p className={fieldErrorClass}>{employerErrors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className={`${inputClass} pr-10 ${employerErrors.password ? inputErrorClass : ''}`}
                          {...registerEmployer('password')}
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
                      {employerErrors.password ? (
                        <p className={fieldErrorClass}>{employerErrors.password.message}</p>
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
                        className={`${inputClass} ${employerErrors.confirm_password ? inputErrorClass : ''}`}
                        {...registerEmployer('confirm_password')}
                      />
                      {employerErrors.confirm_password && (
                        <p className={fieldErrorClass}>{employerErrors.confirm_password.message}</p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
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
            )}

            {/* ── Step: verify ── */}
            {step === 'verify' && (
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-brand-teal" />
                </div>
                <h2 className="text-base font-semibold text-card-foreground mb-1.5">Check Your Inbox</h2>
                <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">
                  We sent a verification link to <span className="text-foreground font-medium">{submittedEmail}</span>.
                  Click the link to activate your account, then sign in.
                </p>
                <button
                  onClick={handleResend}
                  disabled={resendStatus !== 'idle'}
                  className="text-[12px] text-brand-gold hover:underline disabled:opacity-60 disabled:no-underline"
                >
                  {resendStatus === 'idle' && 'Resend verification email'}
                  {resendStatus === 'sending' && 'Sending…'}
                  {resendStatus === 'sent' && (
                    <span className="inline-flex items-center gap-1 text-brand-teal">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Email sent
                    </span>
                  )}
                </button>
                <div className="mt-5 pt-5 border-t border-border">
                  <a href="/login" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
                    Back to Sign In
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
