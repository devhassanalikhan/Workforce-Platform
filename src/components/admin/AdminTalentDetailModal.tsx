// src/components/admin/AdminTalentDetailModal.tsx

import * as Dialog from '@radix-ui/react-dialog'
import {
  X,
  MapPin,
  Briefcase,
  Award,
  Sparkles,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Globe,
  User,
  Phone,
  Mail,
  CreditCard,
  GraduationCap,
} from 'lucide-react'
import type { TalentProfile } from '@/types/domain'
import { STAGE_LABELS, STAGE_COLORS } from '@/lib/pipelineStages'

interface Props {
  talent: TalentProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AdminTalentDetailModal({ talent, open, onOpenChange }: Props) {
  if (!talent) return null

  // Generate initials
  const initials = talent.name
    ? talent.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 3)
    : '??'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-base font-bold text-brand-gold flex-shrink-0">
                {initials}
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {talent.name}
                </Dialog.Title>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    {talent.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                    {talent.location}
                  </span>
                </div>
              </div>
            </div>
            <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Top row badges */}
            <div className="flex flex-wrap gap-2">
              {talent.verified && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span className="text-xs font-semibold text-brand-teal">Verified Account</span>
                </div>
              )}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                talent.available
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${talent.available ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-xs font-semibold">
                  {talent.available ? 'Available for placement' : 'Currently Deployed'}
                </span>
              </div>
              {talent.badge && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold">
                  <Award className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">{talent.badge}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/20 p-4">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Experience</span>
                <span className="text-sm font-semibold text-foreground mt-0.5 block">{talent.experience || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Location</span>
                <span className="text-sm font-semibold text-foreground mt-0.5 block">{talent.location}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-gold" />
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {talent.skills && talent.skills.length > 0 ? (
                  talent.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-muted border border-border text-xs text-foreground">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No skills listed.</span>
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-teal" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {talent.languages && talent.languages.length > 0 ? (
                  talent.languages.map(lang => (
                    <span key={lang} className="px-2.5 py-1 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-xs text-brand-teal">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No languages listed.</span>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-brand-gold" />
                Certifications
              </h4>
              <div className="space-y-2">
                {talent.certifications && talent.certifications.length > 0 ? (
                  talent.certifications.map(cert => (
                    <div key={cert} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      {cert}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground italic">No certifications listed.</div>
                )}
              </div>
            </div>

            {/* Applicant Personal Details */}
            {(talent.phone || talent.email || talent.cnic || talent.dateOfBirth || talent.gender || talent.qualification || talent.fieldOfWork) && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-gold" />
                  Applicant Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {talent.gender && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Gender</div>
                      <div className="text-xs font-semibold text-foreground">{talent.gender}</div>
                    </div>
                  )}
                  {talent.dateOfBirth && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Date of Birth</div>
                      <div className="text-xs font-semibold text-foreground">{talent.dateOfBirth}</div>
                    </div>
                  )}
                  {talent.phone && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Phone</div>
                        <div className="text-xs font-semibold text-foreground">{talent.phone}</div>
                      </div>
                    </div>
                  )}
                  {talent.email && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Email</div>
                        <div className="text-xs font-semibold text-foreground truncate">{talent.email}</div>
                      </div>
                    </div>
                  )}
                  {talent.cnic && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">CNIC</div>
                        <div className="text-xs font-semibold text-foreground font-mono">{talent.cnic}</div>
                      </div>
                    </div>
                  )}
                  {talent.qualification && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3 flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Qualification</div>
                        <div className="text-xs font-semibold text-foreground">{talent.qualification}</div>
                      </div>
                    </div>
                  )}
                  {talent.fieldOfWork && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Field of Work</div>
                      <div className="text-xs font-semibold text-foreground">{talent.fieldOfWork}</div>
                    </div>
                  )}
                  {talent.foreignExperience && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Foreign Experience</div>
                      <div className="text-xs font-semibold text-foreground">{talent.foreignExperience}</div>
                    </div>
                  )}
                  {talent.drivingLicense && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Driving License</div>
                      <div className="text-xs font-semibold text-foreground">{talent.drivingLicense}</div>
                    </div>
                  )}
                  {talent.height && (
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Height</div>
                      <div className="text-xs font-semibold text-foreground">{talent.height}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Placement / AI / Pipeline section */}
            {(talent.aiReadiness !== undefined || talent.pipelineStage !== undefined) && (
              <div className="pt-6 border-t border-border space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Placement & AI Analytics</h4>
                
                {talent.aiReadiness !== undefined && (
                  <div className="rounded-xl border border-border bg-brand-gold/5 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs text-muted-foreground">AI Readiness Score</span>
                      </div>
                      <span className="text-sm font-bold text-brand-gold">{talent.aiReadiness}%</span>
                    </div>
                    <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-teal via-brand-gold to-brand-gold"
                        style={{ width: `${talent.aiReadiness}%` }}
                      />
                    </div>
                  </div>
                )}

                {talent.pipelineStage !== undefined && (
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Activity className={`w-4 h-4 ${STAGE_COLORS[talent.pipelineStage]?.text || 'text-brand-teal'}`} />
                        <span className="text-xs text-muted-foreground">Pipeline Funnel Stage</span>
                      </div>
                      <span className={`text-xs font-bold ${STAGE_COLORS[talent.pipelineStage]?.text || 'text-brand-teal'}`}>
                        Stage {talent.pipelineStage} of 6
                      </span>
                    </div>

                    <div className="flex gap-0.5">
                      {Array.from({ length: 6 }, (_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full transition-all ${
                            i < (talent.pipelineStage || 0)
                              ? STAGE_COLORS[talent.pipelineStage || 1]?.bar || 'bg-brand-teal'
                              : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${STAGE_COLORS[talent.pipelineStage || 1]?.text || 'text-brand-teal'}`} />
                      Stage {talent.pipelineStage}: {STAGE_LABELS[talent.pipelineStage || 1]}
                    </div>

                    {talent.jobOrderId && (
                      <div className="p-3 rounded-lg bg-brand-gold/5 border border-brand-gold/10 text-xs flex items-start gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-foreground">{talent.jobOrderTitle || 'Mapped Job Order'}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Order Code: <span className="font-mono text-brand-gold">{talent.jobOrderId}</span> · Location: {talent.jobOrderCountry}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
