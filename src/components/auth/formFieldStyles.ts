// src/components/auth/formFieldStyles.ts
//
// Shared Tailwind classes for ApplicantSignupForm / EmployerSignupForm — kept
// here rather than duplicated so the two forms stay visually identical.

export const inputClass =
  'w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
export const inputErrorClass = 'border-destructive/50 focus:ring-destructive/40 focus:border-destructive/50'
export const labelClass = 'text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5'
export const fieldErrorClass = 'text-[11px] text-destructive mt-1'
