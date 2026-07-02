import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Globe, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { user, signIn, getHomeForRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate(from === '/login' ? getHomeForRole(user.role) : from, { replace: true })
  }, [user, navigate, from, getHomeForRole])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const { error: signInError } = await signIn(email.trim(), password)
    if (signInError) {
      setError(signInError)
      setIsSubmitting(false)
    }
    // On success, the onAuthStateChange listener updates `user`, which
    // triggers the useEffect above to redirect.
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
            <h2 className="text-base font-semibold text-card-foreground mb-1">Secure Access</h2>
            <p className="text-[12px] text-muted-foreground mb-5">
              Sign in to your WorkforceX account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                    autoComplete="current-password"
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
                disabled={isSubmitting || !email || !password}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-gold text-black text-[13px] font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              >
                <Lock className="w-3.5 h-3.5" />
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-[12px] text-muted-foreground text-center mt-5">
              Don't have an account?{' '}
              <a href="/signup" className="text-brand-gold hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
