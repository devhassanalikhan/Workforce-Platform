import { useState } from 'react'
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
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

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

const talents = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    photo: '/images/talent-1.jpg',
    role: 'Construction Supervisor',
    location: 'Kerala, India',
    experience: '8 years',
    skills: ['Site Management', 'Safety Compliance', 'Team Leadership', 'AutoCAD'],
    languages: ['English', 'Hindi', 'Malayalam'],
    certifications: ['OSHA 30-Hour', 'First Aid', 'Crane Operation'],
    aiReadiness: 94,
    verified: true,
    available: true,
    badge: 'Top Rated',
  },
  {
    id: 2,
    name: 'Ming Zhao',
    photo: '/images/talent-2.jpg',
    role: 'Registered Nurse',
    location: 'Manila, Philippines',
    experience: '5 years',
    skills: ['ICU Care', 'Patient Assessment', 'Emergency Response', 'IV Therapy'],
    languages: ['English', 'Tagalog'],
    certifications: ['BSN', 'NCLEX-RN', 'BLS', 'ACLS'],
    aiReadiness: 91,
    verified: true,
    available: true,
    badge: 'Healthcare Star',
  },
  {
    id: 3,
    name: 'Abdul Rahman',
    photo: '/images/talent-3.jpg',
    role: 'Logistics Coordinator',
    location: 'Lagos, Nigeria',
    experience: '6 years',
    skills: ['Supply Chain', 'WMS Systems', 'Inventory Control', 'Fleet Management'],
    languages: ['English', 'Yoruba', 'French'],
    certifications: ['CPLM', 'Forklift License', 'Dangerous Goods'],
    aiReadiness: 88,
    verified: true,
    available: true,
    badge: null,
  },
  {
    id: 4,
    name: 'Sofia Martinez',
    photo: '/images/talent-4.jpg',
    role: 'Hotel Operations Manager',
    location: 'Lima, Peru',
    experience: '7 years',
    skills: ['Guest Relations', 'Revenue Management', 'F&B Operations', 'PMS Systems'],
    languages: ['English', 'Spanish', 'Portuguese'],
    certifications: ['AHLEI', 'Revenue Management', 'Wine & Spirits'],
    aiReadiness: 92,
    verified: true,
    available: false,
    badge: 'Hospitality Pro',
  },
  {
    id: 5,
    name: 'Arjun Patel',
    photo: '/images/talent-5.jpg',
    role: 'IT Support Specialist',
    location: 'Ahmedabad, India',
    experience: '4 years',
    skills: ['Network Admin', 'Cloud Computing', 'Cybersecurity', 'Help Desk'],
    languages: ['English', 'Hindi', 'Gujarati'],
    certifications: ['CompTIA A+', 'CCNA', 'AWS Cloud Practitioner'],
    aiReadiness: 89,
    verified: true,
    available: true,
    badge: null,
  },
  {
    id: 6,
    name: 'Rajesh Kumar',
    photo: '/images/talent-1.jpg',
    role: 'Master Electrician',
    location: 'Punjab, India',
    experience: '10 years',
    skills: ['Industrial Wiring', 'PLC Programming', 'HVAC Systems', 'Solar Installation'],
    languages: ['English', 'Hindi', 'Punjabi'],
    certifications: ['Master Electrician', 'Solar PV', 'NEC Certified'],
    aiReadiness: 96,
    verified: true,
    available: true,
    badge: 'Elite Talent',
  },
]

const stats = [
  { label: 'Verified Profiles', value: '12,450+', icon: ShieldCheck },
  { label: 'AI-Scored', value: '100%', icon: Sparkles },
  { label: 'Placement Rate', value: '94%', icon: TrendingUp },
  { label: 'Countries', value: '42', icon: Globe },
]

export default function TalentPool() {
  const [activeFilter, setActiveFilter] = useState('All Skills')
  const [searchQuery, setSearchQuery] = useState('')
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()

  return (
    <div className="pt-[60px] min-h-screen bg-navy-950">
      {/* Header */}
      <section
        ref={headerRef}
        className="relative py-16 lg:py-20 bg-gradient-to-b from-navy-900/50 to-navy-950 border-b border-white/5"
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Talent <span className="text-gradient">Pool</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-base">
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by skill, name, or location..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated/50 border border-white/5"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            {filters.map(f => (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all duration-200 ${
                  activeFilter === f.label
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/15'
                }`}
              >
                {f.label}
                <span
                  className={`text-[10px] ${
                    activeFilter === f.label
                      ? 'text-brand-gold/60'
                      : 'text-slate-600'
                  }`}
                >
                  {f.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Grid */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {talents.map((talent, i) => (
              <div
                key={`${talent.id}-${i}`}
                className="group rounded-2xl bg-surface-elevated border border-white/5 hover:border-brand-gold/20 overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                {/* Photo Header */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={talent.photo}
                    alt={talent.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {talent.verified && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 backdrop-blur-sm">
                        <ShieldCheck className="w-3 h-3 text-brand-teal" />
                        <span className="text-[9px] font-medium text-brand-teal">
                          Verified
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-sm ${
                        talent.available
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'bg-amber-500/20 border border-amber-500/30'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          talent.available ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span
                        className={`text-[9px] font-medium ${
                          talent.available ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {talent.available ? 'Available' : 'Deployed'}
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  {talent.badge && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 backdrop-blur-sm">
                      <span className="text-[9px] font-medium text-brand-gold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {talent.badge}
                      </span>
                    </div>
                  )}

                  {/* Name overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white">{talent.name}</h3>
                    <p className="text-xs text-slate-300">{talent.role}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-400">
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
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 block">
                      Key Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {talent.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-4">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 block">
                      Languages
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {talent.languages.map(lang => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 rounded-md bg-brand-teal/5 text-[10px] text-brand-teal border border-brand-teal/10"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 block">
                      Certifications
                    </span>
                    <div className="space-y-1">
                      {talent.certifications.map(cert => (
                        <div
                          key={cert}
                          className="flex items-center gap-1.5 text-[11px] text-slate-400"
                        >
                          <CheckCircle2 className="w-3 h-3 text-brand-teal flex-shrink-0" />
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Readiness */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="text-[11px] text-slate-400">
                          AI Readiness Score
                        </span>
                      </div>
                      <span className="text-sm font-bold text-brand-gold">
                        {talent.aiReadiness}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-teal via-brand-gold to-brand-gold"
                        style={{ width: `${talent.aiReadiness}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA */}
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

      {/* For Employers CTA */}
      <section className="py-16 lg:py-20 bg-navy-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-12 rounded-3xl bg-surface-elevated border border-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Are You an Employer?
              </h2>
              <p className="text-slate-400 text-sm max-w-lg">
                Access our full talent database with advanced filtering, AI-powered
                matching, and direct candidate outreach. Post jobs and find your
                next great hire ethically.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all">
                <GraduationCap className="w-4 h-4" />
                Post a Job
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-white/15 text-slate-200 rounded-xl text-sm font-medium hover:bg-white/5 transition-all">
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
