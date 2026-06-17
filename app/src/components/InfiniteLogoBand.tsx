const logos = [
  { name: 'Al Rashid Group', src: '/images/logo-alrashid.png' },
  { name: 'Nexus Tech', src: '/images/logo-nexus.png' },
  { name: 'Eco Power', src: '/images/logo-ecopower.png' },
  { name: 'Med Staff Pro', src: '/images/logo-medstaff.png' },
  { name: 'Transport Logistics', src: '/images/logo-transport.png' },
  { name: 'Nordic Hospitality', src: '/images/logo-nordic.png' },
  { name: 'Outback Resources', src: '/images/logo-outback.png' },
  { name: 'Auto Precision', src: '/images/logo-autoprecision.png' },
]

export default function InfiniteLogoBand() {
  const doubled = [...logos, ...logos]

  return (
    <section className="relative py-10 overflow-hidden border-y border-white/5 bg-navy-950/50">
      <p className="text-center text-[11px] text-slate-500 uppercase tracking-[0.2em] mb-6">
        Trusted by leading employers worldwide
      </p>
      <div className="relative flex overflow-hidden">
        <div className="flex animate-scroll-left-slow items-center gap-16 px-8">
          {doubled.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex-shrink-0 w-28 h-14 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />
    </section>
  )
}
