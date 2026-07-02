import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import {
  Globe,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  GraduationCap,
  Users,
  ShieldCheck,
  Bot,
  BookOpen,
  Building2,
  Sparkles,
  FileCheck,
  Plane,
  LogIn,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'
import { ModeToggle } from './ModeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { hasRole } from '@/lib/rbac'

const navLinks = [
  { label: 'Jobs',      href: '/jobs',       icon: Briefcase     },
  { label: 'Talent',    href: '/talent',     icon: Users         },
    { label: 'Skills',    href: '/skills',     icon: GraduationCap },
  { label: 'Placement', href: '/placement',  icon: FileCheck     },
  { label: 'Wasl',      href: '/wasl',       icon: Plane         },
]

const moreLinks = [
  { label: 'Trust & Safety', href: '/about',        icon: ShieldCheck },
  { label: 'AI Assistant',   href: '/ai-assistant', icon: Bot         },
  { label: 'Blog',           href: '/blog',         icon: BookOpen    },
  { label: 'Employers',      href: '/employers',    icon: Building2   },
]

// ── Pipeline strip config ──────────────────────────────────────────────────────

type StripColor = 'teal' | 'gold' | 'violet'

const pipelineStages: { step: number; label: string; sublabel: string; path: string; color: StripColor }[] = [
  { step: 1, label: 'Demand Intelligence', sublabel: 'Workfly',  path: '/jobs',       color: 'teal'   },
  { step: 2, label: 'Identification',      sublabel: 'Workfly',  path: '/talent',     color: 'teal'   },
  { step: 3, label: 'Training',            sublabel: 'Workfly',  path: '/skills',     color: 'teal'   },
  { step: 4, label: 'Human Readiness',     sublabel: 'Workfly',  path: '/skills',     color: 'teal'   },
  { step: 5, label: 'Ethical Placement',   sublabel: 'FF OES',   path: '/placement',  color: 'gold'   },
  { step: 6, label: 'Deployment & Support',sublabel: 'Wasl',     path: '/wasl',       color: 'violet' },
]

const PILLAR_PATHS = ['/jobs', '/talent', '/skills', '/placement', '/wasl']

function getActiveSteps(pathname: string): number[] {
  if (pathname === '/jobs')       return [1]
  if (pathname === '/talent')     return [2]
  if (pathname === '/skills')     return [3, 4]
  if (pathname === '/placement')  return [5]
  if (pathname === '/wasl')       return [6]
  return []
}

const stripActiveClass: Record<StripColor, string> = {
  teal:   'bg-brand-teal/10 text-brand-teal border border-brand-teal/25',
  gold:   'bg-brand-gold/10 text-brand-gold border border-brand-gold/25',
  violet: 'bg-violet-500/10 text-violet-400 dark:text-violet-400 border border-violet-500/25',
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen]     = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const isPillarPage = PILLAR_PATHS.includes(location.pathname)
  const activeSteps  = getActiveSteps(location.pathname)

  // Role-aware nav: Talent/Placement/Wasl only for admin+; Dashboard injected for applicants
  const visibleNavLinks = (() => {
    const filtered = navLinks.filter(link => {
      if (link.href === '/talent' || link.href === '/placement' || link.href === '/wasl') {
        return user !== null && hasRole(user.role, 'admin')
      }
      return true
    })
    if (user?.role === 'applicant') {
      return [
        { label: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ...filtered,
      ]
    }
    return filtered
  })()

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {/* ── Main bar ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Globe className="w-7 h-7 text-brand-gold transition-transform duration-300 group-hover:rotate-12" />
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-foreground tracking-tight leading-tight">
                Workforce<span className="text-brand-gold">X</span>
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] leading-tight">
                Ethical Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {visibleNavLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-brand-gold bg-brand-gold/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                More
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-52 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                    {moreLinks.map(link => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-3 px-4 py-3 text-[13px] font-medium transition-all duration-150 ${
                          isActive(link.href)
                            ? 'text-brand-gold bg-brand-gold/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <ModeToggle />
            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              AI Assistant
            </Link>

            {user ? (
              /* ── Authenticated identity chip ── */
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-[10px] font-bold text-brand-gold tabular-nums flex-shrink-0">
                    {user.avatarInitials}
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[12px] font-semibold text-foreground">{user.fullName}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              /* ── Public sign-in button ── */
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-gold text-navy-950 text-[13px] font-semibold hover:bg-brand-gold-light transition-all duration-200 shadow-glow"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: ModeToggle + Hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            <ModeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Pipeline Journey Strip ── only on pillar pages, admin-only ── */}
      {isPillarPage && user !== null && hasRole(user.role, 'admin') && (
        <div className="border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-[0.15em] mr-2 flex-shrink-0">
              Journey
            </span>
            {pipelineStages.map((stage, i) => {
              const isStepActive = activeSteps.includes(stage.step)
              return (
                <div key={stage.step} className="flex items-center gap-1 flex-shrink-0">
                  {i > 0 && (
                    <span className="text-border text-[10px] mx-0.5 select-none">›</span>
                  )}
                  <Link
                    to={stage.path}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all duration-200 ${
                      isStepActive
                        ? stripActiveClass[stage.color]
                        : 'text-muted-foreground/60 hover:text-muted-foreground'
                    }`}
                  >
                    <span className={`text-[9px] font-bold ${isStepActive ? '' : 'opacity-40'}`}>
                      {String(stage.step).padStart(2, '0')}
                    </span>
                    <span className="hidden sm:inline">{stage.label}</span>
                    <span className="sm:hidden">{stage.label.split(' ')[0]}</span>
                    {stage.sublabel !== 'Workfly' && (
                      <span className={`text-[8px] opacity-60 hidden md:inline`}>· {stage.sublabel}</span>
                    )}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border animate-fade-in-up">
          <div className="px-4 py-4 space-y-1">
            {[...visibleNavLinks, ...moreLinks].map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.href)
                    ? 'text-brand-gold bg-brand-gold/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-[11px] font-bold text-brand-gold tabular-nums">
                      {user.avatarInitials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{user.fullName}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {user.role.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-gold text-navy-950 text-sm font-semibold"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
