import {
  ShieldCheck,
  Heart,
  Lock,
  Eye,
  Scale,
  Users,
  Globe,
  Award,
  CheckCircle2,
  FileText,
  Fingerprint,
  Handshake,
  Star,
  Quote,
} from 'lucide-react'
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation'

const ethicalPillars = [
  {
    icon: Heart,
    title: 'Human Dignity',
    description:
      'Every worker is treated with respect and dignity. We reject exploitative practices and ensure fair compensation, safe working conditions, and humane treatment across all placements.',
    color: 'brand-gold',
  },
  {
    icon: Lock,
    title: 'Data Privacy',
    description:
      'Worker data is protected with enterprise-grade encryption and blockchain verification. We never sell personal data and comply with GDPR, CCPA, and local data protection laws.',
    color: 'brand-teal',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description:
      'All fees, salaries, and contract terms are fully disclosed before any commitment. Workers see exactly what they will earn, what costs are involved, and what protections they have.',
    color: 'brand-gold',
  },
  {
    icon: Scale,
    title: 'Legal Compliance',
    description:
      'Every employer on our platform is vetted for legal compliance in their jurisdiction. We verify business licenses, track labor law adherence, and conduct annual compliance audits.',
    color: 'brand-teal',
  },
  {
    icon: Users,
    title: 'Worker Voice',
    description:
      'Workers have a direct channel to report concerns, request support, and provide feedback. Our 24/7 support team and anonymous reporting system ensure no issue goes unheard.',
    color: 'brand-gold',
  },
  {
    icon: Globe,
    title: 'Sustainable Mobility',
    description:
      'We promote circular talent mobility where workers return home with new skills, capital, and networks. Our remittance partnerships ensure families benefit from overseas work.',
    color: 'brand-teal',
  },
]

const complianceBadges = [
  { label: 'ISO 9001:2015', desc: 'Quality Management' },
  { label: 'GDPR Compliant', desc: 'Data Protection' },
  { label: 'ILO Standards', desc: 'Labor Rights' },
  { label: 'Blockchain Verified', desc: 'Smart Contracts' },
  { label: 'Ethical Charter', desc: 'Signed 2023' },
  { label: 'Annual Audit', desc: '3rd Party Verified' },
]

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Registered Nurse',
    location: 'Philippines -> Germany',
    quote:
      'WorkforceX changed my life. The training prepared me for German healthcare standards, and the AI matching found me the perfect hospital. I earn 4x what I did at home, and my family is supported every step of the way.',
    metric: '4x salary increase',
  },
  {
    name: 'Ibrahim Hassan',
    role: 'Construction Supervisor',
    location: 'Egypt -> UAE',
    quote:
      'The ethical charter gave me confidence. Every promise was kept - from the salary to the accommodation. When I had a contract issue, the support team resolved it within 48 hours. This is how workforce mobility should work.',
    metric: 'Deployed in 38 days',
  },
  {
    name: 'Priya Sharma',
    role: 'Hotel Manager',
    location: 'India -> Canada',
    quote:
      'I was skeptical about overseas work after hearing horror stories from friends. But WorkforceX verified everything - the employer, the contract, even the housing. I felt protected from day one.',
    metric: '98% satisfaction score',
  },
]

