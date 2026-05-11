'use client'

import { Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

const SOCIALS = [
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-white pt-14 pb-10 px-5">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-10 border-b border-white/10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-orange-main flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
                  <path
                    d="M12 3a5 5 0 0 0-5 5v4.5L5 16h14l-2-3.5V8a5 5 0 0 0-5-5z"
                    fill="#fff"
                  />
                  <circle cx="12" cy="19" r="1.6" fill="#fff" />
                </svg>
              </div>
              <span className="font-sora text-[17px] tracking-tight">
                <span className="font-normal text-white/90">Beyond</span>
                <span className="font-extrabold text-orange-main">Bell</span>
              </span>
            </div>
            <p className="text-[14px] text-white/65 leading-relaxed">
              The professional circle for future-ready educators.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[14px] font-medium text-white/80 hover:text-orange-main transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-6 pt-8">
          <p className="text-[13px] text-white/55">
            <a
              href="https://beyondbell.in"
              className="hover:text-orange-main transition-colors"
            >
              beyondbell.in
            </a>
            <span className="mx-2 text-white/25">·</span>
            © 2026 BeyondBell
          </p>

          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-main flex items-center justify-center text-white transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
