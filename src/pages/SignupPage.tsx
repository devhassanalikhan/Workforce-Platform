// src/pages/SignupPage.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Globe, User, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import ApplicantSignupForm, { type ApplicantFormValues } from '@/components/auth/ApplicantSignupForm'
import EmployerSignupForm, { type EmployerFormValues } from '@/components/auth/EmployerSignupForm'
import VerifyEmailStep from '@/components/auth/VerifyEmailStep'

type Step = 'choice' | 'applicant' | 'employer' | 'verify'

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

  // Logo upload lives outside both form schemas — it's a File, not form
  // data, and is uploaded only after signUp() succeeds (see
  // uploadLogoIfPresent). EmployerSignupForm reports the selected file up
  // via onLogoFileChange.
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Server-side error (e.g. "email already registered") — separate from
  // field-level validation errors, which RHF/Zod handle inside each form.
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [submittedEmail, setSubmittedEmail] = useState('')

  useEffect(() => {
    if (user) navigate(getHomeForRole(user.role), { replace: true })
  }, [user, navigate, getHomeForRole])

  function goToStep(next: Step) {
    setError(null)
    setStep(next)
  }

  // Best-effort logo upload — never blocks or fails the signup itself.
  async function uploadLogoIfPresent() {
    if (!logoFile) return
    try {
      const { data: { user: authedUser } } = await supabase.auth.getUser()
      if (!authedUser) return // e.g. email verification pending — upload later from profile
      const ext = logoFile.name.split('.').pop()
      const path = `${authedUser.id}/logo.${ext}`

      // 1. Upload to storage
      const { error: uploadErr } = await supabase.storage.from('company-logos').upload(path, logoFile, { upsert: true })
      if (uploadErr) {
        console.error('Logo upload error:', uploadErr)
        return
      }

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(path)

      // 3. Find company membership
      const { data: memberData, error: memberErr } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('user_id', authedUser.id)
        .maybeSingle()

      if (memberErr) {
        console.error('Error fetching company member row:', memberErr)
        return
      }

      if (memberData?.company_id) {
        // 4. Update the company row
        const { error: updateErr } = await supabase
          .from('companies')
          .update({ logo_url: publicUrl })
          .eq('id', memberData.company_id)
        if (updateErr) {
          console.error('Error updating company logo_url:', updateErr)
        }
      }
    } catch (err) {
      console.error('Silently skipped logo storage association:', err)
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

  async function onSubmitApplicant(data: ApplicantFormValues) {
    await completeSignup('applicant', data.email, data.password, {
      full_name: data.full_name.trim(),
    })
  }

  async function onSubmitEmployer(data: EmployerFormValues) {
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
  }

  async function handleResend() {
    setResendStatus('sending')
    await supabase.auth.resend({ type: 'signup', email: submittedEmail })
    setResendStatus('sent')
  }

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
                    onClick={() => goToStep('applicant')}
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
                    onClick={() => goToStep('employer')}
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
              <ApplicantSignupForm
                onBack={() => goToStep('choice')}
                onSubmit={onSubmitApplicant}
                isSubmitting={isSubmitting}
                error={error}
              />
            )}

            {/* ── Step: employer ── */}
            {step === 'employer' && (
              <EmployerSignupForm
                onBack={() => goToStep('choice')}
                onSubmit={onSubmitEmployer}
                onLogoFileChange={setLogoFile}
                isSubmitting={isSubmitting}
                error={error}
              />
            )}

            {/* ── Step: verify ── */}
            {step === 'verify' && (
              <VerifyEmailStep
                email={submittedEmail}
                resendStatus={resendStatus}
                onResend={handleResend}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
