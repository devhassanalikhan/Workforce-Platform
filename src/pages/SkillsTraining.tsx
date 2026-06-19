import { useState } from 'react'
import {
  GraduationCap,
  Star,
  Users,
  Award,
  ChevronRight,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  Globe,
  Wrench,
  Stethoscope,
  Utensils,
  Cpu,
  Truck,
  HardHat,
  MapPin,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const categories = [
  { id: 'all', label: 'All Courses', icon: BookOpen },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'technical', label: 'Technical', icon: Wrench },
  { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
  { id: 'hospitality', label: 'Hospitality', icon: Utensils },
  { id: 'digital', label: 'Digital', icon: Cpu },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'safety', label: 'Safety', icon: HardHat },
]

const trainingCenters = [
  {
    id: 'A',
    name: 'United College of Technology (UCT)',
    location: 'Rawalpindi',
    hub: 'Northern Hub',
    sectors: 'Auto Mechanic, HVAC Systems, Civil Engineering Surveying',
    governance: 'Affiliated with NAVTTC (National Vocational & Technical Training Commission)',
    verificationTag: 'Government Affiliated via NAVTTC',
    verificationColor: 'text-brand-teal border-brand-teal/30 bg-brand-teal/10',
    capacity: 1200,
    completionYear: '2019',
  },
  {
    id: 'B',
    name: 'Government College of Technology (GCT) — Punjab TEVTA',
    location: 'Gulberg, Lahore',
    hub: 'Central Industrial Hub',
    sectors: 'Electric Vehicle Engineering, Mechanical Die & Tooling, Digital Silk Road ICT Systems',
    governance: 'Technical Education & Vocational Training Authority (TEVTA) Punjab',
    verificationTag: 'TEVTA Punjab Quality Assured',
    verificationColor: 'text-brand-gold border-brand-gold/30 bg-brand-gold/10',
    capacity: 2400,
    completionYear: '2017',
  },
  {
    id: 'C',
    name: 'Swedish Institute of Technology',
    location: 'Karachi',
    hub: 'Southern Hub',
    sectors: 'Mechanical Automation, Electrical Diagnostics, Marine Engineering Basics',
    governance: 'Sindh TEVTA Compliant Pipeline',
    verificationTag: 'Sindh TEVTA Compliant',
    verificationColor: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
    capacity: 1800,
    completionYear: '2015',
  },
  {
    id: 'D',
    name: 'Don Bosco Technical Institute',
    location: 'Lahore',
    hub: 'Specialized Trade Facility',
    sectors: 'Precision Woodworking, Industrial Welding, Pattern Drafting',
    governance: 'PTEC Council / Regional Board Alignment',
    verificationTag: 'PTEC Council Registered',
    verificationColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    capacity: 960,
    completionYear: '2013',
  },
]

