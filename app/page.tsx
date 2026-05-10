'use client'

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, Check, Sparkles, Quote } from 'lucide-react'
import WaitlistForm from '@/components/WaitlistForm'
import confetti from 'canvas-confetti'
import Lenis from 'lenis'

/* ─────────────────────────────────────────────
   Custom on-brand SVG illustrations for each tool.
   Stroke-based line-art with yellow accent fills.
   ───────────────────────────────────────────── */

const IconLessonPlanner = (
  <svg viewBox="0 0 44 44" width="28" height="28" fill="none" aria-hidden>
    <rect x="6" y="7" width="32" height="30" rx="3" stroke="#0A0A0A" strokeWidth="2" />
    <rect x="6" y="7" width="32" height="7" rx="3" fill="#FACC15" />
    <line x1="12" y1="20" x2="32" y2="20" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="26" x2="28" y2="26" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="32" x2="24" y2="32" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="14" cy="10.5" r="1.2" fill="#0A0A0A" />
    <circle cx="18" cy="10.5" r="1.2" fill="#0A0A0A" />
  </svg>
)

const IconQuestionPaper = (
  <svg viewBox="0 0 44 44" width="28" height="28" fill="none" aria-hidden>
    <rect x="9" y="5" width="26" height="32" rx="2" fill="#FACC15" stroke="#0A0A0A" strokeWidth="2" />
    <rect x="6" y="9" width="26" height="32" rx="2" fill="#fff" stroke="#0A0A0A" strokeWidth="2" />
    <text x="11" y="20" fontFamily="Georgia, serif" fontSize="9" fontWeight="900" fill="#0A0A0A">Q1</text>
    <line x1="11" y1="25" x2="27" y2="25" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="11" y1="30" x2="23" y2="30" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="11" y1="35" x2="25" y2="35" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const IconParentCommunicator = (
  <svg viewBox="0 0 44 44" width="28" height="28" fill="none" aria-hidden>
    <path
      d="M5 12c0-2 1-3 3-3h16c2 0 3 1 3 3v10c0 2-1 3-3 3h-9l-6 5v-5H8c-2 0-3-1-3-3V12z"
      fill="#fff" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round"
    />
    <path
      d="M17 22c0-2 1-3 3-3h16c2 0 3 1 3 3v10c0 2-1 3-3 3h-2v5l-6-5h-8c-2 0-3-1-3-3V22z"
      fill="#FACC15" stroke="#0A0A0A" strokeWidth="2" strokeLinejoin="round"
    />
    <circle cx="11" cy="17" r="1.3" fill="#0A0A0A" />
    <circle cx="16" cy="17" r="1.3" fill="#0A0A0A" />
  </svg>
)

const IconEventPlanner = (
  <svg viewBox="0 0 44 44" width="28" height="28" fill="none" aria-hidden>
    <rect x="6" y="9" width="32" height="29" rx="3" fill="#fff" stroke="#0A0A0A" strokeWidth="2" />
    <rect x="6" y="9" width="32" height="8" rx="3" fill="#0A0A0A" />
    <line x1="14" y1="5" x2="14" y2="13" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="30" y1="5" x2="30" y2="13" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="20" y="22" width="10" height="9" rx="1.5" fill="#FACC15" stroke="#0A0A0A" strokeWidth="1.6" />
    <path
      d="M25 24l1 1.8 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2-.3z"
      fill="#0A0A0A"
    />
  </svg>
)

const IconTimeTable = (
  <svg viewBox="0 0 44 44" width="28" height="28" fill="none" aria-hidden>
    <rect x="5" y="8" width="34" height="28" rx="2.5" fill="#fff" stroke="#0A0A0A" strokeWidth="2" />
    <line x1="5" y1="17" x2="39" y2="17" stroke="#0A0A0A" strokeWidth="1.6" />
    <line x1="5" y1="26" x2="39" y2="26" stroke="#0A0A0A" strokeWidth="1.6" />
    <line x1="16" y1="8" x2="16" y2="36" stroke="#0A0A0A" strokeWidth="1.6" />
    <line x1="28" y1="8" x2="28" y2="36" stroke="#0A0A0A" strokeWidth="1.6" />
    <rect x="16" y="17" width="12" height="9" fill="#FACC15" />
    <circle cx="22" cy="21.5" r="2.3" fill="#0A0A0A" />
    <line x1="22" y1="21.5" x2="22" y2="19.5" stroke="#FACC15" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="22" y1="21.5" x2="23.5" y2="22.5" stroke="#FACC15" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

type Tool = {
  illustration: ReactNode
  name: string
  desc: string
  videoSrc?: string
}

const TOOLS: Tool[] = [
  {
    illustration: IconLessonPlanner,
    name: 'Lesson Planner',
    desc: 'A complete CBSE / ICSE / IGCSE lesson plan in 60 seconds.',
  },
  {
    illustration: IconQuestionPaper,
    name: 'Question Paper Maker',
    desc: 'Board-aligned paper with answer key in 15 minutes.',
  },
  {
    illustration: IconParentCommunicator,
    name: 'ParentCommunicator',
    desc: '20+ situation types. Tone-calibrated. Done in 3 minutes.',
    videoSrc: '/parentCommunicator.mp4',
  },
  {
    illustration: IconEventPlanner,
    name: 'Event Planner',
    desc: 'Annual day, PTM, sports day — full pack: timeline, tasks, templates.',
  },
  {
    illustration: IconTimeTable,
    name: 'Time Table Maker',
    desc: 'Generate clash-free school timetables in minutes.',
  },
]

type Tier = {
  name: string
  price: string
  period: string
  what: string
  note?: string
  highlight?: boolean
  badge?: string | null
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    price: '₹0',
    period: '/ month',
    what: 'Community · Morning Briefing · 1 trial use of every AI tool',
  },
  {
    name: 'Founding Member',
    price: '₹199',
    period: '/ month',
    note: 'Locked for life · First 500',
    what: 'Everything in Standard · Founding badge · Price never increases',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Standard',
    price: '₹299',
    period: '/ month',
    what: 'Unlimited standard AI tools · Live events',
  },
  {
    name: 'Pro',
    price: '₹399',
    period: '/ month',
    what: 'Standard + Time Table Maker + Leadership Lounge',
  },
  {
    name: 'School Plan',
    price: '₹1,999',
    period: '/ teacher / yr',
    note: 'Min 5 seats',
    what: 'Standard for all teachers · Admin dashboard',
  },
]

const FM_TOTAL = 500
const BOARDS_LOOP = ['CBSE', 'ICSE', 'IGCSE', 'NEP-aligned', 'Real classrooms', 'Real peers']

function renderInkChars(text: string) {
  const words = text.split(' ')
  return words.map((word, wi) => {
    const isLast = wi === words.length - 1
    return (
      <Fragment key={`w${wi}`}>
        <span className="ink-word">
          {[...word].map((ch, ci) => (
            <span key={`c${ci}`} className="ink-char">
              {ch}
            </span>
          ))}
        </span>
        {!isLast && ' '}
      </Fragment>
    )
  })
}

function HeadlineTypewriter() {
  const L1 = 'Finally. A professional home'
  const L2A = 'built for '
  const L2B = 'Indian school educators.'

  const [l1, setL1] = useState('')
  const [l2a, setL2a] = useState('')
  const [l2b, setL2b] = useState('')
  const [stage, setStage] = useState<'l1' | 'l2a' | 'l2b' | 'done'>('l1')
  const [caretFade, setCaretFade] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setL1(L1)
      setL2a(L2A)
      setL2b(L2B)
      setStage('done')
      setCaretFade(true)
      return
    }

    let cancelled = false
    let s: 'l1' | 'l2a' | 'l2b' = 'l1'
    let i = 0
    let timer = 0

    const delayFor = (ch: string) => {
      if (ch === '.') return 220
      if (ch === ' ') return 55
      return 22 + Math.random() * 30
    }

    const tick = () => {
      if (cancelled) return
      const text = s === 'l1' ? L1 : s === 'l2a' ? L2A : L2B
      const setter = s === 'l1' ? setL1 : s === 'l2a' ? setL2a : setL2b

      if (i >= text.length) {
        if (s === 'l1') {
          s = 'l2a'
          setStage('l2a')
          i = 0
          timer = window.setTimeout(tick, 280)
        } else if (s === 'l2a') {
          s = 'l2b'
          setStage('l2b')
          i = 0
          timer = window.setTimeout(tick, 0)
        } else {
          setStage('done')
          timer = window.setTimeout(() => {
            if (!cancelled) setCaretFade(true)
          }, 700)
        }
        return
      }

      const ch = text[i]
      i += 1
      setter(text.slice(0, i))
      timer = window.setTimeout(tick, delayFor(ch))
    }

    timer = window.setTimeout(tick, 280)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  const showCaretL1 = stage === 'l1'
  const showCaretL2 =
    stage === 'l2a' || stage === 'l2b' || (stage === 'done' && !caretFade)

  return (
    <h1 className="font-black text-[40px] md:text-[56px] lg:text-[64px] text-navy leading-[1.05] tracking-tight mb-6">
      <span className="sr-only">
        Finally. A professional home built for Indian school educators.
      </span>
      <span className="block" aria-hidden>
        {renderInkChars(l1)}
        {showCaretL1 && <span className="tw-caret" />}
      </span>
      <span className="block" aria-hidden>
        {renderInkChars(l2a)}
        <span className="underline-amber">{renderInkChars(l2b)}</span>
        {showCaretL2 && (
          <span className={`tw-caret ${stage === 'done' ? 'fade' : ''}`} />
        )}
      </span>
    </h1>
  )
}

