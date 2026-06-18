import { Link } from 'react-router'
import { ArrowRight, Globe, ShieldCheck, Sparkles, Users } from 'lucide-react'

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

export default function Home() {
  return (
    <div className="pt-[60px] min-h-screen bg-background transition-colors duration-300">
      {/* Hero */}
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
            AI-scored profiles, verified credentials, and transparent placement processes.
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

      {/* Highlights */}
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