const courses = [
  {
    id: 1,
    title: 'English for Workplace Communication',
    category: 'language',
    image: '/images/training-language.jpg',
    duration: '8 weeks',
    level: 'Beginner to Intermediate',
    enrolled: 2340,
    rating: 4.8,
    provider: 'UCT Rawalpindi — NAVTTC Affiliated',
    price: 'Free',
    description: 'Master workplace English with industry-specific vocabulary, professional email writing, and interview preparation for Gulf and international placements.',
    modules: 12,
    certification: 'CEFR B1-B2 Certificate',
    skills: ['Business English', 'Interview Prep', 'Email Writing', 'Presentation Skills'],
    progress: 0,
  },
  {
    id: 2,
    title: 'Advanced Welding & Metal Fabrication',
    category: 'technical',
    image: '/images/training-technical.jpg',
    duration: '12 weeks',
    level: 'Intermediate',
    enrolled: 1890,
    rating: 4.9,
    provider: 'Don Bosco Technical Institute — PTEC Registered',
    price: 'PKR 15,000',
    description: 'Hands-on MIG, TIG, and arc welding with ISO standards and industrial safety protocols. Delivery aligned to Don Bosco Lahore\'s precision trade curriculum.',
    modules: 18,
    certification: 'ISO 9606 Welding Certificate',
    skills: ['MIG Welding', 'TIG Welding', 'Arc Welding', 'Blueprint Reading', 'Quality Control'],
    progress: 0,
  },
  {
    id: 3,
    title: 'Patient Care & Clinical Skills',
    category: 'healthcare',
    image: '/images/job-healthcare.jpg',
    duration: '10 weeks',
    level: 'Beginner',
    enrolled: 3100,
    rating: 4.7,
    provider: 'UCT Rawalpindi — NAVTTC Health Track',
    price: 'Free',
    description: 'Essential patient care skills including vital signs, infection control, and ICU-support competencies. Curriculum registered under NAVTTC Health Assistant framework.',
    modules: 15,
    certification: 'Nursing Assistant Certificate',
    skills: ['Patient Hygiene', 'Vital Signs', 'Mobility Support', 'Infection Control', 'CPR'],
    progress: 0,
  },
  {
    id: 4,
    title: 'Hotel Management & Guest Services',
    category: 'hospitality',
    image: '/images/job-hospitality.jpg',
    duration: '6 weeks',
    level: 'Beginner',
    enrolled: 1560,
    rating: 4.6,
    provider: 'Swedish Institute of Technology — Sindh TEVTA',
    price: 'PKR 12,000',
    description: 'Front desk operations, guest relations, and F&B service excellence. Delivered through Sindh TEVTA compliant pipeline at Swedish Institute, Karachi.',
    modules: 10,
    certification: 'Hospitality Management Diploma',
    skills: ['Front Desk', 'Guest Relations', 'Housekeeping', 'F&B Service', 'Revenue Management'],
    progress: 0,
  },
  {
    id: 5,
    title: 'Digital Silk Road ICT & Office Productivity',
    category: 'digital',
    image: '/images/training-digital.jpg',
    duration: '4 weeks',
    level: 'Beginner',
    enrolled: 4200,
    rating: 4.8,
    provider: 'GCT Punjab TEVTA — Digital Silk Road Track',
    price: 'Free',
    description: 'Build ICT skills aligned to the Digital Silk Road corridor. Microsoft Office, data entry, and cloud collaboration delivered via GCT Gulberg, TEVTA Punjab.',
    modules: 8,
    certification: 'Microsoft Office Specialist',
    skills: ['Excel', 'Word', 'PowerPoint', 'Data Entry', 'Email Management'],
    progress: 0,
  },
  {
    id: 6,
    title: 'Mechanical Automation & Electrical Diagnostics',
    category: 'technical',
    image: '/images/job-electronics.jpg',
    duration: '8 weeks',
    level: 'Intermediate',
    enrolled: 980,
    rating: 4.5,
    provider: 'Swedish Institute of Technology — Sindh TEVTA',
    price: 'PKR 18,000',
    description: 'PLC programming, industrial wiring, and automation diagnostics. Covers marine engineering basics for port-sector placements. Sindh TEVTA compliant.',
    modules: 14,
    certification: 'G-III Automation Certificate',
    skills: ['PLC Programming', 'Industrial Wiring', 'Automation Diagnostics', 'Marine Basics'],
    progress: 0,
  },
]

const featuredStats = [
  { value: '50,000+', label: 'Candidates Trained', icon: Users },
  { value: '98%', label: 'Completion Rate', icon: TrendingUp },
  { value: '85%', label: 'Job Placement', icon: Award },
  { value: '100%', label: 'Free Access', icon: ShieldCheck },
]