function PageLoader() {
  const [mounted, setMounted] = useState(false)
  const [exit, setExit] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      return
    }
    const t1 = window.setTimeout(() => setExit(true), 2400)
    const t2 = window.setTimeout(() => setGone(true), 3200)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  if (!mounted || gone) return null

  return (
    <div id="bb-loader" className={exit ? 'exit' : ''} aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bb-particle" />
      ))}

      <div id="bb-loader-ring">
        <svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
          <circle
            className="bb-ring-outer"
            cx="80" cy="80" r="70"
            fill="none"
            stroke="#FACC15"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
          />
          <circle
            className="bb-ring-inner"
            cx="80" cy="80" r="48"
            fill="none"
            stroke="rgba(250,204,21,0.4)"
            strokeWidth="1.2"
            strokeDasharray="8 6"
            transform="rotate(-90 80 80)"
          />
          <circle
            className="bb-ring-spin"
            cx="80" cy="80" r="70"
            fill="none"
            stroke="#FDE047"
            strokeWidth="3"
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
          />
        </svg>

        <div id="bb-loader-logo">
          <svg viewBox="0 0 60 36" width="60" height="36" xmlns="http://www.w3.org/2000/svg">
            <text
              x="30" y="28"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="30"
              fontWeight="900"
              fill="#FACC15"
            >
              BB
            </text>
          </svg>
        </div>
      </div>

      <div id="bb-loader-tagline">
        <span className="tag-1">BeyondBell</span>
        <span className="tag-2">Circle · Opening July 2026</span>
      </div>

      <div id="bb-loader-dots">
        <span /><span /><span />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MorphingCursor — small yellow dot that follows
   the pointer; expands into a "Hover to play" pill
   when over a tool card with a video preview, and
   into a soft circle when over interactive controls.
   ───────────────────────────────────────────── */
function MorphingCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (reduced || !finePointer) return

    document.body.classList.add('has-bb-cursor')
    const el = ref.current
    const label = labelRef.current
    if (!el || !label) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const tick = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!el.classList.contains('ready')) el.classList.add('ready')

      const target = e.target as HTMLElement | null
      if (!target) return
      const overVideo = target.closest('.has-video')
      const overInteractive = target.closest('a, button, input, select, .tier-card, .tool-card')

      if (overVideo) {
        el.classList.add('hover-video')
        el.classList.remove('hover-link')
        label.textContent = 'Hover to play'
      } else if (overInteractive) {
        el.classList.add('hover-link')
        el.classList.remove('hover-video')
        label.textContent = ''
      } else {
        el.classList.remove('hover-video', 'hover-link')
        label.textContent = ''
      }
    }
    const onLeave = () => el.classList.remove('ready')

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.body.classList.remove('has-bb-cursor')
    }
  }, [])

  return (
    <div ref={ref} className="bb-cursor" aria-hidden>
      <span ref={labelRef} />
    </div>
  )
}

/* ─────────────────────────────────────────────
   ToolCard — handles 3D tilt + optional video hover overlay.
   ───────────────────────────────────────────── */
function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const ry = (x - 0.5) * 8
    const rx = -(y - 0.5) * 6
    el.style.setProperty('--rx', `${rx}deg`)
    el.style.setProperty('--ry', `${ry}deg`)
    el.style.setProperty('--mx', `${(e.clientX - rect.left)}px`)
    el.style.setProperty('--my', `${(e.clientY - rect.top)}px`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const onEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={`tool-card reveal ${tool.videoSrc ? 'has-video' : ''}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="tool-card-body">
        <div className="flex items-center gap-3 mb-3">
          <div className="tool-icon w-12 h-12 rounded-xl bg-amber/20 border border-amber/40 flex items-center justify-center flex-shrink-0">
            {tool.illustration}
          </div>
          <h3 className="font-black text-navy text-[16px] md:text-[17px]">
            {tool.name}
          </h3>
        </div>
        <p className="text-[14px] text-muted leading-relaxed">{tool.desc}</p>
        <div className="tool-arrow mt-3 inline-flex items-center gap-1.5 text-navy text-xs font-black uppercase tracking-wider">
          {tool.videoSrc ? 'Hover to preview' : 'Reserve to unlock'}{' '}
          <ArrowRight style={{ width: 13, height: 13 }} />
        </div>
      </div>

      {tool.videoSrc && (
        <div className="video-overlay">
          <video
            ref={videoRef}
            src={tool.videoSrc}
            muted
            loop
            playsInline
            preload="none"
            suppressHydrationWarning
          />
          <div className="video-caption">
            <span className="live-pip" aria-hidden />
            {tool.name} · Live preview
          </div>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  const [count, setCount] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(0)
  const [showSticky, setShowSticky] = useState(false)
  const [popKey, setPopKey] = useState(0)
  const formRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

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

  // Lenis smooth scroll
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0
      setShowSticky(heroBottom < -40)
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      const p = total > 0 ? (doc.scrollTop / total) * 100 : 0
      doc.style.setProperty('--p', `${p}%`)

      const aurora = heroRef.current?.querySelector<HTMLElement>('.aurora')
      if (aurora) {
        const sy = Math.min(doc.scrollTop, 700)
        aurora.style.transform = `translate3d(0, ${sy * -0.14}px, 0)`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cursor spotlight on hero + pointer glow on tier cards / primary buttons
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const tierTargets = document.querySelectorAll<HTMLElement>('.tier-card, .btn-primary')
    const onMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    tierTargets.forEach((c) => c.addEventListener('pointermove', onMove as EventListener))

    const hero = heroRef.current
    const onHeroMove = (e: PointerEvent) => {
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      hero.style.setProperty('--cx', `${e.clientX - rect.left}px`)
      hero.style.setProperty('--cy', `${e.clientY - rect.top}px`)
    }
    hero?.addEventListener('pointermove', onHeroMove)

    return () => {
      tierTargets.forEach((c) =>
        c.removeEventListener('pointermove', onMove as EventListener)
      )
      hero?.removeEventListener('pointermove', onHeroMove)
    }
  }, [])

  // Magnetic effect on primary CTA buttons
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const buttons = document.querySelectorAll<HTMLButtonElement>('.btn-primary')
    const handlers: Array<{ el: HTMLElement; move: (e: PointerEvent) => void; leave: () => void }> = []

    buttons.forEach((btn) => {
      const move = (e: PointerEvent) => {
        const rect = btn.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        const radius = Math.max(rect.width, rect.height) * 0.9
        if (dist > radius) {
          btn.style.setProperty('--bx', '0px')
          btn.style.setProperty('--by', '0px')
          return
        }
        const strength = 0.22
        btn.style.setProperty('--bx', `${dx * strength}px`)
        btn.style.setProperty('--by', `${dy * strength}px`)
      }
      const leave = () => {
        btn.style.setProperty('--bx', '0px')
        btn.style.setProperty('--by', '0px')
      }
      window.addEventListener('pointermove', move)
      btn.addEventListener('pointerleave', leave)
      handlers.push({ el: btn, move, leave })
    })

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        window.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      })
    }
  }, [])

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const fireConfetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const colors = ['#FACC15', '#FDE047', '#0A0A0A', '#FFFFFF']
    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 45,
      origin: { y: 0.65 },
      colors,
    })
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors })
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors })
    }, 220)
  }

  const handleWaitlistSuccess = () => {
    setCount((c) => (c ?? 0) + 1)
    fireConfetti()
  }

  const fmPct = count !== null ? Math.min((count / FM_TOTAL) * 100, 100) : 0
  const showSocialProof = count !== null && count > 10
  const remaining = count !== null ? Math.max(FM_TOTAL - count, 0) : null

  return (
    <main className="bg-white text-navy font-nunito overflow-x-hidden">
      <PageLoader />
      <MorphingCursor />
      <div className="noise-grain" aria-hidden />
      <div className="scroll-progress" />

      {/* ─────────────── SECTION 1 — HERO ─────────────── */}
      <section
        ref={heroRef}
        className="hero-wrap relative min-h-[100svh] flex flex-col justify-center items-center text-center px-5 pt-14 pb-24"
      >
        <div className="aurora">
          <div className="aurora-blob a" />
          <div className="aurora-blob b" />
          <div className="aurora-blob c" />
          <div className="dot-grid" />
        </div>

        <div className="cursor-spot" aria-hidden />

        {/* Floating ambient SVG shapes */}
        <svg className="ambient-shape float-a" style={{ top: '12%', left: '8%' }} width="60" height="60" viewBox="0 0 60 60" aria-hidden>
          <polygon points="30,4 56,30 30,56 4,30" fill="none" stroke="#FACC15" strokeWidth="1.6" opacity="0.55" />
        </svg>
        <svg className="ambient-shape float-b" style={{ top: '18%', right: '10%' }} width="110" height="110" viewBox="0 0 110 110" aria-hidden>
          <circle cx="55" cy="55" r="52" fill="none" stroke="#FACC15" strokeWidth="1.4" opacity="0.4" />
          <circle cx="55" cy="55" r="34" fill="none" stroke="#FACC15" strokeWidth="0.8" opacity="0.3" />
        </svg>
        <svg className="ambient-shape float-c" style={{ bottom: '22%', left: '12%' }} width="44" height="44" viewBox="0 0 44 44" aria-hidden>
          <g fill="#FACC15" opacity="0.55">
            <circle cx="6" cy="6" r="2.5" />
            <circle cx="22" cy="6" r="2.5" opacity="0.4" />
            <circle cx="38" cy="6" r="2.5" opacity="0.4" />
            <circle cx="6" cy="22" r="2.5" opacity="0.4" />
            <circle cx="22" cy="22" r="3" />
            <circle cx="38" cy="22" r="2.5" opacity="0.4" />
            <circle cx="6" cy="38" r="2.5" opacity="0.4" />
            <circle cx="22" cy="38" r="2.5" opacity="0.4" />
            <circle cx="38" cy="38" r="2.5" opacity="0.4" />
          </g>
        </svg>
        <svg className="ambient-shape float-d" style={{ bottom: '14%', right: '14%' }} width="32" height="32" viewBox="0 0 32 32" aria-hidden>
          <line x1="16" y1="2" x2="16" y2="30" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
          <line x1="2" y1="16" x2="30" y2="16" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        </svg>
        <svg className="ambient-shape float-e" style={{ top: '46%', right: '6%' }} width="80" height="14" viewBox="0 0 80 14" aria-hidden>
          <line x1="0" y1="7" x2="80" y2="7" stroke="#0A0A0A" strokeWidth="1.2" opacity="0.18" />
          <line x1="14" y1="2" x2="64" y2="2" stroke="#FACC15" strokeWidth="1.2" opacity="0.5" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-center gap-2.5 mb-10 animate-fade-up">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shadow-soft">
              <span className="text-amber font-black text-sm tracking-tight">BB</span>
            </div>
            <span className="font-black text-navy text-lg tracking-tight">
              BeyondBell<span className="text-amber animate-blink">.</span>
            </span>
          </div>

          <div
            className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-amber border border-amber-deep/40 text-[12px] font-black text-navy animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-navy" />
            Opening July 2026 · Founding spots closing
          </div>

          <HeadlineTypewriter />

          <p
            className="text-[17px] md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up-soft"
            style={{ animationDelay: '1.8s' }}
          >
            AI tools and a real community for CBSE, ICSE, and IGCSE schools.
          </p>

          <div
            className="animate-fade-up-soft relative inline-block"
            style={{ animationDelay: '2.0s' }}
          >
            <button
              onClick={scrollToForm}
              className="btn-primary text-[15px] md:text-base"
            >
              <span className="cta-glow" aria-hidden />
              Reserve My Spot
              <ArrowRight className="w-5 h-5" />
              <span className="cta-ring" aria-hidden />
            </button>
            <p className="mt-3 text-sm text-muted">
              Free to join. Founding pricing locked at launch.
            </p>
          </div>

          <div
            className="mt-12 bg-amber-light/90 backdrop-blur border-2 border-amber/60 rounded-2xl px-6 py-6 text-left shadow-glow animate-fade-up-soft relative"
            style={{ animationDelay: '2.2s' }}
          >
            <div className="sparkle-orbit" aria-hidden>
              <span className="spark" />
              <span className="spark" />
              <span className="spark" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 relative z-10">
              <div className="flex-1 min-w-0">
                <p className="font-black text-navy text-[17px] md:text-lg leading-snug">
                  500 Founding spots ·{' '}
                  <span className="underline-amber">₹199/month, locked for life.</span>
                </p>
              </div>
              {count !== null && (
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="font-black text-navy text-2xl tabular-nums leading-none">
                    <span key={popKey} className="counter-pop">
                      {displayCount}
                    </span>
                    <span className="text-muted text-base font-bold"> / 500</span>
                  </div>
                  {remaining !== null && remaining > 0 && (
                    <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-deep font-black mt-1">
                      <span className="live-dot" aria-hidden />
                      {remaining} left
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="progress-track relative z-10">
              <div className="progress-fill" style={{ width: `${fmPct}%` }} />
            </div>
          </div>

          {showSocialProof && (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted animate-fade-in">
              <span className="live-dot" aria-hidden />
              <strong className="text-navy">{count} educators</strong> already reserved.
            </p>
          )}
        </div>

        <div className="absolute left-0 right-0 bottom-3 marquee-mask">
          <div className="marquee text-[12px] uppercase tracking-[0.3em] text-muted/70 font-bold">
            {[...BOARDS_LOOP, ...BOARDS_LOOP, ...BOARDS_LOOP].map((b, i) => (
              <span key={i} className="flex items-center gap-12">
                {b}
                <span className="text-amber">◆</span>
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* ─────── SVG DIVIDER ─────── */}
      <div className="reveal py-8 px-5">
        <div className="svg-divider">
          <span className="line" />
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <polygon points="7,0 14,7 7,14 0,7" fill="#FACC15" />
          </svg>
          <span className="line" />
        </div>
      </div>

      {/* ─────────────── SECTION 2 — PROBLEM ─────────────── */}
      <section className="py-16 md:py-20 px-5 bg-white">
        <div className="max-w-2xl mx-auto reveal">
          <div className="section-num">
            <span>01</span>
          </div>
          <p className="section-label text-sm font-black text-amber-deep uppercase tracking-[0.22em] mb-5">
            Why This Exists
          </p>
          <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight mb-6">
            The problem isn&apos;t effort. It&apos;s <span className="underline-amber">isolation</span>.
          </h2>
          <p className="text-[17px] text-muted leading-relaxed">
            Every school leader is solving the same problems — alone. BeyondBell Circle changes that.
          </p>
        </div>
      </section>

      {/* ─────────────── SECTION 3 — TOOLS ─────────────── */}
      <section className="py-20 md:py-24 px-5 bg-amber-light relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="relative max-w-5xl mx-auto">
          <div className="reveal mb-10 text-center">
            <div className="section-num justify-center">
              <span>02</span>
            </div>
            <p className="section-label text-sm font-black text-amber-deep uppercase tracking-[0.22em] mb-4 justify-center">
              The AI Studio
            </p>
            <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight mb-3">
              Five tools. <span className="gradient-text">Built for real classrooms.</span>
            </h2>
            <span className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-white border border-amber/50 text-[12px] font-black text-navy uppercase tracking-wider">
              <span className="live-dot" aria-hidden /> Available July 2026
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {TOOLS.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} index={i} />
            ))}
          </div>

          <div className="reveal bg-white rounded-2xl border-2 border-amber/40 shadow-soft p-7 md:p-8">
            <p className="section-label text-sm font-black text-amber-deep uppercase tracking-[0.22em] mb-5">
              The Community
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                '19 structured groups by board & subject',
                'Morning Briefing — weekdays at 6:30am',
                'Tagged resource library',
                'Monthly workshops & cohorts',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-amber-deep font-black mt-0.5">→</span>
                  <span className="text-navy text-[15px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────── SVG DIVIDER ─────── */}
      <div className="reveal py-8 px-5">
        <div className="svg-divider">
          <span className="line" />
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <polygon points="7,0 14,7 7,14 0,7" fill="#FACC15" />
          </svg>
          <span className="line" />
        </div>
      </div>

      {/* ─────────────── SECTION 4 — WHO IT IS FOR ─────────────── */}
      <section className="py-16 md:py-20 px-5 bg-white">
        <div className="max-w-2xl mx-auto reveal">
          <div className="section-num">
            <span>03</span>
          </div>
          <p className="section-label text-sm font-black text-amber-deep uppercase tracking-[0.22em] mb-6">
            Who It Is For
          </p>
          <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight mb-8">
            For the educators who carry the most.
          </h2>
          <div className="space-y-3.5">
            {[
              'Principals and school leaders',
              'Academic coordinators',
              'Teachers who want to grow',
              'Counsellors and mentors',
            ].map((item, i) => (
              <div
                key={i}
                className="reveal flex items-center gap-4 group"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div
                  className="check-pop w-8 h-8 rounded-full bg-amber flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-soft"
                  style={{ '--cp-delay': `${i * 0.08 + 0.1}s` } as React.CSSProperties}
                >
                  <Check style={{ width: 16, height: 16, color: '#0A0A0A', strokeWidth: 3 }} />
                </div>
                <span className="text-navy text-[16px] md:text-[17px] leading-relaxed font-bold">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 5 — PRICING ─────────────── */}
      <section className="py-20 md:py-24 px-5 bg-amber-light">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-12 text-center">
            <div className="section-num justify-center">
              <span>04</span>
            </div>
            <p className="section-label text-sm font-black text-amber-deep uppercase tracking-[0.22em] mb-4 justify-center">
              Pricing
            </p>
            <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight">
              Start free. <span className="underline-amber">Upgrade when ready.</span>
            </h2>
          </div>

          <div className="space-y-5">
            {TIERS.map((tier, i) => (
              <div
                key={i}
                className={`tier-card reveal rounded-2xl p-6 md:p-7 border-2 bg-white border-border ${
                  tier.highlight ? 'fm' : ''
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-6 bg-navy text-amber text-[10px] md:text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lift">
                    {tier.badge}
                  </span>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  <div className="flex-shrink-0 md:w-56">
                    <h3
                      className={`font-black text-[17px] md:text-lg mb-1 ${
                        tier.highlight ? 'text-amber-deep' : 'text-navy'
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <div className="flex items-end gap-1">
                      <span className="font-black text-[32px] md:text-4xl text-navy tabular-nums leading-none">
                        {tier.price}
                      </span>
                      <span className="text-muted text-sm mb-1">{tier.period}</span>
                    </div>
                    {tier.note && (
                      <p className="text-[11px] font-black text-amber-deep mt-1.5 uppercase tracking-wider">
                        {tier.note}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-[14px] md:text-[15px] text-navy leading-relaxed">
                      {tier.what}
                    </p>
                  </div>

                  <button
                    onClick={scrollToForm}
                    className={`flex-shrink-0 font-black text-sm px-5 py-3 rounded-xl transition-all self-start md:self-center ${
                      tier.highlight
                        ? 'bg-navy text-amber hover:bg-ink shadow-soft hover:-translate-y-0.5 hover:shadow-lift'
                        : 'btn-ghost'
                    }`}
                  >
                    Reserve Spot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 6 — FOUNDER NOTE ─────────────── */}
      <section className="py-20 md:py-24 px-5 bg-navy relative overflow-hidden">
        <Quote
          className="absolute -top-2 left-4 md:left-12 text-amber/20"
          style={{ width: 120, height: 120 }}
          aria-hidden
        />
        <div className="max-w-2xl mx-auto reveal relative">
          <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-8">
            From the founder.
          </p>

          <p className="text-[17px] md:text-[19px] text-white/90 leading-relaxed">
            Every feature comes from real classroom experience. Built because too many good educators are navigating it alone.
          </p>

          <p className="mt-10 font-black text-amber text-[20px] md:text-2xl italic inline-block">
            Slow down. Think better. Teach better.
          </p>

          <div className="mt-7 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber flex items-center justify-center shadow-soft">
              <span className="text-navy font-black text-sm">TK</span>
            </div>
            <div>
              <p className="font-black text-white">Thomas Koshy</p>
              <p className="text-white/60 text-sm">Founder, BeyondBell</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 7 — WAITLIST FORM ─────────────── */}
      <section
        ref={formRef}
        className="py-20 md:py-24 px-5 bg-white relative"
        id="waitlist"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber to-transparent" />
        <div className="max-w-xl mx-auto reveal">
          <div className="text-center mb-10">
            <p className="section-label text-sm font-black text-amber-deep uppercase tracking-[0.22em] mb-4 justify-center">
              Join the waitlist.
            </p>
            <h2 className="font-black text-[28px] md:text-[36px] text-navy leading-[1.15] tracking-tight mb-3">
              Opens July 2026.
            </h2>
            <p className="text-muted text-[15px] md:text-[16px]">
              <strong className="text-navy">₹199/month locked for life</strong> for first 500.
            </p>
            {showSocialProof && (
              <p className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber border border-amber-deep/40 text-[13px] text-navy font-black">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-navy animate-pulse-glow" />
                  <span className="relative w-2 h-2 rounded-full bg-navy" />
                </span>
                {count} educators already on the list
              </p>
            )}
          </div>

          <WaitlistForm onSuccess={handleWaitlistSuccess} />

          <p className="text-center text-[12px] text-muted/80 mt-8 leading-relaxed">
            One email. The day we go live in July 2026.
          </p>
        </div>
      </section>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer className="bg-navy py-12 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
              <span className="text-navy font-black text-xs">BB</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight">
              BeyondBell<span className="text-amber">.</span>
            </span>
          </div>
          <p className="text-amber/90 text-sm italic mb-3">
            Slow down. Think better. Teach better.
          </p>
          <p className="text-white/40 text-xs">
            © 2026 BeyondBell Education OPC Private Limited &nbsp;·&nbsp;{' '}
            <a
              href="https://beyondbell.in"
              className="hover:text-amber transition-colors underline-offset-4 hover:underline"
            >
              beyondbell.in
            </a>
          </p>
          <p className="text-white/30 text-xs mt-2">
            Privacy Policy · Terms of Service
          </p>
        </div>
      </footer>

      <div className={`sticky-cta ${showSticky ? 'show' : ''}`}>
        <div className="min-w-0">
          <div className="text-[12px] text-amber font-black leading-tight">
            ₹199/month · Locked for life
          </div>
          {count !== null ? (
            <div className="text-[13px] font-black text-white truncate">
              {count} of 500 reserved
            </div>
          ) : (
            <div className="text-[13px] font-black text-white">Reserve your spot</div>
          )}
        </div>
        <button
          onClick={scrollToForm}
          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-amber text-navy font-black text-[13px] px-4 py-2.5 rounded-lg active:scale-[0.97] transition-transform"
        >
          Reserve <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </main>
  )
}
