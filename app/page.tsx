'use client'

import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import PlanCreateConnect from '@/components/PlanCreateConnect'
import ProfessionalHome from '@/components/ProfessionalHome'
import ParentCommunicatorDemo from '@/components/ParentCommunicatorDemo'
import FoundingMember from '@/components/FoundingMember'
import FeaturesGrid from '@/components/FeaturesGrid'
import SignupSection from '@/components/SignupSection'
import Footer from '@/components/Footer'

export default function Page() {
  const [count, setCount] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(0)
  const [popKey, setPopKey] = useState(0)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/waitlist-count')
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => setCount(0))
  }, [])

  useEffect(() => {
    if (count === null) return
    const target = count
    if (target === 0) {
      setDisplayCount(0)
      setPopKey((k) => k + 1)
      return
    }
    const dur = 1100
    const start = performance.now()
    let raf = 0
    const step = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayCount(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(step)
      else setPopKey((k) => k + 1)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [count])

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Pointer-tracked glow on feature cards
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = document.querySelectorAll<HTMLElement>('.feature-card')
    const onMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    cards.forEach((c) => c.addEventListener('pointermove', onMove as EventListener))
    return () => {
      cards.forEach((c) => c.removeEventListener('pointermove', onMove as EventListener))
    }
  }, [])

  const fireConfetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const colors = ['#FF8A00', '#FFB04D', '#FFDBA6', '#2B1B0E', '#FFFFFF']
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 48,
      origin: { y: 0.62 },
      colors,
    })
    setTimeout(() => {
      confetti({ particleCount: 55, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors })
      confetti({ particleCount: 55, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors })
    }, 220)
  }

  const handleWaitlistSuccess = () => {
    setCount((c) => (c ?? 0) + 1)
    fireConfetti()
  }

  return (
    <main className="bg-white text-ink overflow-x-hidden">
      <Navbar />
      <HeroSection onCtaClick={scrollToForm} />
      <PlanCreateConnect />
      <ProfessionalHome />
      <ParentCommunicatorDemo />
      <FoundingMember
        count={count}
        displayCount={displayCount}
        popKey={popKey}
        onCtaClick={scrollToForm}
      />
      <FeaturesGrid />
      <SignupSection formRef={formRef} onSuccess={handleWaitlistSuccess} />
      <Footer />
    </main>
  )
}
