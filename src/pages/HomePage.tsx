import { useState } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  Users,
  Building2,
  GraduationCap,
  Globe,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Star,
  BarChart3,
  UserCheck,
  Activity,
  FileCheck,
  Plane,
} from 'lucide-react'
import InfiniteLogoBand from '@/components/InfiniteLogoBand'
import StatCard from '@/components/StatCard'
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation'

// ── Static data ────────────────────────────────────────────────────────────────

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Workers Placed',
    description: 'Ethically deployed across 25+ countries with full lifecycle support',
    icon: Users,
  },
  {
    value: 500,
    suffix: '+',
    label: 'Partner Employers',
    description: 'Verified international employers committed to ethical hiring',
    icon: Building2,
  },
  {
    value: 50,
    suffix: 'K+',
    label: 'Candidates Trained',
    description: 'Completed AI-curated skills and language programs',
    icon: GraduationCap,
  },
  {
    value: 25,
    suffix: '',
    label: 'Countries Active',
    description: 'Global network spanning GCC, Europe, Asia-Pacific, and Americas',
    icon: Globe,
  },
]

const destinations = [
  {
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    demand: 'High',
    categories: { Construction: 1200, Hospitality: 640, Healthcare: 1000 },
    avgSalary: '$2,500/mo',
    avgDuration: '38 Days',
    trend: '+18%',
  },
  {
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    demand: 'High',
    categories: { Engineering: 800, Logistics: 650, IT: 500 },
    avgSalary: '$3,200/mo',
    avgDuration: '45 Days',
    trend: '+24%',
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    demand: 'Medium',
    categories: { Healthcare: 600, Manufacturing: 400, Tech: 200 },
    avgSalary: '€3,800/mo',
    avgDuration: '72 Days',
    trend: '+12%',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    demand: 'Medium',
    categories: { Agriculture: 300, Construction: 400, 'Care Work': 190 },
    avgSalary: 'CAD 4,500/mo',
    avgDuration: '60 Days',
    trend: '+9%',
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    demand: 'Growing',
    categories: { Electronics: 200, Automotive: 250, Nursing: 200 },
    avgSalary: '¥380,000/mo',
    avgDuration: '90 Days',
    trend: '+31%',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    demand: 'Medium',
    categories: { Mining: 250, Hospitality: 220, Healthcare: 250 },
    avgSalary: 'AUD 5,800/mo',
    avgDuration: '52 Days',
    trend: '+7%',
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'Ethically Verified', desc: 'Every placement audited' },
  { icon: TrendingUp,  label: '98% Success Rate',  desc: 'Candidates thrive abroad' },
  { icon: Clock,       label: '45-Day Placement',  desc: 'From match to deployment' },
  { icon: DollarSign,  label: 'Zero Hidden Fees',  desc: 'Full cost transparency' },
]

const demandStyles: Record<string, string> = {
  High:    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Growing: 'bg-amber-50  text-amber-700  dark:bg-amber-500/15  dark:text-amber-400',
  Medium:  'bg-blue-50   text-blue-700   dark:bg-blue-500/15   dark:text-blue-400',
}

// ── 6-Stage Pipeline data ──────────────────────────────────────────────────────

type PipelineColor = 'teal' | 'gold' | 'violet'

