import { Link } from 'react-router'
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Sparkles,
  Users,
  BarChart3,
  UserCheck,
  GraduationCap,
  Activity,
  FileCheck,
  Plane,
  CheckCircle2,
} from 'lucide-react'

const highlights = [
  {
    icon: Users,
    label: '12,450+ Verified Profiles',
    desc: 'Pre-screened talent from 42 countries, ready to deploy.',
  },
  {
    icon: ShieldCheck,
    label: 'Ethical Recruitment',
    desc: 'Fair wages, zero exploitation, and transparent placement.',
  },
  {
    icon: Sparkles,
    label: 'AI-Powered Matching',
    desc: '94% placement rate through intelligent skills scoring.',
  },
]

const pipeline = [
  {
    step: '01', platform: 'Workfly', icon: BarChart3, color: 'teal' as const,
    title: 'Demand Intelligence',
    desc: 'Verified job orders ingested first. Every match traces to a live employer demand signal.',
    link: '/jobs',
  },
  {
    step: '02', platform: 'Workfly', icon: UserCheck, color: 'teal' as const,
    title: 'Identification',
    desc: 'AI-assisted screening and deep candidate profiling mapped to active demand.',
    link: '/talent',
  },
  {
    step: '03', platform: 'Workfly', icon: GraduationCap, color: 'teal' as const,
    title: 'Demand-Aligned Training',
    desc: 'Technical and language courses curated specifically for each destination role.',
    link: '/skills',
  },
  {
    step: '04', platform: 'Workfly', icon: Activity, color: 'teal' as const,
    title: 'Human Readiness',
    desc: 'CEFR language scoring, cultural orientation, health clearance across 5 dimensions.',
    link: '/skills',
  },
  {
    step: '05', platform: 'FF OES', icon: FileCheck, color: 'gold' as const,
    title: 'Ethical Placement',
    desc: 'Licensed partner FF OES handles visa processing, compliance audit, and handover.',
    link: '/placement',
  },
  {
    step: '06', platform: 'Wasl', icon: Plane, color: 'violet' as const,
    title: 'Deployment & Support',
    desc: 'Live tracking, check-ins, grievance resolution, and escrow-backed worker protection.',
    link: '/wasl',
  },
]

const colorMap = {
  teal: {
    badge:  'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
    icon:   'bg-brand-teal/10 text-brand-teal',
    step:   'text-brand-teal',
    dot:    'bg-brand-teal',
    hover:  'hover:border-brand-teal/30',
  },
  gold: {
    badge:  'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
    icon:   'bg-brand-gold/10 text-brand-gold',
    step:   'text-brand-gold',
    dot:    'bg-brand-gold',
    hover:  'hover:border-brand-gold/30',
  },
  violet: {
    badge:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
    icon:   'bg-violet-500/10 text-violet-400',
    step:   'text-violet-400',
    dot:    'bg-violet-500',
    hover:  'hover:border-violet-500/30',
  },
}

export default function Home() {
  return (
    <div className="pt-[60px] min-h-screen bg-background transition-colors duration-300">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
            <Globe className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.12em]">
              Ethical Global Mobility
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Connecting{' '}
            <span className="text-gradient">World-Class Talent</span>
            <br />
            with Global Opportunity
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg mb-10">
            WorkforceX is the ethical platform for international workforce mobility —
            AI-scored profiles, verified credentials, and a transparent 6-stage placement journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/talent"
              className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all duration-200 shadow-glow"
            >
              Browse Talent Pool
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-foreground border border-border hover:bg-muted/50 transition-all duration-200"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6-Stage Pipeline Timeline ─────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              End-to-End Ethical Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              How AMAN Moves a Worker{' '}
              <span className="text-gradient">From Origin to Thriving Abroad</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Every candidate follows a governed 6-stage pipeline across three platforms —
              Jobs-first, compliance-verified, and ethically audited at every step.
            </p>
          </div>

          {/* Platform legend */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { name: 'Workfly', desc: 'Stages 1–4', c: colorMap.teal.badge   },
              { name: 'FF OES',  desc: 'Stage 5',    c: colorMap.gold.badge   },
              { name: 'Wasl',    desc: 'Stage 6',    c: colorMap.violet.badge },
            ].map(p => (
              <span key={p.name} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold ${p.c}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {p.name}
                <span className="font-normal opacity-60">{p.desc}</span>
              </span>
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {pipeline.map((item) => {
              const c = colorMap[item.color]
              return (
                <Link
                  key={item.step}
                  to={item.link}
                  className={`group relative flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/8 transition-all duration-300 hover:bg-white/[0.06] ${c.hover}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${c.step}`}>
                      Step {item.step}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${c.badge}`}>
                      {item.platform}
                    </span>
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.icon}`}>
                    <item.icon className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-white mb-1.5 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed flex-1">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className={`w-5 h-0.5 rounded-full ${c.dot} opacity-40`} />
                    <CheckCircle2 className={`w-3 h-3 ${c.step} opacity-50`} />
                  </div>
                  <ArrowRight className={`absolute top-4 right-4 w-3.5 h-3.5 ${c.step} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </Link>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/placement"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-xl text-sm font-medium hover:bg-brand-gold/20 transition-all"
            >
              <FileCheck className="w-4 h-4" />
              Placement Dashboard
            </Link>
            <Link
              to="/wasl"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-xl text-sm font-medium hover:bg-violet-500/20 transition-all"
            >
              <Plane className="w-4 h-4" />
              Wasl Live Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Highlights ────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {highlights.map(item => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border border-border hover:border-brand-gold/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
