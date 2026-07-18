// src/pages/JobsMarketplace.tsx

import { useCallback, useEffect, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Heart,
  Building2,
  Briefcase,
  TrendingUp,
  Filter,
  X,
  Globe,
  Loader2,
  CheckCircle2,
  CalendarDays,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useAuth } from '@/contexts/AuthContext'
import { hasRole } from '@/lib/rbac'
import { getJobs, getSavedJobIds, getAppliedJobIds } from '@/lib/data/jobs'
import { saveJob, unsaveJob } from '@/lib/data/mutations'
import ScraperPanel from '@/components/admin/ScraperPanel'
import JobDetailModal from '@/components/jobs/jobdetailmodal'
import type { Job } from '@/types/domain'

const PAGE_SIZE = 12

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
  'Steel Fitters',
  'Camp Bosses',
  'Equipment Operations Supervisor',
  'IT Systems',
  'Timekeeper',
  'Steel Fixer',
  'Assistant Camp Boss',
  'Senior Infrastructure Foreman',
  'Pipe Fitters',
  'Plant Operators',
  'Scaffolders',
  'Mason',
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
const salaryRanges = ['All Ranges', '$1,000 - $2,000', '$2,000 - $3,500', '$3,500 - $5,000', '$5,000+']
const sortOptions = ['Relevance', 'Salary: High to Low', 'Salary: Low to High', 'Newest', 'Most Applied']

function destinationOf(job: Job) {
  if (job.destinationCity && job.destinationCountry) return `${job.destinationCity}, ${job.destinationCountry}`
  return job.destinationCountry ?? job.location
}