const pipeline: {
  step: string
  platform: string
  icon: React.ElementType
  title: string
  subtitle: string
  desc: string
  metrics: string[]
  link: string
  linkLabel: string
  color: PipelineColor
}[] = [
  {
    step: '01',
    platform: 'Workfly',
    icon: BarChart3,
    title: 'Demand Intelligence',
    subtitle: 'Jobs-First Ingestion',
    desc: 'Verified international job orders are ingested before any candidate is surfaced. Every match traces back to a live employer demand signal — never a passive listing.',
    metrics: ['2,840+ Active Orders', '25 Countries', 'Real-time Sync'],
    link: '/jobs',
    linkLabel: 'View Job Orders',
    color: 'teal',
  },
  {
    step: '02',
    platform: 'Workfly',
    icon: UserCheck,
    title: 'Identification',
    subtitle: 'Screening & Profiling',
    desc: 'Outreach, AI-assisted screening, and deep candidate profiling mapped directly to active job order demand. Skills, experience, and language scored across 50+ dimensions.',
    metrics: ['12,450+ Profiles', 'AI-Scored', '94% Accuracy'],
    link: '/talent',
    linkLabel: 'Browse Talent Pool',
    color: 'teal',
  },
  {
    step: '03',
    platform: 'Workfly',
    icon: GraduationCap,
    title: 'Demand-Aligned Training',
    subtitle: 'Mapped to Job Orders',
    desc: 'Technical, language, and soft-skills programs curated specifically for the destination role — not generic content. Every course enrollment is linked to an active job order.',
    metrics: ['50K+ Trained', '98% Completion', 'Globally Certified'],
    link: '/skills',
    linkLabel: 'Explore Training',
    color: 'teal',
  },
  {
    step: '04',
    platform: 'Workfly',
    icon: Activity,
    title: 'Human Readiness',
    subtitle: 'Clearance & Wellness',
    desc: 'CEFR language scoring, cultural orientation, financial literacy, health clearance, and psychological readiness — tracked across 5 measurable dimensions before handover.',
    metrics: ['5-Dimension Score', 'CEFR Assessed', 'Pre-departure Kit'],
    link: '/skills',
    linkLabel: 'Readiness Scores',
    color: 'teal',
  },
  {
    step: '05',
    platform: 'FF OES',
    icon: FileCheck,
    title: 'Ethical Placement',
    subtitle: 'Compliance & Handover',
    desc: 'Licensed partner FF OES manages visa processing, document compliance, and full ethical audit sign-off. Zero worker recruitment fees — every cost is employer-paid.',
    metrics: ['100% Compliant', 'Blockchain-Verified', 'Zero Worker Fees'],
    link: '/placement',
    linkLabel: 'Placement Process',
    color: 'gold',
  },
  {
    step: '06',
    platform: 'Wasl',
    icon: Plane,
    title: 'Deployment & Support',
    subtitle: 'Post-Departure Monitoring',
    desc: 'Live deployment tracking, scheduled employer check-ins, grievance resolution queues, and escrow-backed financial protection from day one of the worker\'s contract.',
    metrics: ['847 Active Deployments', 'Escrow Protected', '24/7 Support'],
    link: '/wasl',
    linkLabel: 'Wasl Dashboard',
    color: 'violet',
  },
]

const colorMap: Record<PipelineColor, {
  badge: string; icon: string; iconActive: string; step: string
  border: string; metric: string; dot: string; ring: string
}> = {
  teal: {
    badge:      'bg-brand-teal/15 text-brand-teal border-brand-teal/25',
    icon:       'bg-brand-teal/10 text-brand-teal',
    iconActive: 'bg-brand-teal text-white',
    step:       'text-brand-teal',
    border:     'border-brand-teal/50',
    metric:     'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
    dot:        'bg-brand-teal',
    ring:       'ring-brand-teal/30',
  },
  gold: {
    badge:      'bg-brand-gold/15 text-brand-gold border-brand-gold/25',
    icon:       'bg-brand-gold/10 text-brand-gold',
    iconActive: 'bg-brand-gold text-navy-950',
    step:       'text-brand-gold',
    border:     'border-brand-gold/50',
    metric:     'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
    dot:        'bg-brand-gold',
    ring:       'ring-brand-gold/30',
  },
  violet: {
    badge:      'bg-violet-500/15 text-violet-400 border-violet-500/25',
    icon:       'bg-violet-500/10 text-violet-400',
    iconActive: 'bg-violet-500 text-white',
    step:       'text-violet-400',
    border:     'border-violet-500/50',
    metric:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
    dot:        'bg-violet-500',
    ring:       'ring-violet-500/30',
  },
}