export default function SkillsTraining() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation()

  const filteredCourses =
    activeCategory === 'all'
      ? courses
      : courses.filter(c => c.category === activeCategory)

  return (
    <div className="pt-[96px] min-h-screen">
      {/* Header */}
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
            <span className="text-[11px] font-medium text-brand-teal uppercase tracking-[0.15em] mb-3 block">
              Free Training Programs
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Skills <span className="text-gradient-teal">Training</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base">
              AI-curated training programs designed to prepare you for international
              opportunities. All courses are free or heavily subsidized with recognized certifications.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-b border-border" ref={statsRef}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredStats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accredited Training Centers */}
      <section className="py-10 lg:py-14 border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-2 block">
              Institutional Partners
            </span>
            <h2 className="text-xl font-bold text-foreground">Accredited Training Network</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainingCenters.map(center => (
              <div
                key={center.id}
                className="p-5 rounded-2xl bg-card border border-border hover:border-brand-gold/20 transition-all duration-300 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {center.hub}
                  </span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${center.verificationColor}`}>
                    {center.verificationTag}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground leading-snug mb-1">
                    {center.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3 text-brand-teal flex-shrink-0" />
                    {center.location}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {center.sectors}
                </p>
                <div className="pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground tabular-nums">
                  <span>Capacity: <span className="font-semibold text-foreground">{center.capacity.toLocaleString()}</span></span>
                  <span>Est. <span className="font-semibold text-foreground">{center.completionYear}</span></span>
                </div>
                <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                  <ShieldCheck className="w-3 h-3 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>{center.governance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter & Courses */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-brand-teal/15 text-brand-teal border border-brand-teal/20'
                    : 'bg-muted/50 text-muted-foreground border border-border hover:border-border'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, i) => (
              <div
                key={course.id}
                className="group rounded-2xl bg-card border border-border hover:border-brand-teal/20 overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  animation: `fadeInUp 0.5s ease ${i * 0.06}s both`,
                }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white font-medium">
                      {course.duration}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md backdrop-blur-sm text-[10px] font-medium ${
                        course.price === 'Free'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-brand-gold/20 text-brand-gold'
                      }`}
                    >
                      {course.price}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                      <span className="text-[10px] text-white font-medium">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-brand-teal font-medium uppercase tracking-wider">
                      {categories.find(c => c.id === course.category)?.label}
                    </span>
                    <span className="text-border">|</span>
                    <span className="text-[10px] text-muted-foreground">{course.level}</span>
                  </div>

                  <h3 className="text-base font-semibold text-card-foreground mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-muted/50 text-[10px] text-muted-foreground border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skills.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] text-muted-foreground">
                        +{course.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground tabular-nums">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.enrolled.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.modules} modules
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-brand-teal font-medium">
                      <Award className="w-3 h-3" />
                      Certified
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-brand-teal/10 text-brand-teal rounded-xl text-xs font-medium hover:bg-brand-teal/20 transition-all group/btn">
                    <Play className="w-3.5 h-3.5" />
                    Start Learning
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] mb-3 block">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How <span className="text-gradient">Training</span> Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Assessment',
                desc: 'AI-powered skills assessment identifies your strengths and gaps.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Personalized Plan',
                desc: 'Get a custom learning path matched to your target job market.',
                icon: GraduationCap,
              },
              {
                step: '03',
                title: 'Learn & Practice',
                desc: 'Complete interactive modules with hands-on projects and mentorship.',
                icon: BookOpen,
              },
              {
                step: '04',
                title: 'Get Certified',
                desc: 'Earn globally recognized certificates and get matched to employers.',
                icon: CheckCircle2,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-card border border-border text-center group hover:border-brand-gold/20 transition-all duration-500"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-4">
                  <span className="text-[10px] font-bold text-brand-gold tracking-wider">
                    Step {item.step}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gold/20 transition-colors">
                  <item.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <h3 className="text-sm font-semibold text-card-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locked Premium Section — intentionally always dark */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 border border-white/5 p-8 lg:p-12">
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20">
                <Lock className="w-3 h-3 text-brand-gold" />
                <span className="text-[10px] font-medium text-brand-gold">
                  Premium
                </span>
              </div>
            </div>
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Advanced Certification Tracks
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Unlock specialized certification programs for senior roles.
                Includes one-on-one mentoring, project-based learning, and direct employer introductions.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {[
                  'Project Management Professional (PMP)',
                  'Advanced Nursing Specializations',
                  'Construction Site Management',
                  'Hospitality Leadership Program',
                  'Data Analytics & Visualization',
                  'Cybersecurity Fundamentals',
                ].map(item => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-slate-400"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all">
                <Sparkles className="w-4 h-4" />
                Unlock Premium Access
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
