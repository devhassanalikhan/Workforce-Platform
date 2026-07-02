import { useEffect, useState } from 'react'
import {
  Search,
  MapPin,
  Briefcase,
  Award,
  TrendingUp,
  ShieldCheck,
  Globe,
  Filter,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Activity,
  Lock,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useAuth } from '@/contexts/AuthContext'
import { hasRole } from '@/lib/rbac'
import { getTalent } from '@/lib/data/talent'
import type { TalentProfile } from '@/types/domain'
import { STAGE_LABELS, STAGE_COLORS } from '@/lib/pipelineStages'

const filters = [
  { label: 'All Skills', count: 12450 },
  { label: 'Construction', count: 3240 },
  { label: 'Healthcare', count: 2890 },
  { label: 'Hospitality', count: 2150 },
  { label: 'Manufacturing', count: 1870 },
  { label: 'Engineering', count: 1230 },
  { label: 'Logistics', count: 980 },
  { label: 'Digital Skills', count: 1090 },
]

const stats = [
  { label: 'Verified Profiles', value: '12,450+', icon: ShieldCheck },
  { label: 'AI-Scored', value: '100%', icon: Sparkles },
  { label: 'Placement Rate', value: '94%', icon: TrendingUp },
  { label: 'Countries', value: '42', icon: Globe },
]

