'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  MessageCircle,
  Calendar,
  Shield,
  FileCheck,
  Lock,
  Check,
  Sparkles,
  Quote,
} from 'lucide-react'
import WaitlistForm from '@/components/WaitlistForm'

type Tool = {
  icon: typeof BookOpen
  name: string
  access: string
  desc: string
  proOnly?: boolean
}

const TOOLS: Tool[] = [
  {
    icon: BookOpen,
    name: 'Lesson Planner',
    access: 'Free: 1 trial · Paid: Unlimited',
    desc: 'Generates a complete CBSE / ICSE / IGCSE lesson plan in 60 seconds. Board-aligned. Select grade, subject, topic — done.',
  },
  {
    icon: ClipboardList,
    name: 'Question Paper Maker',
    access: 'Free: 1 trial · Paid: Unlimited',
    desc: 'Full question paper with answer key in 15 minutes. Marks allocated. Sections structured. MCQ, short answer, long answer — board-pattern aligned.',
  },
  {
    icon: MessageCircle,
    name: 'Parent Message Writer',
    access: 'Free: 1 trial · Paid: Unlimited',
    desc: '20+ situation types. The parent message you have been putting off takes 3 minutes. Tone calibrated for WhatsApp, email, or formal letter.',
  },
  {
    icon: Calendar,
    name: 'Event Planner',
    access: 'Free: 1 trial · Standard+: Unlimited',
    desc: 'Annual day, PTM, orientation, sports day — 25 event types. Complete planning pack: timeline, task matrix, communication templates, day-of checklist.',
  },
  {
    icon: Shield,
    name: 'Policy Advisor',
    access: 'Free: 1 trial · Pro only: Unlimited',
    desc: 'Ask any question about NEP 2020, CBSE byelaws, POCSO, RTE, or SQAA. Get a cited answer in plain language. No more navigating 200-page circulars alone.',
    proOnly: true,
  },
  {
    icon: FileCheck,
    name: 'SQAA Generator',
    access: 'Free: 1 trial · Pro only: Unlimited',
    desc: 'Input your school data for any CBSE SQAA domain. Get a structured evidence document, self-evaluation scores, and improvement checklist.',
    proOnly: true,
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
    what: 'Full community · Morning Briefing · 19 Groups · Resource library · 1 trial use of every AI tool',
  },
  {
    name: 'Founding Member',
    price: '₹199',
    period: '/ month',
    note: 'Locked for life · First 500 only',
    what: 'Everything in Standard · Unlimited standard AI tools · Founding Member badge · Price never increases',
    highlight: true,
    badge: 'Most Popular · First 500 Only',
  },
  {
    name: 'Standard',
    price: '₹299',
    period: '/ month',
    what: 'Unlimited Lesson Planner, Question Paper Maker, Parent Message Writer, Event Planner · Live events · Direct messages',
  },
  {
    name: 'Pro',
    price: '₹399',
    period: '/ month',
    what: 'Everything in Standard · Policy Advisor · SQAA Generator · Leadership Lounge (principals only)',
  },
  {
    name: 'School Plan',
    price: '₹1,999',
    period: '/ teacher / year',
    note: 'Minimum 5 seats',
    what: 'Standard for all teachers · Admin dashboard · Usage analytics · Bulk onboarding · GST invoice',
  },
]

const FM_TOTAL = 500
const BOARDS_LOOP = ['CBSE', 'ICSE', 'IGCSE', 'NEP-aligned', 'Real classrooms', 'Real peers']

// Renders typed text as <ink-word><ink-char/></ink-word> chunks so each
// new character animates in (ink-bloom) without re-animating earlier ones.
// Splitting by space first keeps line-break points at natural word boundaries.
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