// ── Global Corridors in Motion data ───────────────────────────────────────────

const corridorStageLabels = [
  'Sourcing',
  'Screening',
  'Training',
  'Readiness',
  'Compliance',
  'Deployment',
]

const corridors = [
  {
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    sectors: ['Construction', 'Logistics', 'Healthcare'],
    avgReadiness: 82,
    totalVacancies: 1840,
    totalApplications: 4320,
    stages: [
      { duration: '8 Days',  capacity: 150, active: 132 },
      { duration: '12 Days', capacity: 200, active: 178 },
      { duration: '21 Days', capacity: 180, active: 154 },
      { duration: '14 Days', capacity: 160, active: 143 },
      { duration: '30 Days', capacity: 120, active: 98  },
      { duration: '10 Days', capacity: 100, active: 87  },
    ],
  },
  {
    country: 'Qatar',
    flag: '🇶🇦',
    sectors: ['Hospitality', 'Construction', 'Logistics'],
    avgReadiness: 78,
    totalVacancies: 1120,
    totalApplications: 2890,
    stages: [
      { duration: '7 Days',  capacity: 100, active: 88  },
      { duration: '10 Days', capacity: 140, active: 121 },
      { duration: '18 Days', capacity: 130, active: 112 },
      { duration: '12 Days', capacity: 110, active: 95  },
      { duration: '28 Days', capacity: 90,  active: 74  },
      { duration: '8 Days',  capacity: 80,  active: 68  },
    ],
  },
  {
    country: 'Turkey',
    flag: '🇹🇷',
    sectors: ['Manufacturing', 'Textile', 'IT Services'],
    avgReadiness: 74,
    totalVacancies: 680,
    totalApplications: 1740,
    stages: [
      { duration: '10 Days', capacity: 80,  active: 62  },
      { duration: '14 Days', capacity: 110, active: 89  },
      { duration: '25 Days', capacity: 100, active: 78  },
      { duration: '10 Days', capacity: 90,  active: 71  },
      { duration: '35 Days', capacity: 70,  active: 52  },
      { duration: '12 Days', capacity: 60,  active: 48  },
    ],
  },
  {
    country: 'Oman',
    flag: '🇴🇲',
    sectors: ['Oil & Gas', 'Hospitality', 'Construction'],
    avgReadiness: 80,
    totalVacancies: 520,
    totalApplications: 1280,
    stages: [
      { duration: '9 Days',  capacity: 70,  active: 58  },
      { duration: '11 Days', capacity: 90,  active: 77  },
      { duration: '20 Days', capacity: 85,  active: 69  },
      { duration: '12 Days', capacity: 75,  active: 61  },
      { duration: '28 Days', capacity: 60,  active: 45  },
      { duration: '7 Days',  capacity: 55,  active: 44  },
    ],
  },
  {
    country: 'China',
    flag: '🇨🇳',
    sectors: ['Electronics', 'Manufacturing', 'Logistics'],
    avgReadiness: 71,
    totalVacancies: 940,
    totalApplications: 2150,
    stages: [
      { duration: '12 Days', capacity: 120, active: 91  },
      { duration: '16 Days', capacity: 160, active: 128 },
      { duration: '30 Days', capacity: 150, active: 114 },
      { duration: '15 Days', capacity: 130, active: 102 },
      { duration: '45 Days', capacity: 100, active: 72  },
      { duration: '14 Days', capacity: 90,  active: 68  },
    ],
  },
]

