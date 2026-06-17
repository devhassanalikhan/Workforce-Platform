import { Link } from 'react-router'
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Heart,
} from 'lucide-react'
import { useState } from 'react'

const footerLinks = {
  Platform: [
    { label: 'Jobs Marketplace', href: '/jobs' },
    { label: 'Skills Training', href: '/skills' },
    { label: 'Talent Pool', href: '/talent' },
    { label: 'AI Assistant', href: '/ai-assistant' },
  ],
  Company: [
    { label: 'About & Trust', href: '/about' },
    { label: 'Blog & Resources', href: '/blog' },
    { label: 'Employers', href: '/employers' },
    { label: 'Partners', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Ethical Charter', href: '/about' },
    { label: 'Data Protection', href: '#' },
  ],
}

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="relative bg-navy-950 border-t border-white/5 overflow-hidden">
      {/* World Map Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/images/footer-worldmap.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-white/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Connected
              </h3>
              <p className="text-slate-400 text-sm max-w-md">
                Get the latest ethical workforce insights, training opportunities, and global job market updates delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto gap-2">
              <div className="relative flex-1 lg:w-72">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-brand-gold text-navy-950 rounded-xl text-sm font-semibold hover:bg-brand-gold-light transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <Globe className="w-6 h-6 text-brand-gold" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-100 tracking-tight leading-tight">
                  Workforce<span className="text-brand-gold">X</span>
                </span>
                <span className="text-[8px] text-slate-500 uppercase tracking-[0.15em]">
                  Ethical Mobility
                </span>
              </div>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed mb-4 max-w-[240px]">
              Revolutionizing ethical workforce mobility through AI-powered matching, verified training, and transparent placement.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                <span>Dubai, UAE & Islamabad, PK</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Phone className="w-3.5 h-3.5 text-brand-teal" />
                <span>+971 4 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Mail className="w-3.5 h-3.5 text-brand-teal" />
                <span>contact@workforce-x.com</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-slate-500 text-sm hover:text-brand-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs flex items-center gap-1">
            2025 WorkforceX. Built with <Heart className="w-3 h-3 text-red-500" /> for ethical mobility.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-200"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}