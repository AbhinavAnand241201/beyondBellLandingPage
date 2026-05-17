'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'How It Works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

interface NavbarProps {
  onFoundingClick?: () => void
}

export default function Navbar({ onFoundingClick }: NavbarProps) {
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
        <a href="#top" className="flex items-center group" aria-label="BeyondBell home">
          {/* Logo PNG already contains the wordmark — render alone, transparent bg blends into navbar */}
          <Image
            src="/logo.PNG"
            alt="BeyondBell"
            width={1727}
            height={1019}
            className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-[1.03]"
            priority
          />
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
          <button
            type="button"
            onClick={onFoundingClick}
            className="bg-orange-main hover:bg-orange-deep text-white text-[12px] font-semibold px-4 py-1.5 rounded-pill flex items-center gap-1.5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
          >
            <Star size={12} fill="#fff" /> Founding Member
          </button>
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
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onFoundingClick?.()
              }}
              className="mt-2 bg-orange-main hover:bg-orange-deep text-white text-[12px] font-semibold px-4 py-2 rounded-pill flex items-center gap-1.5 self-start shadow-soft transition-colors"
            >
              <Star size={12} fill="#fff" /> Founding Member
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
