// src/components/auth/VerifyEmailStep.tsx

import { Mail, CheckCircle2 } from 'lucide-react'

interface Props {
  email: string
  resendStatus: 'idle' | 'sending' | 'sent'
  onResend: () => void
}

export default function VerifyEmailStep({ email, resendStatus, onResend }: Props) {
  return (
    <div className="text-center py-2">
      <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center mx-auto mb-4">
        <Mail className="w-6 h-6 text-brand-teal" />
      </div>
      <h2 className="text-base font-semibold text-card-foreground mb-1.5">Check Your Inbox</h2>
      <p className="text-[12px] text-muted-foreground leading-relaxed mb-5">
        We sent a verification link to <span className="text-foreground font-medium">{email}</span>.
        Click the link to activate your account, then sign in.
      </p>
      <button
        onClick={onResend}
        disabled={resendStatus !== 'idle'}
        className="text-[12px] text-brand-gold hover:underline disabled:opacity-60 disabled:no-underline"
      >
        {resendStatus === 'idle' && 'Resend verification email'}
        {resendStatus === 'sending' && 'Sending…'}
        {resendStatus === 'sent' && (
          <span className="inline-flex items-center gap-1 text-brand-teal">
            <CheckCircle2 className="w-3.5 h-3.5" /> Email sent
          </span>
        )}
      </button>
      <div className="mt-5 pt-5 border-t border-border">
        <a href="/login" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
          Back to Sign In
        </a>
      </div>
    </div>
  )
}
