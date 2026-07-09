// src/components/employers/RequestDemoModal.tsx

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, CheckCircle2, Send } from 'lucide-react'
import { submitDemoRequest } from '@/lib/data/mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RequestDemoModal({ open, onOpenChange }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName('')
    setEmail('')
    setCompany('')
    setMessage('')
    setSubmitted(false)
    setError(null)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: submitError } = await submitDemoRequest({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      message: message.trim() || undefined,
    })

    setIsSubmitting(false)

    if (submitError) {
      setError(submitError)
      return
    }

    setSubmitted(true)
  }

  const inputCls = 'w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors'
  const labelCls = 'text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5'

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-foreground">
              {submitted ? 'Request Sent' : 'Talk to Our Team'}
            </Dialog.Title>
            <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-brand-teal" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thanks — we've received your request. Our team will reach out to
                you at <span className="text-foreground font-medium">{email}</span> shortly.
              </p>
              <Dialog.Close className="px-5 py-2.5 rounded-xl bg-brand-gold text-black text-sm font-semibold hover:opacity-90 transition-all">
                Close
              </Dialog.Close>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[12px] text-muted-foreground -mt-1 mb-1">
                Tell us a bit about your hiring needs and we'll be in touch.
              </p>

              <div>
                <label className={labelCls}>Full Name *</label>
                <input className={inputCls} value={name} onChange={e => setName(e.target.value)}
                  placeholder="Jane Doe" required />
              </div>

              <div>
                <label className={labelCls}>Work Email *</label>
                <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required />
              </div>

              <div>
                <label className={labelCls}>Company Name *</label>
                <input className={inputCls} value={company} onChange={e => setCompany(e.target.value)}
                  placeholder="Acme Corp" required />
              </div>

              <div>
                <label className={labelCls}>Message (optional)</label>
                <textarea className={`${inputCls} resize-none h-20`} value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your hiring needs..." />
              </div>

              {error && (
                <div className="px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !name || !email || !company}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-gold text-black text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {isSubmitting ? 'Sending…' : 'Send Request'}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
