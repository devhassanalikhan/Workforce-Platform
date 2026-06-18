import { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse-glow">
          <Globe className="w-16 h-16 text-brand-gold/30" />
        </div>
        <Globe className="w-16 h-16 text-brand-gold relative z-10" />
      </div>
      <h2 className="text-xl font-medium text-slate-200 mb-2 tracking-wide">
        Ethical Workforce Mobility
      </h2>
      <p className="text-sm text-slate-500 mb-8">Loading platform resources...</p>
      <div className="w-64 h-1 bg-navy-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}