export default function AboutTrust() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()
  const { ref: pillarsRef, isVisible: pillarsVisible } = useStaggerAnimation(6, 0.1)
  const { ref: badgesRef, isVisible: badgesVisible } = useStaggerAnimation(6, 0.08)
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation()

  return (
    <div className="pt-[60px] min-h-screen">
      {/* Hero */}
      <section
        ref={headerRef}
        className="relative py-20 lg:py-28 bg-gradient-to-b from-navy-900/50 to-navy-950 border-b border-white/5"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center max-w-3xl mx-auto"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease',
            }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-[11px] font-medium text-brand-gold uppercase tracking-wider">
                Trust & Safety Center
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Ethical <span className="text-gradient">Commitment</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              We built WorkforceX on a foundation of ethical principles that put
              worker dignity first. Every feature, every partnership, and every
              placement decision is guided by our commitment to fair, transparent,
              and safe workforce mobility.
            </p>
          </div>
        </div>
      </section>

      {/* Ethical Charter Pillars */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
              Six Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Ethical <span className="text-gradient-teal">Charter</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our Ethical Charter is a binding commitment to every worker on our platform.
              These six pillars guide all our operations and partnerships.
            </p>
          </div>

          <div
            ref={pillarsRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {ethicalPillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="group p-6 rounded-2xl bg-surface-elevated border border-white/5 hover:border-brand-gold/20 transition-all duration-500"
                style={{
                  opacity: pillarsVisible ? 1 : 0,
                  transform: pillarsVisible
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s`,
                }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    pillar.color === 'brand-gold'
                      ? 'bg-brand-gold/10 group-hover:bg-brand-gold/20'
                      : 'bg-brand-teal/10 group-hover:bg-brand-teal/20'
                  } transition-colors`}
                >
                  <pillar.icon
                    className={`w-6 h-6 ${
                      pillar.color === 'brand-gold'
                        ? 'text-brand-gold'
                        : 'text-brand-teal'
                    }`}
                  />
                </div>
                <h3 className="text-base font-semibold text-slate-100 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Framework */}
      <section className="py-20 lg:py-28 bg-navy-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
                Multi-Layer Protection
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Safety <span className="text-gradient">Framework</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Our safety framework operates at multiple levels to protect workers
                throughout their mobility journey - from pre-departure to post-return.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Pre-Departure Verification',
                    desc: 'Employer background checks, contract review, and accommodation verification before any travel is booked.',
                  },
                  {
                    icon: Fingerprint,
                    title: 'Identity Protection',
                    desc: 'Blockchain-secured identity verification prevents passport fraud and identity theft throughout the journey.',
                  },
                  {
                    icon: Handshake,
                    title: 'Smart Contract Employment',
                    desc: 'All employment terms are encoded in blockchain smart contracts that auto-enforce payment and conditions.',
                  },
                  {
                    icon: FileText,
                    title: 'Continuous Monitoring',
                    desc: 'Regular check-ins, anonymous feedback channels, and 24/7 emergency support for all deployed workers.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 p-4 rounded-xl bg-surface-elevated border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-brand-teal" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Side */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img
                  src="/images/blog-training.jpg"
                  alt="Safety training session"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -bottom-6 left-4 right-4 flex gap-3">
                <div className="flex-1 glass rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-brand-gold">24/7</div>
                  <div className="text-[9px] text-slate-400">Emergency Support</div>
                </div>
                <div className="flex-1 glass rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-brand-teal">&lt;2hr</div>
                  <div className="text-[9px] text-slate-400">Response Time</div>
                </div>
                <div className="flex-1 glass rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-white">100%</div>
                  <div className="text-[9px] text-slate-400">Contract Reviewed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Certified & Compliant
            </h2>
            <p className="text-slate-400 text-sm">
              Industry-leading standards and third-party verification
            </p>
          </div>

          <div
            ref={badgesRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {complianceBadges.map((badge, i) => (
              <div
                key={badge.label}
                className="text-center p-5 rounded-2xl bg-surface-elevated border border-white/5 hover:border-brand-gold/20 transition-all duration-300 group"
                style={{
                  opacity: badgesVisible ? 1 : 0,
                  transform: badgesVisible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(12px) scale(0.97)',
                  transition: `all 0.4s ease ${i * 0.06}s`,
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-gold/20 transition-colors">
                  <Award className="w-5 h-5 text-brand-gold" />
                </div>
                <div className="text-xs font-semibold text-slate-200 mb-0.5">
                  {badge.label}
                </div>
                <div className="text-[10px] text-slate-500">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-navy-900/30" ref={testimonialsRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
              Worker Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Voices of <span className="text-gradient-teal">Change</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                className="relative p-6 rounded-2xl bg-surface-elevated border border-white/5"
                style={{
                  opacity: testimonialsVisible ? 1 : 0,
                  transform: testimonialsVisible
                    ? 'translateY(0)'
                    : 'translateY(24px)',
                  transition: `all 0.6s ease ${idx * 0.1}s`,
                }}
              >
                <Quote className="w-8 h-8 text-brand-gold/20 mb-4" />
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <div className="text-sm font-semibold text-slate-100">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {t.role} | {t.location}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-brand-gold/10 border border-brand-gold/20">
                    <span className="text-[10px] font-medium text-brand-gold">
                      {t.metric}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '10,000+', label: 'Workers Protected', icon: ShieldCheck },
              { value: '500+', label: 'Employers Vetted', icon: CheckCircle2 },
              { value: '98%', label: 'Satisfaction Rate', icon: Star },
              { value: '0', label: 'Exploitation Cases', icon: Heart },
            ].map(stat => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-surface-elevated border border-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="text-2xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
