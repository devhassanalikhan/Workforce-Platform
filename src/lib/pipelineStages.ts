// Shared 6-stage placement pipeline model — the single source of truth for
// what `placements.stage` (1-6) means, used by TalentPool.tsx and
// EmployerEnterprise.tsx so both pages describe the same journey.
export const STAGE_LABELS: Record<number, string> = {
  1: 'Job Order Matched',
  2: 'Profile Screened',
  3: 'Training Enrolled',
  4: 'Readiness Cleared',
  5: 'Handed to FF OES',
  6: 'Deployed',
}

export const STAGE_COLORS: Record<number, { bar: string; badge: string; text: string }> = {
  1: { bar: 'bg-brand-teal', badge: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20', text: 'text-brand-teal' },
  2: { bar: 'bg-brand-teal', badge: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20', text: 'text-brand-teal' },
  3: { bar: 'bg-brand-teal', badge: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20', text: 'text-brand-teal' },
  4: { bar: 'bg-brand-teal', badge: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20', text: 'text-brand-teal' },
  5: { bar: 'bg-brand-gold', badge: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20', text: 'text-brand-gold' },
  6: { bar: 'bg-violet-500', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', text: 'text-violet-400' },
}

export const TOTAL_STAGES = 6
