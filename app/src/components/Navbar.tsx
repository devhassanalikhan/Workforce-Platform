import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
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
} from 'lucide-react'

const navLinks = [
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Skills', href: '/skills', icon: GraduationCap },
  { label: 'Talent', href: '/talent', icon: Users },
]

const moreLinks = [
  { label: 'Trust & Safety', href: '/about', icon: ShieldCheck },
  { label: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Employers', href: '/employers', icon: Building2 },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()

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
          ? 'bg-navy-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Globe className="w-7 h-7 text-brand-gold transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-slate-100 tracking-tight leading-tight">
                Workforce<span className="text-brand-gold">X</span>
              </span>
              <span className="text-[9px] text-slate-500 uppercase tracking-[0.15em] leading-tight">
                Ethical Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-brand-gold bg-brand-gold/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 text-slate-400 hover:text-slate-200 hover:bg-white/5`}
              >
                More
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-52 bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                    {moreLinks.map(link => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-3 px-4 py-3 text-[13px] font-medium transition-all duration-150 ${
                          isActive(link.href)
                            ? 'text-brand-gold bg-brand-gold/10'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
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
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              AI Assistant
            </Link>
            <Link
              to="/employers"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-gold text-navy-950 text-[13px] font-semibold hover:bg-brand-gold-light transition-all duration-200 shadow-glow"
            >
              <Building2 className="w-4 h-4" />
              Post Jobs
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-950/95 backdrop-blur-xl border-t border-white/5 animate-fade-in-up">
          <div className="px-4 py-4 space-y-1">
            {[...navLinks, ...moreLinks].map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.href)
                    ? 'text-brand-gold bg-brand-gold/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/5">
              <Link
                to="/employers"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-gold text-navy-950 text-sm font-semibold"
              >
                <Building2 className="w-5 h-5" />
                Post Jobs
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}