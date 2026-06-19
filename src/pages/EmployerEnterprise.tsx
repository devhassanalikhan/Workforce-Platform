import {
  Building2,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2,
  Star,
  Clock,
  Globe,
  Zap,
  BarChart3,
  Search,
  Lock,
  MessageSquare,
  Award,
  Briefcase,
  ChevronRight,
} from 'lucide-react'
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation'

const features = [
  {
    icon: Search,
    title: 'AI Talent Matching',
    description:
      'Our AI engine scores candidates across 50+ dimensions including skills, experience, language, and cultural fit to surface the best matches.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Talent Pool',
    description:
      'Every candidate is pre-verified with background checks, skill assessments, and document authentication before they enter your pipeline.',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description:
      'Get insights into hiring trends, salary benchmarks, and time-to-fill predictions powered by our global workforce data.',
  },
  {
    icon: Lock,
    title: 'Smart Contracts',
    description:
      'Blockchain-secured employment contracts ensure compliance, auto-enforce terms, and create immutable records for audit.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    description:
      'Communicate directly with shortlisted candidates through our secure platform with built-in translation support.',
  },
  {
    icon: Globe,
    title: 'Compliance Engine',
    description:
      'Automated compliance checks for visa requirements, work permits, and labor laws across 25+ jurisdictions.',
  },
]

const testimonials = [
  {
    quote:
      'WorkforceX reduced our time-to-hire by 60%. The AI matching is incredibly accurate - we found skilled technicians that traditional recruitment missed entirely.',
    author: 'Thomas Weber',
    role: 'HR Director, Nexus Tech',
    logo: '/images/logo-nexus.png',
  },
  {
    quote:
      'The verified talent pool and compliance automation saved us countless hours. Every candidate arrived with proper documentation and the right skills.',
    author: 'Fatima Al-Rashid',
    role: 'CEO, Al Rashid Group',
    logo: '/images/logo-alrashid.png',
  },
  {
    quote:
      'We have tried many recruitment platforms, but WorkforceX is the first that truly understands ethical hiring. Their compliance engine is world-class.',
    author: 'Lars Johansson',
    role: 'COO, Nordic Hospitality',
    logo: '/images/logo-nordic.png',
  },
]

const stats = [
  { value: '60%', label: 'Faster Hiring', icon: Clock },
  { value: '94%', label: 'Retention Rate', icon: Users },
  { value: '40%', label: 'Cost Reduction', icon: TrendingUp },
  { value: '100%', label: 'Compliance Rate', icon: ShieldCheck },
]

const plans = [
  {
    name: 'Starter',
    description: 'For small businesses with occasional hiring needs',
    price: '$499',
    period: '/month',
    features: [
      'Up to 5 active job postings',
      'AI talent matching (basic)',
      'Verified candidate access',
      'Email support',
      'Basic analytics dashboard',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing companies with regular recruitment',
    price: '$1,499',
    period: '/month',
    features: [
      'Up to 20 active job postings',
      'Advanced AI matching with scoring',
      'Priority candidate access',
      'Smart contract employment',
      'Compliance automation',
      'Dedicated account manager',
      'Full analytics suite',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with high-volume hiring',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited job postings',
      'Custom AI model training',
      'White-label options',
      'API access',
      'Multi-country compliance',
      'Executive reporting',
      '24/7 priority support',
      'On-site training',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function EmployerEnterprise() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()
  const { ref: featuresRef, isVisible: featuresVisible } = useStaggerAnimation(6, 0.08)
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation()
  const { ref: pricingRef, isVisible: pricingVisible } = useScrollAnimation()

  return (
    <div className="pt-[60px] min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-muted/40 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              ref={headerRef}
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s ease',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-[11px] font-medium text-brand-gold uppercase tracking-wider">
                  For Employers
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Hire Verified Global{' '}
                <span className="text-gradient">Talent</span> Ethically
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-xl">
                Access a pool of 50,000+ AI-scored, pre-verified candidates from
                42 countries. Our ethical recruitment platform ensures compliance,
                reduces hiring time, and builds long-term workforce partnerships.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all shadow-glow">
                  <Sparkles className="w-4 h-4" />
                  Post a Job - Free
                </button>
                <button className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted/50 transition-all">
                  <Briefcase className="w-4 h-4" />
                  Request Demo
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="p-5 rounded-2xl bg-card border border-border animate-float">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-card-foreground">
                          New Applicant
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          AI Match: 96%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Senior Construction Supervisor from India with 8 years GCC
                      experience
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-card-foreground">
                        Hiring Pipeline
                      </span>
                      <span className="text-[10px] text-brand-gold">Active</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Sourced', count: 142, color: 'bg-brand-gold' },
                        { label: 'Screened', count: 89, color: 'bg-brand-teal' },
                        { label: 'Interview', count: 34, color: 'bg-blue-500' },
                        { label: 'Hired', count: 12, color: 'bg-emerald-500' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground w-16">
                            {item.label}
                          </span>
                          <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${(item.count / 142) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground w-6 text-right">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-card-foreground">
                        Compliance Score
                      </span>
                      <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
                        100%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden mb-2">
                      <div className="h-full w-full bg-emerald-500 rounded-full" />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      All 24 candidates fully compliant
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-card border border-brand-gold/20 animate-float">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs font-medium text-brand-gold">
                        AI Insight
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Candidate pool trending +23% for healthcare roles in GCC.
                      Recommend increasing nursing job postings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-b border-border" ref={statsRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built for Modern{' '}
              <span className="text-gradient-teal">Recruitment</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to hire ethical, verified international talent - from
              AI matching to compliance automation.
            </p>
          </div>

          <div
            ref={featuresRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card border border-border hover:border-brand-gold/20 transition-all duration-500 group"
                style={{
                  opacity: featuresVisible ? 1 : 0,
                  transform: featuresVisible
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.07}s`,
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-4 group-hover:bg-brand-gold/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="text-base font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              Employer Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by Industry{' '}
              <span className="text-gradient">Leaders</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.author}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-brand-gold text-brand-gold"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={t.logo}
                      alt={t.role}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-card-foreground">
                      {t.author}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 lg:py-28" ref={pricingRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, <span className="text-gradient-teal">Transparent</span>{' '}
              Pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No hidden fees. No placement commissions from workers. You only pay
              for the platform features you use.
            </p>
          </div>

          <div
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            style={{
              opacity: pricingVisible ? 1 : 0,
              transform: pricingVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.7s ease',
            }}
          >
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? 'bg-card border-brand-gold/30 shadow-glow'
                    : 'bg-card/50 border-border hover:border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-brand-gold text-navy-950 text-[10px] font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-brand-gold text-navy-950 hover:bg-brand-gold-light'
                      : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — intentionally always dark */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 border border-white/5 p-10 lg:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-radial opacity-50" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Award className="w-12 h-12 text-brand-gold mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Transform Your Hiring?
              </h2>
              <p className="text-slate-400 mb-8">
                Join 500+ ethical employers who trust WorkforceX to build their
                global teams. Start with a free job posting today.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all shadow-glow">
                  <Sparkles className="w-4 h-4" />
                  Post Your First Job
                </button>
                <button className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-slate-200 rounded-xl text-sm font-medium hover:bg-white/5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
