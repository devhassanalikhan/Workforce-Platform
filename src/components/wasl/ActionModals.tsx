// src/components/wasl/ActionModals.tsx

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2, CheckCircle2, DollarSign, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { logCheckIn, releaseEscrow, fileGrievance } from '@/lib/data/mutations'

interface BaseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deploymentId: string
  workerName: string
  onSuccess: () => void
}

// ── Shared dialog shell ────────────────────────────────────────────────────────
function ModalShell({ open, onOpenChange, title, icon: Icon, children }: {
  open: boolean; onOpenChange: (v: boolean) => void
  title: string; icon: React.ElementType; children: React.ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-brand-gold" />
              </div>
              <Dialog.Title className="text-base font-semibold text-foreground">{title}</Dialog.Title>
            </div>
            <Dialog.Close className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ── Log Check-in ──────────────────────────────────────────────────────────────
export function LogCheckInModal({ open, onOpenChange, deploymentId, workerName, onSuccess }: BaseProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleConfirm() {
    setIsLoading(true)
    const { error } = await logCheckIn(deploymentId)
    setIsLoading(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success(`Check-in logged for ${workerName}.`)
      onOpenChange(false)
      onSuccess()
    }
  }

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="Log Worker Check-In" icon={CheckCircle2}>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Record a successful check-in for <strong className="text-foreground">{workerName}</strong>.
        This will update their last check-in timestamp and reset status to Active.
      </p>
      <div className="flex justify-end gap-3">
        <Dialog.Close className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-all">
          Cancel
        </Dialog.Close>
        <button onClick={handleConfirm} disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Confirm Check-In
        </button>
      </div>
    </ModalShell>
  )
}

// ── Release Escrow ────────────────────────────────────────────────────────────
export function ReleaseEscrowModal({ open, onOpenChange, deploymentId, workerName, onSuccess }: BaseProps & { currentBalance: number; currency: string }) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num <= 0) { toast.error('Enter a valid amount.'); return }
    setIsLoading(true)
    const { error } = await releaseEscrow(deploymentId, num)
    setIsLoading(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success(`Escrow release of ${num} recorded for ${workerName}.`)
      setAmount('')
      onOpenChange(false)
      onSuccess()
    }
  }

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="Release Escrow Funds" icon={DollarSign}>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Release escrow funds for <strong className="text-foreground">{workerName}</strong>.
      </p>
      <form onSubmit={handleConfirm} className="space-y-4">
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Amount to Release</label>
          <input type="number" min="1" step="any" value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
            placeholder="Enter amount…" required />
        </div>
        <div className="flex justify-end gap-3">
          <Dialog.Close className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-all">
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Release Funds
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

// ── File Grievance ────────────────────────────────────────────────────────────
export function FileGrievanceModal({ open, onOpenChange, deploymentId, workerName, onSuccess }: BaseProps) {
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low')
  const [summary, setSummary]   = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!summary.trim()) { toast.error('Please describe the grievance.'); return }
    setIsLoading(true)
    const { error } = await fileGrievance({ deployment_id: deploymentId, severity, summary: summary.trim() })
    setIsLoading(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success(`Grievance filed for ${workerName}.`)
      setSummary(''); setSeverity('low')
      onOpenChange(false)
      onSuccess()
    }
  }

  const severities: { key: 'low' | 'medium' | 'high'; label: string; cls: string }[] = [
    { key: 'low',    label: 'Low',    cls: 'text-brand-teal border-brand-teal/30 data-[selected=true]:bg-brand-teal/10' },
    { key: 'medium', label: 'Medium', cls: 'text-brand-gold border-brand-gold/30 data-[selected=true]:bg-brand-gold/10' },
    { key: 'high',   label: 'High',   cls: 'text-red-400 border-red-500/30 data-[selected=true]:bg-red-500/10' },
  ]

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="File a Grievance" icon={MessageSquare}>
      <p className="text-sm text-muted-foreground mb-4">
        File a grievance for <strong className="text-foreground">{workerName}</strong>.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">Severity</label>
          <div className="flex gap-2">
            {severities.map(s => (
              <button key={s.key} type="button" data-selected={severity === s.key}
                onClick={() => setSeverity(s.key)}
                className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${s.cls}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Description</label>
          <textarea value={summary} onChange={e => setSummary(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-muted/40 border border-border rounded-xl text-sm text-foreground resize-none h-24 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-colors"
            placeholder="Describe the grievance in detail…" required />
        </div>
        <div className="flex justify-end gap-3">
          <Dialog.Close className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted/50 transition-all">
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Submit Grievance
          </button>
        </div>
      </form>
    </ModalShell>
  )
}
