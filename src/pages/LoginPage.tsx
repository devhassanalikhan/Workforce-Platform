import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import {
  Globe,
  User,
  Building2,
  ShieldCheck,
  Sparkles,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { type AppRole, ROLE_HOME } from '@/lib/rbac'

// ── Demo persona definitions ───────────────────────────────────────────────────

interface DemoPersona {
  role: AppRole
  label: string
  sublabel: string
  name: string
  destination: string
  icon: React.ElementType
  chipClass: string
  btnClass: string
  badgeClass: string
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: 'applicant',
    label: 'Candidate',
    sublabel: 'My Personal Status Portal',
    name: 'Ali Khan',
    destination: ROLE_HOME['applicant'],
    icon: User,
    chipClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    btnClass: 'border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-400/5',
    badgeClass: 'bg-emerald-400/20 text-emerald-400',
  },
  {
    role: 'employer',
    label: 'Global Employer / OEP',
    sublabel: 'Job Orders & Talent Pipeline',
    name: 'Omar Al-Rashid',
    destination: ROLE_HOME['employer'],
    icon: Building2,
    chipClass: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20',
    btnClass: 'border-brand-gold/30 hover:border-brand-gold/60 hover:bg-brand-gold/5',
    badgeClass: 'bg-brand-gold/20 text-brand-gold',
  },
  {
    role: 'admin',
    label: 'Operations Admin',
    sublabel: 'Talent Pool, Placement & Wasl',
    name: 'M Taha',
    destination: ROLE_HOME['admin'],
    icon: ShieldCheck,
    chipClass: 'text-brand-teal bg-brand-teal/10 border-brand-teal/20',
    btnClass: 'border-brand-teal/30 hover:border-brand-teal/60 hover:bg-brand-teal/5',
    badgeClass: 'bg-brand-teal/20 text-brand-teal',
  },
  {
    role: 'super_admin',
    label: 'Platform Super Admin',
    sublabel: 'Full System Access + Audit Log',
    name: 'Hassan Ali Khan',
    destination: ROLE_HOME['super_admin'],
    icon: Sparkles,
    chipClass: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    btnClass: 'border-violet-500/30 hover:border-violet-400/60 hover:bg-violet-400/5',
    badgeClass: 'bg-violet-400/20 text-violet-400',
  },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  // Already logged in — bounce away
  useEffect(() => {
    if (user) navigate(from === '/login' ? '/' : from, { replace: true })
  }, [user, navigate, from])

  function handleDemoLogin(persona: DemoPersona) {
    signIn(persona.role)
    navigate(persona.destination, { replace: true })
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

          {/* Standard login form — aesthetic only */}
          <div className="p-6 border-b border-border">
            <h2 className="text-base font-semibold text-card-foreground mb-1">Secure Access</h2>
            <p className="text-[12px] text-muted-foreground mb-5">
              Sign in to your WorkforceX account.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  disabled
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  disabled
                  className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none cursor-not-allowed"
                />
              </div>
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/50 border border-border text-[13px] font-medium text-muted-foreground cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                Live auth not enabled in demo
              </button>
            </div>
          </div>

          {/* Demo Quick-Select Panel */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.18em] whitespace-nowrap">
                Demo Quick-Select
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <p className="text-[11px] text-muted-foreground text-center mb-4">
              Select a persona to instantly enter the platform as that role.
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {DEMO_PERSONAS.map(persona => (
                <button
                  key={persona.role}
                  onClick={() => handleDemoLogin(persona)}
                  className={`group flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl bg-card border transition-all duration-200 text-left ${persona.btnClass}`}
                >
                  {/* Icon badge */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${persona.badgeClass}`}>
                    <persona.icon className="w-4 h-4" />
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-card-foreground">
                        {persona.label}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${persona.chipClass}`}>
                        {persona.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {persona.name} · {persona.sublabel}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground/50 text-center mt-5 leading-relaxed">
              Demo session is stored in sessionStorage only.
              <br />Closing the tab resets all access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
