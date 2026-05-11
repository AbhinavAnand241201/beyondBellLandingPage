'use client'

import { useEffect, useState } from 'react'
import { Star, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 h-16 md:h-[72px] flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-orange-main flex items-center justify-center shadow-soft transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
              <path
                d="M12 3a5 5 0 0 0-5 5v4.5L5 16h14l-2-3.5V8a5 5 0 0 0-5-5z"
                fill="#fff"
              />
              <circle cx="12" cy="19" r="1.6" fill="#fff" />
            </svg>
          </div>
          <span className="font-sora text-[17px] tracking-tight">
            <span className="font-normal text-brown-dark">Beyond</span>
            <span className="font-extrabold text-orange-main">Bell</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium text-brown-dark/80 hover:text-orange-main transition-colors"
            >
              {l.label}
            </a>
          ))}
          <span className="bg-orange-main text-white text-[12px] font-semibold px-4 py-1.5 rounded-pill flex items-center gap-1.5 shadow-soft">
            <Star size={12} fill="#fff" /> Founding Member
          </span>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden w-10 h-10 rounded-xl bg-orange-pale flex items-center justify-center text-brown-dark"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-brown-dark/5 shadow-card">
          <div className="px-5 py-5 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[15px] font-medium text-brown-dark hover:text-orange-main"
              >
                {l.label}
              </a>
            ))}
            <span className="mt-2 bg-orange-main text-white text-[12px] font-semibold px-4 py-2 rounded-pill flex items-center gap-1.5 self-start">
              <Star size={12} fill="#fff" /> Founding Member
            </span>
          </div>
        </div>
      )}
    </header>
  )
}