// ── Component ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0)

  const { ref: statsRef,   isVisible: statsVisible   } = useScrollAnimation()
  const { ref: pipeRef,    isVisible: pipeVisible    } = useScrollAnimation()
  const { ref: liveRef,    isVisible: liveVisible    } = useScrollAnimation()
  const { ref: destRef,    isVisible: destVisible    } = useScrollAnimation()
  const { ref: trustRef  } = useScrollAnimation()
  const { ref: ctaRef,     isVisible: ctaVisible     } = useScrollAnimation()
  const { ref: badgesRef,  isVisible: badgesVisible  } = useStaggerAnimation(4, 0.12)

  const active = pipeline[activeStep]
  const activeColors = colorMap[active.color]

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40" />
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[11px] font-medium text-brand-gold uppercase tracking-wider">
                  AI-Powered Ethical Workforce Mobility
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
                Ethical Overseas Employment,{' '}
                <span className="text-gradient">Verified & Secured</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                An end-to-end workforce readiness and international mobility ecosystem. We
                match skilled talent directly with verified global job orders through
                demand-aligned training, transparent compliance, and secure placement.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all duration-300 shadow-glow hover:shadow-lg hover:-translate-y-0.5"
                >
                  Explore Jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/talent"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted/60 transition-all duration-300"
                >
                  <Users className="w-4 h-4" />
                  Join Talent Pool
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                {['Jobs-First Framework', 'Employer-Pays Integrity', 'End-to-End Governance'].map(label => (
                  <div key={label} className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-card-hover">
                <img
                  src="/images/hero-visual.jpg"
                  alt="Global workforce mobility network"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  {[
                    { val: '10K+', label: 'Workers Placed',  color: 'text-brand-gold' },
                    { val: '98%',  label: 'Success Rate',    color: 'text-brand-teal' },
                    { val: '25',   label: 'Countries',       color: 'text-foreground'  },
                  ].map(s => (
                    <div key={s.label} className="flex-1 bg-card/85 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 border border-border dark:border-white/10">
                      <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
                      <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo Band ─────────────────────────────────────────────────────── */}
      <InfiniteLogoBand />

      {/* ── 6-Stage Pipeline ──────────────────────────────────────────────── */}
      <section
        ref={pipeRef}
        className="relative py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 overflow-hidden"
      >
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div
            className="text-center mb-14"
            style={{
              opacity: pipeVisible ? 1 : 0,
              transform: pipeVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease',
            }}
          >
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              End-to-End Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              The Complete{' '}
              <span className="text-gradient">6-Stage Journey</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              From the moment a verified job order lands on Workfly to the day a worker
              thrives abroad on Wasl — every stage is governed, tracked, and ethically audited.
            </p>
          </div>

          {/* Platform legend */}
          <div
            className="flex flex-wrap justify-center gap-4 mb-10"
            style={{
              opacity: pipeVisible ? 1 : 0,
              transition: 'all 0.7s ease 0.1s',
            }}
          >
            {[
              { name: 'Workfly',  desc: 'Identification → Training → Readiness', color: colorMap.teal.badge  },
              { name: 'FF OES',   desc: 'Ethical Placement & Visa',              color: colorMap.gold.badge  },
              { name: 'Wasl',     desc: 'Deployment & Post-departure Support',   color: colorMap.violet.badge },
            ].map(p => (
              <div key={p.name} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium ${p.color}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                <span className="font-semibold">{p.name}</span>
                <span className="opacity-60 hidden sm:inline">— {p.desc}</span>
              </div>
            ))}
          </div>

          {/* Step selector tabs */}
          <div
            className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6"
            style={{
              opacity: pipeVisible ? 1 : 0,
              transform: pipeVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.7s ease 0.15s',
            }}
          >
            {pipeline.map((step, i) => {
              const c = colorMap[step.color]
              const isActive = activeStep === i
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(i)}
                  className={`group relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all duration-300 text-center ${
                    isActive
                      ? `${c.border} bg-white/5 dark:bg-white/5 ring-1 ${c.ring}`
                      : 'border-slate-200 dark:border-white/8 bg-white dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/15'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive ? c.iconActive : c.icon
                  }`}>
                    <step.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold mb-0.5 transition-colors ${isActive ? c.step : 'text-slate-400 dark:text-slate-500'}`}>
                      Step {step.step}
                    </div>
                    <div className={`text-[11px] font-semibold leading-tight transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {step.title}
                    </div>
                  </div>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className={`absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${c.dot}`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Detail panel */}
          <div
            className={`rounded-2xl border bg-white dark:bg-white/[0.03] p-6 lg:p-8 transition-all duration-500 ${activeColors.border}`}
            style={{
              opacity: pipeVisible ? 1 : 0,
              transform: pipeVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s',
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Left: icon + identity */}
              <div className="flex items-start gap-4 lg:w-64 flex-shrink-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${activeColors.iconActive}`}>
                  <active.icon className="w-7 h-7" />
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-2 ${activeColors.badge}`}>
                    {active.platform}
                  </span>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${activeColors.step}`}>
                    Stage {active.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {active.title}
                  </h3>
                  <p className={`text-xs mt-0.5 ${activeColors.step}`}>{active.subtitle}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-slate-200 dark:bg-white/8 self-stretch" />

              {/* Right: description + metrics + CTA */}
              <div className="flex-1">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5">
                  {active.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {active.metrics.map(m => (
                    <span key={m} className={`px-3 py-1 rounded-full text-[11px] font-medium border ${activeColors.metric}`}>
                      {m}
                    </span>
                  ))}
                </div>
                <Link
                  to={active.link}
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${activeColors.step} hover:opacity-80`}
                >
                  {active.linkLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Step navigation arrows */}
              <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => setActiveStep(i => Math.max(0, i - 1))}
                  disabled={activeStep === 0}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => setActiveStep(i => Math.min(pipeline.length - 1, i + 1))}
                  disabled={activeStep === pipeline.length - 1}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-400 dark:text-slate-600 text-center">{activeStep + 1}/{pipeline.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28" ref={statsRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              Platform Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Numbers That <span className="text-gradient">Matter</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every number represents a life changed through ethical workforce mobility.
              Our platform ensures dignity, safety, and prosperity for every worker.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={i * 0.1} isVisible={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Corridors in Motion ────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-muted/30" ref={liveRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
                Global Corridor Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Global Corridors in <span className="text-gradient-teal">Motion</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Macro-level overview of active destination corridors — tracking pipeline
                density, stage velocity, and aggregate demand across target markets.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0 self-start sm:self-auto">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
                5 Active Corridors · 10,100+ Positions
              </span>
            </div>
          </div>

          {/* Column header strip */}
          <div className="hidden lg:flex items-center gap-4 mb-2 px-5">
            {/* Left flank spacer */}
            <div className="w-[220px] flex-shrink-0">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Destination Corridor
              </span>
            </div>
            {/* Stage column labels */}
            <div className="flex-1 grid grid-cols-6 gap-1 min-w-0">
              {corridorStageLabels.map((label, i) => {
                const stageColor = i <= 3 ? 'text-brand-teal' : i === 4 ? 'text-brand-gold' : 'text-violet-400'
                return (
                  <div key={i} className="text-center">
                    <span className={`text-[9px] font-semibold uppercase tracking-widest ${stageColor} opacity-60`}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
            {/* Right flank label */}
            <div className="w-[176px] flex-shrink-0">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Aggregate Demand
              </span>
            </div>
          </div>

          {/* Corridor rows */}
          <div className="space-y-3">
            {corridors.map((corridor, ci) => (
              <div
                key={corridor.country}
                className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 lg:p-5 rounded-2xl bg-card border border-border hover:border-brand-teal/20 transition-all duration-300"
                style={{
                  opacity: liveVisible ? 1 : 0,
                  transform: liveVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `opacity 0.5s ease ${ci * 0.08}s, transform 0.5s ease ${ci * 0.08}s`,
                }}
              >

                {/* ── LEFT FLANK: Flag badge + country identity ── */}
                <div className="flex items-center gap-3 lg:w-[220px] flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 text-[22px] shadow-sm select-none">
                    {corridor.flag}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                      {corridor.country}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug truncate">
                      {corridor.sectors.join(' · ')}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-14 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                        <div
                          className="h-full rounded-full bg-brand-teal transition-all"
                          style={{ width: `${corridor.avgReadiness}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-brand-teal tabular-nums whitespace-nowrap">
                        {corridor.avgReadiness}% Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── CENTER FLANK: 6-Stage capacity & velocity tracker ── */}
                <div className="flex-1 flex items-center min-w-0 overflow-x-auto lg:overflow-visible py-1">
                  <div className="flex items-center w-full min-w-[360px]">
                    {corridor.stages.map((stage, si) => {
                      const utilPct = Math.round((stage.active / stage.capacity) * 100)
                      const isGold   = si === 4
                      const isViolet = si === 5
                      const nodeStyle = isViolet
                        ? { border: 'border-violet-400/70', bg: 'bg-violet-500/10 dark:bg-violet-500/15', text: 'text-violet-500 dark:text-violet-400' }
                        : isGold
                        ? { border: 'border-brand-gold/70', bg: 'bg-brand-gold/10 dark:bg-brand-gold/15', text: 'text-brand-gold' }
                        : utilPct >= 88
                        ? { border: 'border-rose-400/70', bg: 'bg-rose-500/10 dark:bg-rose-500/15', text: 'text-rose-500 dark:text-rose-400' }
                        : utilPct >= 72
                        ? { border: 'border-amber-400/70', bg: 'bg-amber-500/10 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400' }
                        : { border: 'border-brand-teal/60', bg: 'bg-brand-teal/10 dark:bg-brand-teal/15', text: 'text-brand-teal' }
                      const connectorColor = isViolet
                        ? 'bg-violet-400/25'
                        : isGold
                        ? 'bg-brand-gold/25'
                        : 'bg-brand-teal/25'
                      return (
                        <div key={si} className="flex items-center flex-1">
                          {/* Node cluster: [duration] [circle] [capacity] */}
                          <div className="flex flex-col items-center gap-[3px] flex-shrink-0">
                            <span className={`text-[9px] font-semibold tabular-nums whitespace-nowrap leading-none ${nodeStyle.text} opacity-80`}>
                              {stage.duration}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${nodeStyle.border} ${nodeStyle.bg} flex-shrink-0`}>
                              <span className={`text-[10px] font-bold tabular-nums ${nodeStyle.text}`}>
                                {si + 1}
                              </span>
                            </div>
                            <span className="text-[8.5px] font-medium text-muted-foreground tabular-nums whitespace-nowrap leading-none">
                              [{stage.active}/{stage.capacity}]
                            </span>
                          </div>
                          {/* Connector line */}
                          {si < corridor.stages.length - 1 && (
                            <div className={`flex-1 h-[2px] mx-1 rounded-full ${connectorColor}`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ── RIGHT FLANK: Aggregate demand blocks ── */}
                <div className="flex lg:flex-col gap-2 lg:w-[176px] flex-shrink-0">
                  <div className="flex-1 lg:flex-none px-3 py-2.5 rounded-xl bg-brand-teal/[0.07] dark:bg-brand-teal/10 border border-brand-teal/20">
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-tight">
                      {corridor.totalVacancies.toLocaleString()}
                    </div>
                    <div className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mt-0.5">
                      Open Positions
                    </div>
                  </div>
                  <div className="flex-1 lg:flex-none px-3 py-2.5 rounded-xl bg-brand-gold/[0.07] dark:bg-brand-gold/10 border border-brand-gold/20">
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-tight">
                      {corridor.totalApplications.toLocaleString()}
                    </div>
                    <div className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide mt-0.5">
                      Active Processing
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Utilization legend */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {[
              { color: 'bg-brand-teal',  label: 'Healthy Flow  < 72% capacity' },
              { color: 'bg-amber-400',   label: 'High Demand  72–87%' },
              { color: 'bg-rose-400',    label: 'Near Capacity  ≥ 88%' },
              { color: 'bg-brand-gold',  label: 'Compliance Stage' },
              { color: 'bg-violet-400',  label: 'Deployment Stage' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] text-muted-foreground/70">{label}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-[10px] text-muted-foreground/50">
            Pipeline density and velocity indicators reflect aggregated corridor data. Live dashboard available to registered partners.
          </p>
        </div>
      </section>

      {/* ── Trending Destinations ─────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28" ref={destRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
                AI Destination Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Trending <span className="text-gradient-teal">Destinations</span>
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Real-time demand analysis across global markets. Our AI engine
                continuously monitors visa policies, salary trends, and sector demands.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-gold hover:text-brand-gold-light transition-colors"
            >
              View All Destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((dest, i) => {
              const total = Object.values(dest.categories).reduce((sum, n) => sum + n, 0)
              return (
                <div
                  key={dest.country}
                  className="group relative p-5 rounded-2xl bg-card border border-border hover:border-brand-teal/30 hover:shadow-card transition-all duration-500 hover:-translate-y-1"
                  style={{
                    opacity: destVisible ? 1 : 0,
                    transform: destVisible ? 'translateY(0)' : 'translateY(24px)',
                    transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s`,
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dest.flag}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-card-foreground">{dest.country}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            Total Open Positions:{' '}
                            <span className="font-bold text-card-foreground">{total.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${demandStyles[dest.demand] ?? demandStyles.Medium}`}>
                      {dest.demand} Demand
                    </span>
                  </div>

                  {/* Sector breakdown */}
                  <div className="space-y-1.5 mb-4">
                    {Object.entries(dest.categories).map(([sector, count]) => (
                      <div key={sector} className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{sector}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-brand-teal/60"
                              style={{ width: `${Math.round((count / total) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-900 dark:text-slate-100 w-8 text-right tabular-nums">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Avg. Placement Velocity */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-brand-teal/[0.07] dark:bg-brand-teal/10 border border-brand-teal/20 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-brand-teal flex-shrink-0" />
                      <span className="text-[10px] font-medium text-muted-foreground">
                        Avg. Placement Velocity
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {dest.avgDuration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Avg. Salary</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{dest.avgSalary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{dest.trend}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Trust & Safety ────────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28 bg-muted/30" ref={trustRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              Our Commitment
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trust & <span className="text-gradient">Safety</span> First
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe every worker deserves dignity, fair treatment, and protection.
              Our platform is built on ethical principles that guide every placement.
            </p>
          </div>

          <div ref={badgesRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustBadges.map((badge, i) => (
              <div
                key={badge.label}
                className="text-center p-6 rounded-2xl bg-card border border-border hover:border-brand-gold/20 hover:shadow-card transition-all duration-500 group"
                style={{
                  opacity: badgesVisible ? 1 : 0,
                  transform: badgesVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                  transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`,
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/20 transition-colors">
                  <badge.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-sm font-semibold text-card-foreground mb-1">{badge.label}</h3>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-brand-teal-light transition-colors"
            >
              <Star className="w-4 h-4" />
              Read Our Ethical Charter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28" ref={ctaRef}>
        <div
          className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 dark:from-navy-800 dark:via-navy-900 dark:to-navy-950 border border-white/10 p-10 lg:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-radial opacity-40" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Begin Your{' '}
                <span className="text-gradient">Journey?</span>
              </h2>
              <p className="text-slate-300 mb-8">
                Whether you're a skilled worker seeking international opportunities
                or an employer looking for verified talent, our platform connects
                you ethically and efficiently.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/talent"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all duration-300 shadow-glow"
                >
                  <Users className="w-4 h-4" />
                  Register as Talent
                </Link>
                <Link
                  to="/employers"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white/90 rounded-xl text-sm font-medium hover:bg-white/10 transition-all duration-300"
                >
                  <Building2 className="w-4 h-4" />
                  I'm an Employer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
