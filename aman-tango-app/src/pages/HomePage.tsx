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
  CheckCircle2,
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
    sectors: ['Construction', 'Hospitality', 'Healthcare'],
    avgSalary: '$2,500/mo',
    jobs: 2840,
    trend: '+18%',
  },
  {
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    demand: 'High',
    sectors: ['Engineering', 'Logistics', 'IT'],
    avgSalary: '$3,200/mo',
    jobs: 1950,
    trend: '+24%',
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    demand: 'Medium',
    sectors: ['Healthcare', 'Manufacturing', 'Tech'],
    avgSalary: '€3,800/mo',
    jobs: 1200,
    trend: '+12%',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    demand: 'Medium',
    sectors: ['Agriculture', 'Construction', 'Care Work'],
    avgSalary: 'CAD 4,500/mo',
    jobs: 890,
    trend: '+9%',
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    demand: 'Growing',
    sectors: ['Electronics', 'Automotive', 'Nursing'],
    avgSalary: '¥380,000/mo',
    jobs: 650,
    trend: '+31%',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    demand: 'Medium',
    sectors: ['Mining', 'Hospitality', 'Healthcare'],
    avgSalary: 'AUD 5,800/mo',
    jobs: 720,
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

// ── Live pipeline snapshot data ────────────────────────────────────────────────

const liveWorkers = [
  {
    name: 'Rajesh Kumar',
    role: 'Construction Supervisor',
    photo: '/images/talent-1.jpg',
    destination: 'Dubai, UAE',
    flag: '🇦🇪',
    employer: 'Al Rashid Group',
    jobOrder: 'JO-2841',
    currentStage: 2,
    daysInPipeline: 12,
    stageLabel: 'In Training',
    color: 'teal' as PipelineColor,
  },
  {
    name: 'Ming Zhao',
    role: 'Registered Nurse',
    photo: '/images/talent-2.jpg',
    destination: 'Riyadh, KSA',
    flag: '🇸🇦',
    employer: 'Med Staff Pro',
    jobOrder: 'JO-1923',
    currentStage: 4,
    daysInPipeline: 38,
    stageLabel: 'Visa Processing',
    color: 'gold' as PipelineColor,
  },
  {
    name: 'Sofia Martinez',
    role: 'Hotel Operations Manager',
    photo: '/images/talent-4.jpg',
    destination: 'Oslo, Norway',
    flag: '🇳🇴',
    employer: 'Nordic Hospitality',
    jobOrder: 'JO-0891',
    currentStage: 5,
    daysInPipeline: 52,
    stageLabel: 'Deployed',
    color: 'violet' as PipelineColor,
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
                Your Future,{' '}
                <span className="text-gradient">Verified & Protected</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                The world's first AI-governed ethical workforce mobility platform. We match
                skilled talent with verified international employers through transparent,
                AI-curated training and blockchain-secured contracts.
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
                {['GDPR Compliant', 'Ethical Charter Certified', 'Blockchain Verified'].map(label => (
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
        className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden"
      >
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Complete{' '}
              <span className="text-gradient">6-Stage Journey</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
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
                      ? `${c.border} bg-white/5 ring-1 ${c.ring}`
                      : 'border-white/8 bg-white/[0.02] hover:bg-white/5 hover:border-white/15'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive ? c.iconActive : c.icon
                  }`}>
                    <step.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold mb-0.5 transition-colors ${isActive ? c.step : 'text-slate-500'}`}>
                      Step {step.step}
                    </div>
                    <div className={`text-[11px] font-semibold leading-tight transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
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
            className={`rounded-2xl border bg-white/[0.03] p-6 lg:p-8 transition-all duration-500 ${activeColors.border}`}
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
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {active.title}
                  </h3>
                  <p className={`text-xs mt-0.5 ${activeColors.step}`}>{active.subtitle}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-white/8 self-stretch" />

              {/* Right: description + metrics + CTA */}
              <div className="flex-1">
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
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
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <button
                  onClick={() => setActiveStep(i => Math.min(pipeline.length - 1, i + 1))}
                  disabled={activeStep === pipeline.length - 1}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-slate-600 text-center">{activeStep + 1}/{pipeline.length}</span>
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

      {/* ── Live Pipeline Snapshot ────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-muted/30" ref={liveRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
                Live Pipeline
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Workers in <span className="text-gradient-teal">Motion</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                A real-time snapshot of candidates actively progressing through the 6-stage
                pipeline — from identification to live deployment.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0 self-start sm:self-auto">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                847 Active Deployments
              </span>
            </div>
          </div>

          {/* Stage label strip */}
          <div className="hidden lg:grid grid-cols-6 gap-1 mb-2 px-[88px]">
            {pipeline.map((s, i) => (
              <div key={i} className="text-center">
                <span className={`text-[9px] font-semibold uppercase tracking-wider ${colorMap[s.color].step} opacity-70`}>
                  {s.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Worker rows */}
          <div className="space-y-3">
            {liveWorkers.map((worker, wi) => {
              const c = colorMap[worker.color]
              return (
                <div
                  key={worker.name}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 lg:p-5 rounded-2xl bg-card border border-border hover:border-brand-teal/20 transition-all duration-300"
                  style={{
                    opacity: liveVisible ? 1 : 0,
                    transform: liveVisible ? 'translateX(0)' : 'translateX(-16px)',
                    transition: `all 0.5s ease ${wi * 0.1}s`,
                  }}
                >
                  {/* Avatar + info */}
                  <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                    <img
                      src={worker.photo}
                      alt={worker.name}
                      className="w-10 h-10 rounded-xl object-cover object-top flex-shrink-0 border border-border"
                    />
                    <div>
                      <div className="text-sm font-semibold text-card-foreground leading-tight">{worker.name}</div>
                      <div className="text-[11px] text-muted-foreground">{worker.role}</div>
                    </div>
                  </div>

                  {/* Pipeline progress track */}
                  <div className="flex-1 flex items-center gap-1">
                    {pipeline.map((_, si) => {
                      const isDone   = si < worker.currentStage
                      const isActive = si === worker.currentStage
                      const stepC    = colorMap[pipeline[si].color]
                      return (
                        <div key={si} className="flex items-center flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                            isDone
                              ? `${stepC.dot} border-transparent`
                              : isActive
                              ? `bg-transparent ${stepC.border} ring-2 ${stepC.ring}`
                              : 'bg-transparent border-border'
                          }`}>
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : isActive ? (
                              <div className={`w-2.5 h-2.5 rounded-full ${stepC.dot} animate-pulse`} />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-border" />
                            )}
                          </div>
                          {si < pipeline.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-0.5 rounded-full ${si < worker.currentStage ? stepC.dot : 'bg-border'}`} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Stage + meta */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 sm:w-48 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${c.badge}`}>
                      {worker.stageLabel}
                    </span>
                    <div className="text-[11px] text-muted-foreground text-right space-y-0.5">
                      <div className="flex items-center gap-1 justify-end">
                        <span>{worker.flag}</span>
                        <span>{worker.destination}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <MapPin className="w-3 h-3" />
                        <span>{worker.employer} · {worker.jobOrder}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>Day {worker.daysInPipeline} in pipeline</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
            Sample data shown for demonstration. Live dashboard available to registered partners.
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
            {destinations.map((dest, i) => (
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
                          {dest.jobs.toLocaleString()} open positions
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${demandStyles[dest.demand] ?? demandStyles.Medium}`}>
                    {dest.demand} Demand
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {dest.sectors.map(sector => (
                    <span key={sector} className="px-2 py-1 rounded-md bg-muted text-[10px] text-muted-foreground border border-border">
                      {sector}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Avg. Salary</span>
                    <span className="text-sm font-semibold text-card-foreground">{dest.avgSalary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{dest.trend}</span>
                  </div>
                </div>
              </div>
            ))}
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