export default function JobsMarketplace() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedExp, setSelectedExp] = useState('All Levels')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedSalary, setSelectedSalary] = useState('All Ranges')
  const [sortBy, setSortBy] = useState('Relevance')
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation()

  const isApplicant = user?.role === 'applicant'
  const debouncedSearch = useDebouncedValue(searchQuery, 300)
  // Only depend on the saved-job set when the "Saved" filter is active, so
  // liking/unliking a job elsewhere doesn't trigger a refetch of the whole page.
  const savedIdsKey = showSavedOnly ? Array.from(savedJobs).sort().join(',') : ''

  useEffect(() => {
    if (!user?.id) {
      setSavedJobs(new Set())
      setAppliedJobs(new Set())
      return
    }
    getSavedJobIds(user.id).then(setSavedJobs)
    getAppliedJobIds(user.id).then(setAppliedJobs)
  }, [user?.id])

  const fetchJobs = useCallback(
    async (offset: number, append: boolean) => {
      if (showSavedOnly && savedJobs.size === 0) {
        setJobs([])
        setTotalCount(0)
        setHasMore(false)
        setInitialLoading(false)
        setLoadingMore(false)
        return
      }

      if (append) setLoadingMore(true)
      else setInitialLoading(true)

      const page = await getJobs({
        search: debouncedSearch,
        category: selectedCategory,
        location: selectedLocation,
        experience: selectedExp,
        type: selectedType,
        sortBy,
        limit: PAGE_SIZE,
        offset,
        savedJobIds: showSavedOnly ? Array.from(savedJobs) : undefined,
      })

      setJobs(prev => (append ? [...prev, ...page.jobs] : page.jobs))
      setTotalCount(page.total)
      setHasMore(page.hasMore)
      setInitialLoading(false)
      setLoadingMore(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearch, selectedCategory, selectedLocation, selectedExp, selectedType, sortBy, showSavedOnly, savedIdsKey]
  )

  useEffect(() => {
    fetchJobs(0, false)
  }, [fetchJobs])

  const loadMore = useCallback(() => {
    fetchJobs(jobs.length, true)
  }, [fetchJobs, jobs.length])

  const sentinelRef = useInfiniteScroll({ hasMore, loading: initialLoading || loadingMore, onLoadMore: loadMore })

  const toggleSave = async (jobId: string) => {
    if (!user?.id) return
    if (togglingId) return

    const wasSaved = savedJobs.has(jobId)
    // Optimistic update
    setSavedJobs(prev => {
      const next = new Set(prev)
      if (wasSaved) next.delete(jobId)
      else next.add(jobId)
      return next
    })
    setTogglingId(jobId)

    const { error } = wasSaved
      ? await unsaveJob(user.id, jobId)
      : await saveJob(user.id, jobId)

    setTogglingId(null)
    if (error) {
      // Rollback on failure
      setSavedJobs(prev => {
        const next = new Set(prev)
        if (wasSaved) next.add(jobId)
        else next.delete(jobId)
        return next
      })
      toast.error('Could not update saved jobs. Please try again.')
    }
  }

  function openJobDetails(job: Job) {
    setSelectedJob(job)
    setDetailOpen(true)
  }

  function handleApplySuccess(jobId: string) {
    setAppliedJobs(prev => new Set(prev).add(jobId))
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5 text-brand-gold" />
          Category
        </h4>
        <div className="space-y-0.5">
          {jobCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-brand-gold/10 text-brand-gold font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-brand-teal" />
          Location
        </h4>
        <select
          value={selectedLocation}
          onChange={e => setSelectedLocation(e.target.value)}
          className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-[13px] text-foreground focus:outline-none focus:border-brand-gold/50 appearance-none cursor-pointer"
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Experience */}
      <div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
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
                  : 'text-muted-foreground border border-border hover:text-foreground hover:border-border/60'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Contract Type */}
      <div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
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
                  : 'text-muted-foreground border border-border hover:text-foreground hover:border-border/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div>
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
          Salary Range
        </h4>
        <div className="space-y-0.5">
          {salaryRanges.map(range => (
            <button
              key={range}
              onClick={() => setSelectedSalary(range)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                selectedSalary === range
                  ? 'bg-brand-gold/10 text-brand-gold font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
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
              Global Opportunities
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Jobs <span className="text-gradient">Marketplace</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base">
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground hover:bg-muted transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────── */}
      <section className="py-8 lg:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin-only scraper control */}
          {user && hasRole(user.role, 'admin') && (
            <div className="mb-6">
              <ScraperPanel />
            </div>
          )}
          <div className="flex gap-8">
            {/* Sidebar — Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 p-5 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
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
                    className="text-[11px] text-muted-foreground hover:text-brand-gold transition-colors"
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
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-l border-border overflow-y-auto p-6 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <FilterSection />
                </div>
              </div>
            )}

            {/* Job Listings */}
            <div className="flex-1 min-w-0">
              {/* Sort & Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {totalCount} jobs found
                  </span>
                  {user && savedJobs.size > 0 && (
                    <button
                      onClick={() => setShowSavedOnly(prev => !prev)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                        showSavedOnly
                          ? 'bg-red-50 dark:bg-red-500/15 text-red-500 border-red-200 dark:border-red-500/30'
                          : 'text-muted-foreground border-border hover:text-foreground'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${showSavedOnly ? 'fill-red-500 text-red-500' : ''}`} />
                      Saved ({savedJobs.size})
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none appearance-none cursor-pointer"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Cards */}
              {initialLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-muted/50 border border-border animate-pulse" />
                  ))}
                </div>
              ) : (
              <div className="space-y-3">
                {jobs.map((job, i) => {
                  const applied = appliedJobs.has(job.id)
                  return (
                    <div
                      key={job.id}
                      className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-card border border-border hover:border-brand-teal/40 hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      {/* Hot badge */}
                      {job.hot && (
                        <div className="absolute top-3 right-36 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[9px] font-bold border border-red-500/20">
                          <TrendingUp className="w-2.5 h-2.5" />
                          Hot
                        </div>
                      )}

                      {/* Logo */}
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border shadow-sm">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-9 h-9 object-contain"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="text-sm font-bold text-brand-teal group-hover:text-brand-gold transition-colors leading-tight truncate">
                          {job.title}
                        </h3>

                        {/* Row 1: Company · Location · Job Nature */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                            <Building2 className="w-3 h-3 text-brand-teal flex-shrink-0" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                            <MapPin className="w-3 h-3 text-brand-teal flex-shrink-0" />
                            {destinationOf(job)}
                          </span>
                          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                            <Globe className="w-3 h-3 text-brand-teal flex-shrink-0" />
                            {job.jobNature || job.type}
                          </span>
                        </div>

                        {/* Row 2: Experience · Age Limit · Field of Work · Available Till */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                            <Star className="w-3 h-3 text-brand-gold flex-shrink-0" />
                            Experience: <span className="font-medium text-foreground/80">{job.experience}</span>
                          </span>
                          {job.ageLimit && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                              <Users className="w-3 h-3 text-brand-gold flex-shrink-0" />
                              Age Limit: <span className="font-medium text-foreground/80">{job.ageLimit}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                            <Briefcase className="w-3 h-3 text-brand-gold flex-shrink-0" />
                            Field: <span className="font-medium text-foreground/80">{job.fieldOfWork || job.category}</span>
                          </span>
                          {job.availableTill && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
                              <CalendarDays className="w-3 h-3 text-brand-gold flex-shrink-0" />
                              Available Till: <span className="font-medium text-foreground/80">{job.availableTill}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 pl-3 border-l border-border">
                        {/* Save / Heart */}
                        <button
                          onClick={() => void toggleSave(job.id)}
                          disabled={togglingId === job.id}
                          className="p-2 rounded-lg hover:bg-muted/60 transition-colors disabled:opacity-60"
                          title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                        >
                          {togglingId === job.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Heart className={`w-4 h-4 transition-colors ${
                              savedJobs.has(job.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-muted-foreground hover:text-red-400'
                            }`} />
                          )}
                        </button>

                        {/* View Details / Applied */}
                        <div className="flex flex-col items-center gap-1">
                          {applied && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal text-[9px] font-semibold border border-brand-teal/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Applied
                            </span>
                          )}
                          <button
                            onClick={() => openJobDetails(job)}
                            className="px-4 py-2 bg-brand-teal text-white rounded-lg text-xs font-semibold hover:bg-brand-teal/90 active:scale-95 transition-all shadow-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              )}

              {/* Infinite scroll sentinel + loading state */}
              {!initialLoading && hasMore && (
                <div ref={sentinelRef} className="flex items-center justify-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading more jobs...
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!initialLoading && jobs.length === 0 && (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Job Detail + Apply Modal ───────────────────────────── */}
      <JobDetailModal
        job={selectedJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        userId={user?.id}
        isApplicant={isApplicant}
        alreadyApplied={selectedJob ? appliedJobs.has(selectedJob.id) : false}
        onApplySuccess={handleApplySuccess}
      />
    </div>
  )
}