export default function TalentPool() {
  const [talents, setTalents] = useState<TalentProfile[]>([])
  const [activeFilter, setActiveFilter] = useState('All Skills')
  const [searchQuery, setSearchQuery] = useState('')
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()
  const { user } = useAuth()

  // Employer-tier fields: AI score, pipeline stage, job order details
  const canSeePrivateFields = user !== null && hasRole(user.role, 'employer')

  useEffect(() => {
    getTalent(canSeePrivateFields).then(setTalents)
  }, [canSeePrivateFields])

  return (
    <div className="pt-[96px] min-h-screen bg-background">
      {/* ── Page Header ───────────────────────────────────────── */}
      <section
        ref={headerRef}
        className="relative py-16 lg:py-20 bg-muted/40 border-b border-border"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease',
            }}
          >
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              Global Talent Network
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Talent <span className="text-gradient">Pool</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base">
              Browse our pool of AI-scored, verified talent from across the globe.
              Every profile includes skill assessments, language proficiency, and AI readiness scores.
            </p>
          </div>

          {/* Search */}
          <div
            className="mt-8 max-w-xl"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease 0.15s',
            }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by skill, name, or location..."
                className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <section className="py-8 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <div className="text-base font-bold text-card-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters ───────────────────────────────────────────── */}
      <section className="py-6 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {filters.map(f => (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all duration-200 ${
                  activeFilter === f.label
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                    : 'bg-muted/50 text-muted-foreground border border-border hover:text-foreground hover:border-border/80'
                }`}
              >
                {f.label}
                <span className={`text-[10px] ${activeFilter === f.label ? 'text-brand-gold/60' : 'text-muted-foreground/60'}`}>
                  {f.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Talent Grid ───────────────────────────────────────── */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {talents.map((talent, i) => (
              <div
                key={`${talent.id}-${i}`}
                className="group rounded-2xl bg-card border border-border hover:border-brand-gold/20 hover:shadow-card-hover overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={talent.photo}
                    alt={talent.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay — intentionally dark to ensure white name text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                  {/* Status badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {talent.verified && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 backdrop-blur-sm">
                        <ShieldCheck className="w-3 h-3 text-brand-teal" />
                        <span className="text-[9px] font-medium text-brand-teal">Verified</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-sm ${
                      talent.available
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-amber-500/20 border border-amber-500/30'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${talent.available ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className={`text-[9px] font-medium ${talent.available ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {talent.available ? 'Available' : 'Deployed'}
                      </span>
                    </div>
                  </div>

                  {talent.badge && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 backdrop-blur-sm">
                      <span className="text-[9px] font-medium text-brand-gold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {talent.badge}
                      </span>
                    </div>
                  )}

                  {/* Name — always on dark gradient, white text is correct */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{talent.name}</h3>
                    <p className="text-xs text-slate-300">{talent.role}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-teal" />
                      {talent.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-brand-gold" />
                      {talent.experience}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Key Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {talent.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-foreground border border-border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Languages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {talent.languages.map(lang => (
                        <span key={lang} className="px-2 py-0.5 rounded-md bg-brand-teal/10 text-[10px] text-brand-teal border border-brand-teal/20">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block">Certifications</span>
                    <div className="space-y-1">
                      {talent.certifications.map(cert => (
                        <div key={cert} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-brand-teal flex-shrink-0" />
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Readiness — employer+ only */}
                  <div className={`pt-4 border-t border-border transition-opacity duration-300 ${canSeePrivateFields ? 'opacity-100' : 'opacity-60'}`}>
                    {canSeePrivateFields && talent.aiReadiness !== undefined ? (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-[11px] text-muted-foreground">AI Readiness Score</span>
                          </div>
                          <span className="text-sm font-bold text-brand-gold tabular-nums">{talent.aiReadiness}%</span>
                        </div>
                        <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-teal via-brand-gold to-brand-gold"
                            style={{ width: `${talent.aiReadiness}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 py-1">
                        <Lock className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                        <span className="text-[11px] text-muted-foreground/50">
                          AI score visible to Employer accounts
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pipeline stage + job order — employer+ only */}
                  <div className={`mt-4 pt-4 border-t border-border transition-opacity duration-300 ${canSeePrivateFields ? 'opacity-100' : 'opacity-60'}`}>
                    {canSeePrivateFields && talent.pipelineStage !== undefined ? (() => {
                      const stage = talent.pipelineStage
                      return (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Activity className={`w-3.5 h-3.5 ${STAGE_COLORS[stage].text}`} />
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Pipeline Stage</span>
                          </div>
                          <span className={`text-[10px] font-bold tabular-nums ${STAGE_COLORS[stage].text}`}>
                            {stage} of 6
                          </span>
                        </div>
                        {/* 6-segment progress bar */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: 6 }, (_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-1.5 rounded-full transition-all ${
                                i < stage
                                  ? STAGE_COLORS[stage].bar
                                  : 'bg-border'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`w-3 h-3 flex-shrink-0 ${STAGE_COLORS[stage].text}`} />
                          <span className={`text-[11px] font-semibold ${STAGE_COLORS[stage].text}`}>
                            Stage {stage}: {STAGE_LABELS[stage]}
                          </span>
                        </div>
                        {/* Job order anchor */}
                        <div className="flex items-start gap-1.5 p-2 rounded-lg bg-brand-gold/5 border border-brand-gold/10">
                          <Briefcase className="w-3 h-3 text-brand-gold mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[10px] text-muted-foreground">Mapped to: </span>
                            <span className="text-[10px] font-semibold text-card-foreground">{talent.jobOrderTitle}</span>
                            <span className="text-[10px] text-muted-foreground"> · {talent.jobOrderCountry}</span>
                            <div className="text-[9px] font-bold text-brand-gold mt-0.5 tabular-nums">
                              Job Order {talent.jobOrderId}
                            </div>
                          </div>
                        </div>
                      </div>
                      )
                    })() : (
                      <div className="flex items-center gap-2 py-1">
                        <Lock className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                        <span className="text-[11px] text-muted-foreground/50">
                          Pipeline & job order visible to Employer accounts
                        </span>
                      </div>
                    )}
                  </div>

                  <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-brand-gold/10 text-brand-gold rounded-xl text-xs font-medium hover:bg-brand-gold/20 transition-all group/btn">
                    View Full Profile
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Employer CTA ──────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-12 rounded-3xl bg-card border border-border">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Are You an Employer?</h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Access our full talent database with advanced filtering, AI-powered matching, and
                direct candidate outreach. Post jobs and find your next great hire ethically.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all">
                <GraduationCap className="w-4 h-4" />
                Post a Job
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted/50 transition-all">
                <BookOpen className="w-4 h-4" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
