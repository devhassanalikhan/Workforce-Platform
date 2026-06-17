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
} from 'lucide-react'
import TwistedGrid from '@/components/effects/TwistedGrid'
import InfiniteLogoBand from '@/components/InfiniteLogoBand'
import StatCard from '@/components/StatCard'
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation'

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
  { icon: TrendingUp, label: '98% Success Rate', desc: 'Candidates thrive abroad' },
  { icon: Clock, label: '45-Day Placement', desc: 'From match to deployment' },
  { icon: DollarSign, label: 'Zero Hidden Fees', desc: 'Full cost transparency' },
]

const demandStyles: Record<string, string> = {
  High: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Growing: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Medium: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
}

export default function HomePage() {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation()
  const { ref: destRef, isVisible: destVisible } = useScrollAnimation()
  const { ref: trustRef } = useScrollAnimation()
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation()
  const { ref: badgesRef, isVisible: badgesVisible } = useStaggerAnimation(4, 0.12)

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background: animated grid in dark, clean gradient in light */}
        <div className="hidden dark:block absolute inset-0">
          <TwistedGrid />
          <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        </div>
        <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40" />
        {/* Subtle bottom fade to blend into next section */}
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
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Ethical Charter Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Blockchain Verified</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-card-hover">
                <img
                  src="/images/hero-visual.jpg"
                  alt="Global workforce mobility network"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />

                {/* Floating Stats */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  <div className="flex-1 bg-card/85 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 border border-border dark:border-white/10">
                    <div className="text-lg font-bold text-brand-gold">10K+</div>
                    <div className="text-[10px] text-muted-foreground">Workers Placed</div>
                  </div>
                  <div className="flex-1 bg-card/85 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 border border-border dark:border-white/10">
                    <div className="text-lg font-bold text-brand-teal">98%</div>
                    <div className="text-[10px] text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="flex-1 bg-card/85 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 border border-border dark:border-white/10">
                    <div className="text-lg font-bold text-foreground">25</div>
                    <div className="text-[10px] text-muted-foreground">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo Band ─────────────────────────────────────────── */}
      <InfiniteLogoBand />

      {/* ── Stats ─────────────────────────────────────────────── */}
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
              <StatCard
                key={stat.label}
                {...stat}
                delay={i * 0.1}
                isVisible={statsVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Destinations ─────────────────────────────── */}
      <section className="relative py-20 lg:py-28 bg-muted/30" ref={destRef}>
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
                      <h3 className="text-sm font-semibold text-card-foreground">
                        {dest.country}
                      </h3>
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
                    <span
                      key={sector}
                      className="px-2 py-1 rounded-md bg-muted text-[10px] text-muted-foreground border border-border"
                    >
                      {sector}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Avg. Salary</span>
                    <span className="text-sm font-semibold text-card-foreground">
                      {dest.avgSalary}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {dest.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Safety ────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28" ref={trustRef}>
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
                  transform: badgesVisible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(16px) scale(0.95)',
                  transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`,
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/20 transition-colors">
                  <badge.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-sm font-semibold text-card-foreground mb-1">
                  {badge.label}
                </h3>
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

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28" ref={ctaRef}>
        <div
          className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {/* CTA box is intentionally always dark — high-impact contrast banner */}
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