// Three-stage typewriter for the hero headline. Stages exist so we can
// nest the second-line tail inside .underline-amber — the underline
// gradient grows naturally as that span widens, char by char.
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

  // Count-up animation for FM counter — pops once on settle
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

  // IntersectionObserver reveals
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

  // Sticky CTA visibility + scroll progress bar + aurora parallax
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

  // Pointer-tracked highlight: tool cards, tier cards, primary buttons
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const targets = document.querySelectorAll<HTMLElement>(
      '.tool-card, .tier-card, .btn-primary'
    )
    const onMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    targets.forEach((c) => c.addEventListener('pointermove', onMove as EventListener))
    return () =>
      targets.forEach((c) =>
        c.removeEventListener('pointermove', onMove as EventListener)
      )
  }, [])

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const fmPct = count !== null ? Math.min((count / FM_TOTAL) * 100, 100) : 0
  const showSocialProof = count !== null && count > 10
  const remaining = count !== null ? Math.max(FM_TOTAL - count, 0) : null

  return (
    <main className="bg-white text-navy font-nunito overflow-x-hidden">
      <div className="scroll-progress" />

      {/* ─────────────── SECTION 1 — HERO ─────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-5 pt-14 pb-24"
      >
        <div className="aurora">
          <div className="aurora-blob a" />
          <div className="aurora-blob b" />
          <div className="aurora-blob c" />
          <div className="dot-grid" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto w-full">
          {/* logo lockup */}
          <div className="flex items-center justify-center gap-2.5 mb-10 animate-fade-up">
            <div className="w-10 h-10 rounded-xl bg-navy-fade flex items-center justify-center shadow-soft">
              <span className="text-white font-black text-sm tracking-tight">BB</span>
            </div>
            <span className="font-black text-navy text-lg tracking-tight">
              BeyondBell<span className="text-amber animate-blink">.</span>
            </span>
          </div>

          {/* tiny pill */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-amber-light border border-amber/30 text-[12px] font-bold text-navy animate-fade-up"
            style={{ animationDelay: '0.05s' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber" />
            Opening July 2026 · Reserve before Founding Member spots close
          </div>

          {/* headline (typewriter) */}
          <HeadlineTypewriter />

          <p
            className="text-[17px] md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-3 animate-fade-up-soft"
            style={{ animationDelay: '1.8s' }}
          >
            Not a WhatsApp group. Not a generic AI tool. Something that actually
            understands your board, your classroom, and your week.
          </p>
          <p
            className="text-[15px] md:text-[17px] text-muted leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up-soft"
            style={{ animationDelay: '2.0s' }}
          >
            BeyondBell Circle is an AI-powered professional community for educators
            and school leaders across CBSE, ICSE, and IGCSE schools. Six tools built
            for real classrooms. A community built for real thinking.
          </p>

          <div
            className="animate-fade-up-soft"
            style={{ animationDelay: '2.2s' }}
          >
            <button
              onClick={scrollToForm}
              className="btn-primary text-[15px] md:text-base"
            >
              Reserve My Spot
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-sm text-muted">
              Free to join the waitlist. Founding Member pricing when we launch.
            </p>
          </div>

          {/* FM urgency block */}
          <div
            className="mt-12 bg-amber-light/80 backdrop-blur border border-amber/30 rounded-2xl px-6 py-6 text-left shadow-soft animate-fade-up-soft"
            style={{ animationDelay: '2.4s' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <p className="font-black text-navy text-[17px] md:text-lg leading-snug">
                  500 Founding Member spots.{' '}
                  <span className="text-amber">₹199/month.</span> Locked for life.
                </p>
                <p className="text-[13px] md:text-sm text-muted mt-1">
                  Once 500 is reached, this pricing is gone permanently. After that,
                  Standard is ₹299/month.
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
                    <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber font-black mt-1">
                      <span className="live-dot" aria-hidden />
                      {remaining} spots left
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${fmPct}%` }} />
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-muted">0</span>
              <span className="text-[11px] font-black text-navy tracking-wide">
                500 — then gone permanently
              </span>
            </div>
          </div>

          {showSocialProof && (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted animate-fade-in">
              <span className="live-dot" aria-hidden />
              Join <strong className="text-navy">{count} educators</strong> from
              CBSE, ICSE, and IGCSE schools already on the waitlist.
            </p>
          )}
        </div>

        {/* boards marquee */}
        <div className="absolute left-0 right-0 bottom-3 marquee-mask">
          <div className="marquee text-[12px] uppercase tracking-[0.3em] text-muted/70 font-bold">
            {[...BOARDS_LOOP, ...BOARDS_LOOP, ...BOARDS_LOOP].map((b, i) => (
              <span key={i} className="flex items-center gap-12">
                {b}
                <span className="text-amber/60">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 2 — PROBLEM ─────────────── */}
      <section className="py-20 md:py-28 px-5 bg-white">
        <div className="max-w-2xl mx-auto reveal">
          <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-6">
            Why This Exists
          </p>
          <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight mb-8">
            There is no shortage of effort in Indian schools.
          </h2>
          <div className="space-y-4 text-[17px] text-muted leading-relaxed">
            <p>Teachers are working harder than ever.</p>
            <p>Leaders are managing more than they were trained for.</p>
            <p>
              Schools are navigating change — boards, AI, parent expectations, NEP —
              with no real support structure.
            </p>
            <p className="font-black text-navy text-[20px] md:text-[22px] pt-2">
              The problem is not effort. The problem is{' '}
              <span className="underline-amber">isolation</span>.
            </p>
            <p>
              Every school leader I know is solving the same problems — alone. There
              is no shared thinking. No trusted peer group. No space to reflect
              before deciding.
            </p>
            <p className="font-bold text-navy">
              That is what BeyondBell Circle is built to change.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 3 — WHAT IT IS ─────────────── */}
      <section className="py-20 md:py-28 px-5 bg-[#F9FAFB] relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="relative max-w-5xl mx-auto">
          <div className="reveal mb-14">
            <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-4">
              What It Is
            </p>
            <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight mb-5">
              BeyondBell Circle is a professional community for educators.
            </h2>
            <div className="flex flex-wrap gap-2.5 mb-5">
              {['Not a WhatsApp group.', 'Not a course platform.', 'Not a content dump.'].map(
                (t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-border text-muted text-sm font-bold"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
            <p className="font-bold text-navy text-lg md:text-xl max-w-3xl leading-snug">
              A structured, high-trust space where school leaders and educators
              think together — with real tools, real frameworks, and real peers.
            </p>
          </div>

          <div className="reveal mb-6">
            <div className="flex items-baseline justify-between flex-wrap gap-3">
              <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em]">
                The AI Studio — Six Tools
              </p>
              <span className="text-xs font-bold text-muted">
                Try every tool once for free.
              </span>
            </div>
            <p className="text-muted text-[15px] mt-3 mb-7 max-w-2xl">
              Free members get one trial use of every tool. After the trial, each
              tool shows a lock icon with the upgrade prompt. Paying members get
              unlimited access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {TOOLS.map((t, i) => {
              const Icon = t.icon
              return (
                <div
                  key={i}
                  className="tool-card reveal"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="tool-icon w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
                        <Icon style={{ width: 19, height: 19, color: '#D4A017' }} />
                      </div>
                      <h3 className="font-black text-navy text-[16px] md:text-[17px] truncate">
                        {t.name}
                      </h3>
                    </div>
                    {t.proOnly ? (
                      <span className="inline-flex items-center gap-1 bg-navy/[0.07] text-navy text-[11px] font-black px-2 py-1 rounded-full flex-shrink-0 uppercase tracking-wide">
                        <Lock style={{ width: 11, height: 11 }} /> Pro
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber/12 text-amber-deep text-[11px] font-black px-2 py-1 rounded-full flex-shrink-0 uppercase tracking-wide">
                        Try Free
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-black text-amber mb-2 tracking-wide">
                    {t.access}
                  </p>
                  <p className="text-[14px] text-muted leading-relaxed">{t.desc}</p>
                  <div className="tool-arrow mt-3 inline-flex items-center gap-1.5 text-navy text-xs font-black uppercase tracking-wider">
                    Reserve to unlock <ArrowRight style={{ width: 13, height: 13 }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="reveal bg-white rounded-2xl border border-border shadow-soft p-7 md:p-8">
            <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-5">
              The Community
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                '19 structured groups — by board, subject, and role',
                'A Morning Briefing every weekday at 6:30am',
                'A resource library tagged by board, grade, and subject',
                'Monthly workshops and cohort programmes',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-amber font-black mt-0.5">→</span>
                  <span className="text-navy text-[15px]">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 pt-4 mt-4 border-t border-border">
              <span className="text-amber font-black mt-0.5">→</span>
              <span className="text-muted italic text-[15px]">
                No noise. No forwarded articles. No motivational quotes.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 4 — WHO IT IS FOR ─────────────── */}
      <section className="py-20 md:py-28 px-5 bg-white">
        <div className="max-w-2xl mx-auto reveal">
          <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-6">
            Who It Is For
          </p>
          <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight mb-8">
            Built for the educators who carry the most.
          </h2>
          <div className="space-y-3.5">
            {[
              'Principals and school leaders navigating academic and institutional change',
              'Academic coordinators building systems with limited support',
              'Teachers who want to grow professionally — without the noise',
              'Counsellors and mentors working at the edges of student wellbeing',
            ].map((item, i) => (
              <div
                key={i}
                className="reveal flex items-start gap-4 group"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div
                  className="check-pop w-7 h-7 rounded-full bg-amber/15 flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber/30"
                  style={{ '--cp-delay': `${i * 0.08 + 0.1}s` } as React.CSSProperties}
                >
                  <Check style={{ width: 14, height: 14, color: '#D4A017' }} />
                </div>
                <span className="text-navy text-[16px] md:text-[17px] leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-9 italic text-muted text-[16px]">
            If you run a school, coordinate a department, or teach in a classroom —{' '}
            <strong className="text-navy not-italic">this is built for you.</strong>
          </p>
        </div>
      </section>

      {/* ─────────────── SECTION 5 — PRICING ─────────────── */}
      <section className="py-20 md:py-28 px-5 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-14 text-center">
            <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-4">
              Pricing
            </p>
            <h2 className="font-black text-[28px] md:text-[40px] text-navy leading-[1.15] tracking-tight mb-3">
              Simple pricing. Built for working educators.
            </h2>
            <p className="text-muted text-[16px] md:text-[17px]">
              Start free. Trial every tool once. Upgrade when you are ready.
            </p>
          </div>

          <div className="space-y-5">
            {TIERS.map((tier, i) => (
              <div
                key={i}
                className={`tier-card reveal rounded-2xl p-6 md:p-7 border bg-white border-border ${
                  tier.highlight ? 'fm' : ''
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-6 bg-navy text-white text-[10px] md:text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lift">
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
                        ? 'bg-navy text-white hover:bg-ink shadow-soft hover:-translate-y-0.5 hover:shadow-lift'
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
      <section className="py-20 md:py-28 px-5 bg-amber-warm relative overflow-hidden">
        <Quote
          className="absolute -top-2 left-4 md:left-12 text-amber/15"
          style={{ width: 120, height: 120 }}
          aria-hidden
        />
        <div className="max-w-2xl mx-auto reveal relative">
          <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-8">
            A note from the founder.
          </p>

          <div className="space-y-5 text-[16px] md:text-[18px] text-navy leading-relaxed">
            <p>I have spent years running schools. Not advising them — running them.</p>
            <p>
              I know what it feels like to make decisions without a trusted peer to
              think with. I know what a staffroom looks like at 4pm on a Friday
              before results week. I know the gap between what a CBSE circular says
              and what it means for a teacher on Monday morning.
            </p>
            <p>
              BeyondBell Circle exists because that gap is too large — and too many
              good educators are navigating it alone.
            </p>
            <p>
              This is not a platform built in isolation from classrooms. Every
              feature, every tool, every community decision comes from real school
              experience.
            </p>
          </div>

          <p className="mt-10 font-black text-navy text-[20px] md:text-2xl italic underline-amber inline-block">
            Slow down. Think better. Teach better.
          </p>

          <div className="mt-7 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-navy-fade flex items-center justify-center shadow-soft">
              <span className="text-white font-black text-sm">TK</span>
            </div>
            <div>
              <p className="font-black text-navy">Thomas Koshy</p>
              <p className="text-muted text-sm">Founder, BeyondBell</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── SECTION 7 — WAITLIST FORM ─────────────── */}
      <section
        ref={formRef}
        className="py-20 md:py-28 px-5 bg-white relative"
        id="waitlist"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
        <div className="max-w-xl mx-auto reveal">
          <div className="text-center mb-10">
            <p className="section-label text-sm font-black text-amber uppercase tracking-[0.22em] mb-4">
              Join the waitlist.
            </p>
            <h2 className="font-black text-[28px] md:text-[36px] text-navy leading-[1.15] tracking-tight mb-3">
              BeyondBell Circle opens in July 2026.
            </h2>
            <p className="text-muted text-[15px] md:text-[16px]">
              <strong className="text-navy">
                Founding Members get ₹199/month — locked for life.
              </strong>{' '}
              After 500, Standard is ₹299/month.
            </p>
            {showSocialProof && (
              <p className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-light border border-amber/30 text-[13px] text-navy font-bold">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-amber animate-pulse-glow" />
                  <span className="relative w-2 h-2 rounded-full bg-amber" />
                </span>
                Join {count} educators already on the waitlist
              </p>
            )}
          </div>

          <WaitlistForm onSuccess={() => setCount((c) => (c ?? 0) + 1)} />

          <p className="text-center text-[12px] text-muted/80 mt-8 leading-relaxed">
            We&apos;ll send you one email — when BeyondBell Circle goes live in July
            2026. Until then: complete silence.
          </p>
        </div>
      </section>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer className="bg-navy py-12 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-black text-xs">BB</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight">
              BeyondBell<span className="text-amber">.</span>
            </span>
          </div>
          <p className="text-white/60 text-sm italic mb-3">
            Slow down. Think better. Teach better.
          </p>
          <p className="text-white/40 text-xs">
            © 2026 BeyondBell Education OPC Private Limited &nbsp;·&nbsp;{' '}
            <a
              href="https://beyondbell.in"
              className="hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              beyondbell.in
            </a>
          </p>
          <p className="text-white/30 text-xs mt-2">
            Privacy Policy · Terms of Service
          </p>
        </div>
      </footer>

      {/* ─────────────── STICKY MOBILE CTA ─────────────── */}
      <div className={`sticky-cta ${showSticky ? 'show' : ''}`}>
        <div className="min-w-0">
          <div className="text-[12px] text-white/70 font-bold leading-tight">
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
