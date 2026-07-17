// src/pages/admin/AdminEmployersOverview.tsx

import { useEffect, useState } from 'react'
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Search,
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  Hash,
  Link2,
} from 'lucide-react'
import {
  getAdminCompanyOverview,
  getAdminCompanyJobs,
  getAdminCompanyApplications,
  type AdminCompanyRow,
  type AdminApplicationRow,
} from '@/lib/data/adminEmployers'
import type { CompanyJob } from '@/lib/data/employer'
import { getTalent } from '@/lib/data/talent'
import type { TalentProfile } from '@/types/domain'
import AdminTalentDetailModal from '@/components/admin/AdminTalentDetailModal'

type DetailTab = 'jobs' | 'applicants'

export default function AdminEmployersOverview() {
  const [companies, setCompanies] = useState<AdminCompanyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedCompany, setSelectedCompany] = useState<AdminCompanyRow | null>(null)
  const [detailTab, setDetailTab] = useState<DetailTab>('jobs')
  const [companyJobs, setCompanyJobs] = useState<CompanyJob[]>([])
  const [companyApplications, setCompanyApplications] = useState<AdminApplicationRow[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  // Main Dashboard Tab States
  const [mainTab, setMainTab] = useState<'employers' | 'applicants'>('employers')
  const [allApplicants, setAllApplicants] = useState<TalentProfile[]>([])
  const [selectedApplicant, setSelectedApplicant] = useState<TalentProfile | null>(null)
  const [applicantModalOpen, setApplicantModalOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getAdminCompanyOverview(),
      getTalent(true),
    ])
      .then(([companiesData, talentsData]) => {
        setCompanies(companiesData)
        setAllApplicants(talentsData)
      })
      .finally(() => setLoading(false))
  }, [])

  function openCompany(company: AdminCompanyRow) {
    setSelectedCompany(company)
    setDetailTab('jobs')
    setDetailLoading(true)
    Promise.all([
      getAdminCompanyJobs(company.id),
      getAdminCompanyApplications(company.id),
    ]).then(([jobs, applications]) => {
      setCompanyJobs(jobs)
      setCompanyApplications(applications)
      setDetailLoading(false)
    })
  }

  function closeCompany() {
    setSelectedCompany(null)
    setCompanyJobs([])
    setCompanyApplications([])
  }

  function openApplicantDetail(name: string) {
    const matched = allApplicants.find(a => a.name.toLowerCase() === name.toLowerCase())
    if (matched) {
      setSelectedApplicant(matched)
      setApplicantModalOpen(true)
    } else {
      setSelectedApplicant({
        id: 'temp-' + Math.random(),
        name,
        photo: '/images/talent-placeholder.svg',
        role: 'Applicant',
        location: 'Not specified',
        experience: '0 years',
        skills: [],
        languages: [],
        certifications: [],
        verified: false,
        available: true,
        badge: null,
      })
      setApplicantModalOpen(true)
    }
  }

  const filteredCompanies = companies.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredApplicants = allApplicants.filter(a =>
    !searchQuery ||
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="pt-[96px] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    )
  }

  // ── Level 2: company detail ─────────────────────────────────────────────
  if (selectedCompany) {
    return (
      <div className="pt-[96px] min-h-screen bg-background">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <button
            onClick={closeCompany}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all employers
          </button>

          <div className="flex items-start gap-5">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {selectedCompany.logo_url ? (
                <img src={selectedCompany.logo_url} alt={selectedCompany.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-8 h-8 text-muted-foreground/30" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] block mb-1">
                Employer Detail
              </span>
              <h1 className="text-2xl font-bold text-foreground">{selectedCompany.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {selectedCompany.businessType && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-medium">
                    {selectedCompany.businessType}
                  </span>
                )}
                {selectedCompany.country && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {selectedCompany.country}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs">
                  {selectedCompany.planTier}
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span><span className="font-semibold text-foreground">{selectedCompany.jobCount}</span> jobs posted</span>
                <span><span className="font-semibold text-foreground">{selectedCompany.applicationCount}</span> applications</span>
                <span><span className="font-semibold text-foreground">{selectedCompany.shortlistedCount}</span> shortlisted</span>
              </div>
            </div>
          </div>

          {/* Company registration & contact info card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedCompany.registrationNumber && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <Hash className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Reg. Number</div>
                  <div className="text-sm text-foreground">{selectedCompany.registrationNumber}</div>
                  {selectedCompany.registrationAuthority && (
                    <div className="text-[11px] text-muted-foreground">{selectedCompany.registrationAuthority}</div>
                  )}
                </div>
              </div>
            )}
            {selectedCompany.companyWebsite && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <Link2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Website</div>
                  <a
                    href={selectedCompany.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-gold hover:underline truncate block"
                  >
                    {selectedCompany.companyWebsite}
                  </a>
                </div>
              </div>
            )}
            {selectedCompany.companyAddress && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Address</div>
                  <div className="text-sm text-foreground">{selectedCompany.companyAddress}</div>
                </div>
              </div>
            )}
            {selectedCompany.contactPerson && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Contact Person</div>
                  <div className="text-sm text-foreground">{selectedCompany.contactPerson}</div>
                  {selectedCompany.designation && (
                    <div className="text-[11px] text-muted-foreground">{selectedCompany.designation}</div>
                  )}
                  {selectedCompany.phoneNumber && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {selectedCompany.phoneCountryCode} {selectedCompany.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tab strip */}
          <div className="flex gap-2 border-b border-border">
            {(['jobs', 'applicants'] as DetailTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-all ${
                  detailTab === tab
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'jobs' ? 'Job Listings' : 'Applicants'}
              </button>
            ))}
          </div>

          {detailLoading ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
            </div>
          ) : detailTab === 'jobs' ? (
            <div className="space-y-3">
              {companyJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No jobs posted by this company yet.</p>
              ) : (
                companyJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{job.title}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span>{job.employment_type}</span>
                        <span>{job.category}</span>
                      </div>
                    </div>
                    {job.is_hot && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-50 dark:bg-red-500/15 text-red-500 text-[10px] font-bold">
                        Hot
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {companyApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No applications for this company's jobs yet.</p>
              ) : (
                companyApplications.map(app => (
                  <button
                    key={app.id}
                    onClick={() => openApplicantDetail(app.talentName)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border hover:border-brand-gold/30 hover:bg-muted/10 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-xs font-bold text-brand-gold flex-shrink-0">
                        {app.talentInitials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{app.talentName}</div>
                        <div className="text-xs text-muted-foreground">
                          {app.talentRoleTitle} · {app.talentLocation} · Applied to {app.jobTitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-brand-gold tabular-nums flex-shrink-0">
                      Stage {app.stage}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Talent Profile Details Modal */}
        <AdminTalentDetailModal
          talent={selectedApplicant}
          open={applicantModalOpen}
          onOpenChange={setApplicantModalOpen}
        />
      </div>
    )
  }

  // ── Level 1: all-companies overview ─────────────────────────────────────
  return (
    <div className="pt-[96px] min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <span className="text-[11px] font-medium text-brand-gold uppercase tracking-[0.15em] block mb-1">
            Admin Oversight
          </span>
          <h1 className="text-2xl font-bold text-foreground">
            {mainTab === 'employers' ? 'Employers' : 'Applicants'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mainTab === 'employers' 
              ? `${companies.length} companies on the platform`
              : `${allApplicants.length} applicants registered on the platform`
            }
          </p>
        </div>

        {/* Main Tab strip */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => {
              setMainTab('employers')
              setSearchQuery('')
            }}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              mainTab === 'employers'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Employers ({companies.length})
          </button>
          <button
            onClick={() => {
              setMainTab('applicants')
              setSearchQuery('')
            }}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              mainTab === 'applicants'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            All Applicants ({allApplicants.length})
          </button>
        </div>

        {mainTab === 'employers' ? (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>

            {filteredCompanies.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
                <p className="text-sm text-muted-foreground">
                  {companies.length === 0 ? 'No employers have joined the platform yet.' : 'Try a different search.'}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-muted/30 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Company</span>
                  <span>Jobs Posted</span>
                  <span>Applications</span>
                  <span>Shortlisted</span>
                  <span>Plan</span>
                </div>
                {filteredCompanies.map(company => (
                  <button
                    key={company.id}
                    onClick={() => openCompany(company)}
                    className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {company.logo_url ? (
                          <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="w-4 h-4 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate block">{company.name}</span>
                        {company.country && (
                          <span className="text-[11px] text-muted-foreground truncate block">{company.country}</span>
                        )}
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Briefcase className="w-3.5 h-3.5" />
                      {company.jobCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {company.applicationCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {company.shortlistedCount}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted border border-border w-fit capitalize">
                      {company.planTier}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, or skills..."
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No applicants found</h3>
                <p className="text-sm text-muted-foreground">
                  {allApplicants.length === 0 ? 'No applicants have joined the platform yet.' : 'Try a different search.'}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-card border border-border overflow-hidden animate-fade-in">
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-muted/30 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Applicant</span>
                  <span>Role & Skills</span>
                  <span>Location</span>
                  <span>Status</span>
                  <span>Placement Stage</span>
                </div>
                {filteredApplicants.map(applicant => {
                  const initials = applicant.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 3)

                  return (
                    <button
                      key={applicant.id}
                      onClick={() => {
                        setSelectedApplicant(applicant)
                        setApplicantModalOpen(true)
                      }}
                      className="w-full grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-[10px] font-bold text-brand-gold flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-foreground block truncate">{applicant.name}</span>
                          <span className="text-[10px] text-muted-foreground block truncate">{applicant.experience}</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-foreground block truncate">{applicant.role}</span>
                        <div className="flex gap-1 overflow-hidden max-w-full mt-0.5">
                          {applicant.skills.slice(0, 2).map(skill => (
                            <span key={skill} className="px-1.5 py-0.2 bg-muted text-[9px] text-muted-foreground rounded border border-border">
                              {skill}
                            </span>
                          ))}
                          {applicant.skills.length > 2 && (
                            <span className="text-[9px] text-muted-foreground mt-0.5">+{applicant.skills.length - 2}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{applicant.location}</span>
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit capitalize ${
                          applicant.available
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {applicant.available ? 'Available' : 'Deployed'}
                        </span>
                        {applicant.verified && (
                          <span className="text-[9px] text-brand-teal font-semibold flex items-center gap-0.5">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-brand-gold">
                        {applicant.pipelineStage !== undefined ? `Stage ${applicant.pipelineStage} of 6` : 'Not Matched'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Talent Profile Details Modal */}
      <AdminTalentDetailModal
        talent={selectedApplicant}
        open={applicantModalOpen}
        onOpenChange={setApplicantModalOpen}
      />
    </div>
  )
}
