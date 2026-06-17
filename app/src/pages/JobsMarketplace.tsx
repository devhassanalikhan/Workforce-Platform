import { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Sparkles,
  Heart,
  Building2,
  Briefcase,
  TrendingUp,
  Filter,
  X,
  Globe,
} from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const jobCategories = [
  'All Categories',
  'Construction',
  'Healthcare',
  'Hospitality',
  'Manufacturing',
  'Logistics',
  'Engineering',
  'Agriculture',
  'Information Technology',
]

const locations = [
  'All Locations',
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Germany',
  'Canada',
  'Japan',
  'Australia',
  'United Kingdom',
]

const experienceLevels = ['All Levels', 'Entry Level', 'Mid Level', 'Senior Level']

const contractTypes = ['All Types', 'Full-time', 'Contract', 'Temporary', 'Seasonal']

const salaryRanges = [
  'All Ranges',
  '$1,000 - $2,000',
  '$2,000 - $3,500',
  '$3,500 - $5,000',
  '$5,000+',
]

const sortOptions = ['Relevance', 'Salary: High to Low', 'Salary: Low to High', 'Newest', 'Most Applied']

const jobs = [
  {
    id: 1,
    title: 'Senior Construction Supervisor',
    company: 'Al Rashid Group',
    logo: '/images/logo-alrashid.png',
    location: 'Dubai, UAE',
    salary: '$3,500 - $4,500/mo',
    type: 'Full-time',
    category: 'Construction',
    experience: 'Senior Level',
    posted: '2 days ago',
    description: 'Oversee large-scale commercial construction projects with a team of 50+ workers. Requires 5+ years experience in GCC construction.',
    requirements: ['5+ years GCC experience', 'Civil Engineering degree', 'Arabic preferred'],
    aiMatch: 94,
    saved: false,
    hot: true,
  },
  {
    id: 2,
    title: 'Registered Nurse - ICU',
    company: 'Med Staff Pro',
    logo: '/images/logo-medstaff.png',
    location: 'Riyadh, Saudi Arabia',
    salary: '$4,200 - $5,800/mo',
    type: 'Full-time',
    category: 'Healthcare',
    experience: 'Mid Level',
    posted: '1 day ago',
    description: 'Join a state-of-the-art 400-bed tertiary care hospital. Handle critical care patients in our 24-bed ICU unit.',
    requirements: ['BSN degree', '2+ years ICU experience', 'Valid nursing license'],
    aiMatch: 91,
    saved: false,
    hot: true,
  },
  {
    id: 3,
    title: 'Electronics Assembly Technician',
    company: 'Nexus Tech',
    logo: '/images/logo-nexus.png',
    location: 'Tokyo, Japan',
    salary: '$2,800 - $3,600/mo',
    type: 'Full-time',
    category: 'Manufacturing',
    experience: 'Entry Level',
    posted: '3 days ago',
    description: 'Work in a cutting-edge semiconductor fabrication facility. Full training provided including Japanese language courses.',
    requirements: ['Technical diploma', 'Attention to detail', 'Willing to learn Japanese'],
    aiMatch: 88,
    saved: false,
    hot: false,
  },
  {
    id: 4,
    title: 'Hotel Operations Manager',
    company: 'Nordic Hospitality',
    logo: '/images/logo-nordic.png',
    location: 'Oslo, Norway',
    salary: '$5,500 - $7,000/mo',
    type: 'Full-time',
    category: 'Hospitality',
    experience: 'Senior Level',
    posted: '5 days ago',
    description: 'Manage daily operations of a 200-room luxury hotel. Lead a multicultural team of 80+ staff members.',
    requirements: ['Hospitality degree', '5+ years hotel management', 'English fluent, Nordic languages a plus'],
    aiMatch: 87,
    saved: false,
    hot: false,
  },
  {
    id: 5,
    title: 'Warehouse Logistics Coordinator',
    company: 'Transport Logistics',
    logo: '/images/logo-transport.png',
    location: 'Toronto, Canada',
    salary: '$3,200 - $4,000/mo',
    type: 'Full-time',
    category: 'Logistics',
    experience: 'Mid Level',
    posted: '1 day ago',
    description: 'Coordinate inbound and outbound logistics for a major e-commerce distribution center serving Eastern Canada.',
    requirements: ['Supply Chain certification', '3+ years warehouse experience', 'WMS software knowledge'],
    aiMatch: 92,
    saved: false,
    hot: true,
  },
  {
    id: 6,
    title: 'Renewable Energy Technician',
    company: 'Eco Power',
    logo: '/images/logo-ecopower.png',
    location: 'Berlin, Germany',
    salary: '$3,800 - $4,800/mo',
    type: 'Contract',
    category: 'Engineering',
    experience: 'Mid Level',
    posted: '4 days ago',
    description: 'Install and maintain wind turbine systems across Northern Germany. Work with cutting-edge renewable technology.',
    requirements: ['Electrical/Mechanical background', 'Height work certification', 'German A2 minimum'],
    aiMatch: 85,
    saved: false,
    hot: false,
  },
  {
    id: 7,
    title: 'Mining Equipment Operator',
    company: 'Outback Resources',
    logo: '/images/logo-outback.png',
    location: 'Perth, Australia',
    salary: '$6,500 - $8,500/mo',
    type: 'Full-time',
    category: 'Engineering',
    experience: 'Senior Level',
    posted: '2 days ago',
    description: 'Operate heavy mining equipment at a large-scale iron ore operation in the Pilbara region. FIFO roster 2:1.',
    requirements: ['Heavy machinery license', '5+ years mining experience', 'Safety-first mentality'],
    aiMatch: 89,
    saved: false,
    hot: true,
  },
  {
    id: 8,
    title: 'Automotive Quality Inspector',
    company: 'Auto Precision',
    logo: '/images/logo-autoprecision.png',
    location: 'Nagoya, Japan',
    salary: '$2,500 - $3,200/mo',
    type: 'Full-time',
    category: 'Manufacturing',
    experience: 'Entry Level',
    posted: '6 days ago',
    description: 'Quality control inspection for precision automotive components. Training provided in lean manufacturing principles.',
    requirements: ['High school diploma', 'Detail-oriented', 'Basic technical aptitude'],
    aiMatch: 93,
    saved: false,
    hot: false,
  },
]

