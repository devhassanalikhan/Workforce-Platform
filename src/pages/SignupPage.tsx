import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Globe, Lock, Eye, EyeOff, AlertCircle, User, Building2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

type Step = 'choice' | 'applicant' | 'employer' | 'verify'

export default function SignupPage() {
  const { user, signUp, getHomeForRole } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('choice')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [submittedEmail, setSubmittedEmail] = useState('')

  useEffect(() => {
    if (user) navigate(getHomeForRole(user.role), { replace: true })
  }, [user, navigate, getHomeForRole])

  function resetForm() {
    setFullName('')
    setCompanyName('')
    setEmail('')
    setPassword('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent, role: 'applicant' | 'employer') {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: signUpError, needsEmailVerification } = await signUp(email.trim(), password, {
      role,
      full_name: fullName.trim(),
      ...(role === 'employer' ? { company_name: companyName.trim() } : {}),
    })

    setIsSubmitting(false)

    if (signUpError) {
      setError(signUpError)
      return
    }

    if (needsEmailVerification) {
      setSubmittedEmail(email.trim())
      setStep('verify')
    } else {
      navigate(getHomeForRole(role), { replace: true })
    }
  }

  async function handleResend() {
    setResendStatus('sending')
    await supabase.auth.resend({ type: 'signup', email: submittedEmail })
    setResendStatus('sent')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

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

            {/* ── Step: applicant / employer forms ── */}
            {(step === 'applicant' || step === 'employer') && (
              <>
                <button
                  onClick={() => { resetForm(); setStep('choice') }}
                  className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <h2 className="text-base font-semibold text-card-foreground mb-1">
                  {step === 'applicant' ? 'Talent / Applicant Sign Up' : 'Employer Sign Up'}
                </h2>
                <p className="text-[12px] text-muted-foreground mb-5">
                  {step === 'applicant'
                    ? 'Create your account to start browsing verified jobs.'
                    : 'Create your company account to start hiring.'}
                </p>

                <form onSubmit={e => handleSubmit(e, step)} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      autoComplete="name"
                      className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
                    />
                  </div>

                  {step === 'employer' && (
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Acme Corp"
                        required
                        autoComplete="organization"
                        className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full px-3.5 py-2.5 pr-10 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
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
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !fullName || !email || !password || (step === 'employer' && !companyName)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-gold text-black text-[13px] font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Creating account…' : 'Create Account'}
                  </button>
                </form>
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
