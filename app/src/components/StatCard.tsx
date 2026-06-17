import { useCountUp } from '@/hooks/useCountUp'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  value: number
  suffix?: string
  label: string
  description: string
  icon: LucideIcon
  delay?: number
  isVisible: boolean
}

export default function StatCard({
  value,
  suffix = '',
  label,
  description,
  icon: Icon,
  delay = 0,
  isVisible,
}: StatCardProps) {
  const { ref, value: displayValue } = useCountUp(value, 2000, suffix)

  return (
    <div
      ref={ref}
      className="relative p-6 rounded-2xl bg-surface-elevated border border-white/5 group hover:border-brand-gold/20 transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-gold" />
        </div>
        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold text-gradient mb-2 tabular-nums">
        {displayValue}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      <div className="absolute inset-0 rounded-2xl bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  )
}