export default function JobsMarketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedExp, setSelectedExp] = useState('All Levels')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedSalary, setSelectedSalary] = useState('All Ranges')
  const [sortBy, setSortBy] = useState('Relevance')
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()

  const toggleSave = (id: number) => {
    setSavedJobs(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    )
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All Categories' || job.category === selectedCategory
    const matchesLocation =
      selectedLocation === 'All Locations' || job.location.includes(selectedLocation)
    const matchesExp =
      selectedExp === 'All Levels' || job.experience === selectedExp
    const matchesType =
      selectedType === 'All Types' || job.type === selectedType
    return matchesSearch && matchesCategory && matchesLocation && matchesExp && matchesType
  })

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5 text-brand-gold" />
          Category
        </h4>
        <div className="space-y-1">
          {jobCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-brand-gold/10 text-brand-gold font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-brand-teal" />
          Location
        </h4>
        <select
          value={selectedLocation}
          onChange={e => setSelectedLocation(e.target.value)}
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[13px] text-slate-300 focus:outline-none focus:border-brand-gold/50 appearance-none cursor-pointer"
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Experience */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-brand-teal" />
          Experience
        </h4>
        <div className="flex flex-wrap gap-2">
          {experienceLevels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedExp(level)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                selectedExp === level
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  : 'text-slate-400 border border-white/10 hover:border-white/20'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Contract Type */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-brand-teal" />
          Contract Type
        </h4>
        <div className="flex flex-wrap gap-2">
          {contractTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                selectedType === type
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  : 'text-slate-400 border border-white/10 hover:border-white/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
          Salary Range
        </h4>
        <div className="space-y-1">
          {salaryRanges.map(range => (
            <button
              key={range}
              onClick={() => setSelectedSalary(range)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                selectedSalary === range
                  ? 'bg-brand-gold/10 text-brand-gold font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="pt-[60px] min-h-screen">
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
              Global Opportunities
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Jobs <span className="text-gradient">Marketplace</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-base">
              Browse verified international job opportunities from ethical employers.
              Every listing is pre-vetted for fair wages, safe conditions, and legal compliance.
            </p>
          </div>

          {/* Search Bar */}
          <div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease 0.15s',
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 lg:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 p-5 rounded-2xl bg-surface-elevated border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                    Filters
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory('All Categories')
                      setSelectedLocation('All Locations')
                      setSelectedExp('All Levels')
                      setSelectedType('All Types')
                      setSelectedSalary('All Ranges')
                    }}
                    className="text-[11px] text-slate-500 hover:text-brand-gold transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <FilterSection />
              </div>
            </aside>

            {/* Mobile Filters Drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-navy-900 overflow-y-auto p-6 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-slate-200">Filters</h3>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  <FilterSection />
                </div>
              </div>
            )}

            {/* Job Listings */}
            <div className="flex-1 min-w-0">
              {/* Sort & Results Count */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500">
                  {filteredJobs.length} jobs found
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Cards */}
              <div className="space-y-4">
                {filteredJobs.map((job, i) => (
                  <div
                    key={job.id}
                    className="group relative p-5 lg:p-6 rounded-2xl bg-surface-elevated border border-white/5 hover:border-brand-gold/20 transition-all duration-500"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    {job.hot && (
                      <div className="absolute top-4 right-14 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Hot
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-9 h-9 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-slate-100 group-hover:text-brand-gold transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-xs text-slate-400">
                                {job.company}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSave(job.id)}
                            className="flex-shrink-0 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 transition-colors ${
                                savedJobs.includes(job.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-slate-600 hover:text-slate-400'
                              }`}
                            />
                          </button>
                        </div>

                        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.requirements.map(req => (
                            <span
                              key={req}
                              className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] text-slate-400 border border-white/5"
                            >
                              {req}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            Posted {job.posted}
                          </div>
                        </div>

                        {/* AI Match */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-[11px] text-slate-500">
                              AI Match Score:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-gold"
                                  style={{ width: `${job.aiMatch}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-brand-gold">
                                {job.aiMatch}%
                              </span>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-lg text-xs font-medium hover:bg-brand-gold/20 transition-all">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-sm text-slate-500">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
