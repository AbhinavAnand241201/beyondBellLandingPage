this file contains all the changes needed , as the client has given an updated doc , and this change has initiated a series of changes and so , a chain of reacitons happening , which makes the website requiring a huge rebuild , and a series of chnages in the flow and the build ,


see whats written below and closely execute as specified , dont use ur extra brain  


Every correction made from client docs:
What was wrongWhat's now correctYellow #F5A400 everywhereNavy #1A2D4A headlines/buttons, Amber Gold #D4A017 accentsPoppins + InterNunito exclusivelyNavbar presentNo navbar at all — single pageGoogle OAuth modalPlain 4-field form — name, email, role (dropdown), board (dropdown)Redirected to /waitlist-successForm replaces itself inline — no redirect, no reloadTool names were wrongLesson Planner, Question Paper Maker, Parent Message Writer, Event Planner,  
Policy Advisor, SQAA GeneratorWrong pricingFree / ₹199 FM / ₹299 Standard / ₹399 Pro / ₹1,999 School PlanFree tier had daily limits1 trial use per tool, everNo FM live counterReal-time counter + progress bar from SupabaseNo social proofDynamic count shown when > 10 signupsCTA said "Join Waitlist""Reserve My Spot →"No Founder Note sectionFull founder note with exact copyNo Pricing sectionFull pricing table with all 5 tiersFooter was generic"© 2026 BeyondBell Education OPC Private Limited" + tagline 











# BeyondBell Circle — Waitlist Landing Page (v3)

Built strictly to client spec v3 (April 2026).

---

## Route Map

```
/                 → app/page.tsx               (single-page landing)
/api/waitlist     → app/api/waitlist/route.ts  (form submission handler)
/api/waitlist-count → app/api/waitlist-count/route.ts (live counter)
/* unmatched      → app/not-found.tsx          (404)
```

No navigation menu. No auth. No redirects. Single page — exactly as specified.

---

## What's different from previous versions

| Spec requirement | This version |
|---|---|
| Font: Nunito / Nunito Sans | ✅ |
| Colours: Navy `#1A2D4A` + Amber `#D4A017` | ✅ |
| No navbar | ✅ |
| No Google OAuth — plain form | ✅ |
| Tool names from v3 (Lesson Planner etc.) | ✅ |
| Pricing: Free / ₹199 FM / ₹299 / ₹399 / School Plan | ✅ |
| Free tier: 1 trial use per tool | ✅ |
| FM live counter + progress bar from Supabase | ✅ |
| Social proof count (shows when > 10 signups) | ✅ |
| Form → inline confirmation, no redirect | ✅ |
| Exact copy from v3 doc | ✅ |
| Pricing section on page | ✅ |
| Founder Note section | ✅ |
| Footer: BeyondBell Education OPC Private Limited | ✅ |

---

## Setup

### 1. Install
```bash
npm install
```

### 2. Create Supabase project
https://app.supabase.com → New Project → region: Singapore

### 3. Run the SQL
Paste `supabase_setup.sql` into Supabase → SQL Editor → Run

### 4. Environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          # from Settings → API → anon public
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # from Settings → API → service_role SECRET

# Optional — PostHog analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` is a **secret** key — never prefix it with `NEXT_PUBLIC_`.
> It only lives on the server (used in the API route). Never expose it in the browser.

### 5. Run
```bash
npm run dev
```

Open http://localhost:3000

Test the form — submit with any name/email/role/board.
Check Supabase → Table Editor → `waitlist` — you should see the row.

---

## Deploy (Vercel)

```bash
git init && git add . && git commit -m "beyondbell waitlist v3"
# push to GitHub, then import on vercel.com
```

Add all 3 env vars in Vercel dashboard (Settings → Environment Variables).
`SUPABASE_SERVICE_ROLE_KEY` should be set for **Production** only (not exposed to preview).

---

## Viewing signups

In Supabase → SQL Editor:
```sql
-- All signups
select full_name, email, role, board, created_at
from waitlist order by created_at desc;

-- Count by board
select board, count(*) from waitlist group by board order by count desc;

-- Founding member spots remaining
select 500 - count(*) as fm_spots_remaining from waitlist;
```

---

## Launch emails

See the `beyondbell-launch` folder for the Supabase Edge Function that
fires all launch emails via Resend when you run:
```sql
UPDATE platform_config SET launched = true WHERE id = 1;
```





'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, BookOpen, ClipboardList, MessageCircle,
  Calendar, Shield, FileCheck, Lock, Check, Star
} from 'lucide-react'
import WaitlistForm from '@/components/WaitlistForm'

// ─── Static data — all copy taken directly from client v3 doc ────────────────

const TOOLS = [
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

const TIERS = [
  {
    name: 'Free',
    price: '₹0',
    period: '/ month',
    what: 'Full community · Morning Briefing · 19 Groups · Resource library · 1 trial use of every AI tool',
    highlight: false,
    badge: null,
  },
  {
    name: 'Founding Member',
    price: '₹199',
    period: '/ month',
    note: 'Locked for life · First 500 only',
    what: 'Everything in Standard · Unlimited standard AI tools · Founding Member badge · Price never increases',
    highlight: true,
    badge: 'First 500 Only',
  },
  {
    name: 'Standard',
    price: '₹299',
    period: '/ month',
    what: 'Unlimited Lesson Planner, Question Paper Maker, Parent Message Writer, Event Planner · Live events · Direct messages',
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '₹399',
    period: '/ month',
    what: 'Everything in Standard · Policy Advisor · SQAA Generator · Leadership Lounge (principals only)',
    highlight: false,
    badge: null,
  },
  {
    name: 'School Plan',
    price: '₹1,999',
    period: '/ teacher / year',
    note: 'Minimum 5 seats',
    what: 'Standard for all teachers · Admin dashboard · Usage analytics · Bulk onboarding · GST invoice',
    highlight: false,
    badge: null,
  },
]

const FM_TOTAL = 500

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [count, setCount]       = useState<number | null>(null)
  const formRef                 = useRef<HTMLDivElement>(null)

  // Fetch live waitlist count
  useEffect(() => {
    fetch('/api/waitlist-count')
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => setCount(0))
  }, [])

  // Scroll-reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const fmPct = count !== null ? Math.min((count / FM_TOTAL) * 100, 100) : 0
  const showSocialProof = count !== null && count > 10

  return (
    <main className="bg-white text-navy font-nunito overflow-x-hidden">

      {/* ══ SECTION 1 — ABOVE THE FOLD ══════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-5 pt-16 pb-20 relative overflow-hidden">

        {/* Subtle warm background wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#FFF9EC,transparent)]" />

        <div className="relative z-10 max-w-3xl mx-auto w-full">

          {/* Logo mark */}
          <div className="flex items-center justify-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
              <span className="text-white font-black text-sm">BB</span>
            </div>
            <span className="font-black text-navy text-lg tracking-tight">
              BeyondBell<span className="text-amber">.</span>
            </span>
          </div>

          {/* Headline — exact copy from v3 */}
          <h1 className="font-black text-[40px] md:text-[52px] lg:text-[60px] text-navy leading-[1.1] mb-6 animate-fade-up">
            Finally. A professional home<br />
            <span className="underline-amber">built for Indian school educators.</span>
          </h1>

          {/* Subheadline — exact copy from v3 */}
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Not a WhatsApp group. Not a generic AI tool. Something that actually understands your board, your classroom, and your week.
          </p>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            BeyondBell Circle is an AI-powered professional community for educators and school leaders across CBSE, ICSE, and IGCSE schools. Six tools built for real classrooms. A community built for real thinking.
          </p>

          {/* Primary CTA */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2.5 bg-navy text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-[#15233a] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Reserve My Spot
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-sm text-muted">
              Free to join the waitlist. Founding Member pricing when we launch.
            </p>
          </div>

          {/* ── Founding Member urgency block ── */}
          <div className="mt-12 bg-amber-light border border-amber/30 rounded-2xl px-6 py-6 text-left animate-fade-up" style={{ animationDelay: '0.3s' }}>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <div>
                <p className="font-black text-navy text-lg">
                  500 Founding Member spots. <span className="text-amber">₹199/month.</span> Locked for life.
                </p>
                <p className="text-sm text-muted mt-0.5">
                  After that, Standard is ₹299/month.
                </p>
              </div>
              {count !== null && (
                <div className="text-right flex-shrink-0">
                  <span className="font-black text-navy text-xl">{count}</span>
                  <span className="text-muted text-sm"> / 500 claimed</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-white rounded-full overflow-hidden border border-amber/20">
              <div
                className="h-full bg-amber rounded-full progress-bar transition-all duration-1000"
                style={{ width: `${fmPct}%` }}
              />
            </div>

            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-muted">0</span>
              <span className="text-xs font-bold text-navy">500 — then gone permanently</span>
            </div>
          </div>

          {/* Social proof — shown only once > 10 */}
          {showSocialProof && (
            <p className="mt-5 text-sm text-muted animate-fade-in">
              Join <strong className="text-navy">{count} educators</strong> from CBSE, ICSE, and IGCSE schools already on the waitlist.
            </p>
          )}
        </div>
      </section>

      {/* ══ SECTION 2 — THE PROBLEM ═════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 bg-white">
        <div className="max-w-2xl mx-auto reveal">
          <p className="text-sm font-bold text-amber uppercase tracking-widest mb-6">Why This Exists</p>
          <h2 className="font-black text-[28px] md:text-[36px] text-navy leading-tight mb-6">
            There is no shortage of effort in Indian schools.
          </h2>
          {/* Exact copy from client doc */}
          <div className="space-y-4 text-[17px] text-muted leading-relaxed">
            <p>Teachers are working harder than ever.</p>
            <p>Leaders are managing more than they were trained for.</p>
            <p>Schools are navigating change — boards, AI, parent expectations, NEP — with no real support structure.</p>
            <p className="font-bold text-navy text-[20px]">The problem is not effort. The problem is isolation.</p>
            <p>Every school leader I know is solving the same problems — alone. There is no shared thinking. No trusted peer group. No space to reflect before deciding.</p>
            <p className="font-bold text-navy">That is what BeyondBell Circle is built to change.</p>
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — WHAT IT IS ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto">

          <div className="reveal mb-14">
            <p className="text-sm font-bold text-amber uppercase tracking-widest mb-4">What It Is</p>
            <h2 className="font-black text-[28px] md:text-[36px] text-navy leading-tight mb-5">
              BeyondBell Circle is a professional community for educators.
            </h2>
            <div className="space-y-1 text-[17px] text-muted">
              {['Not a WhatsApp group.', 'Not a course platform.', 'Not a content dump.'].map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
            <p className="mt-4 font-bold text-navy text-lg">
              A structured, high-trust space where school leaders and educators think together — with real tools, real frameworks, and real peers.
            </p>
          </div>

          {/* ── The AI Studio ── */}
          <div className="reveal mb-4">
            <p className="text-sm font-bold text-amber uppercase tracking-widest mb-2">The AI Studio — Six Tools</p>
            <p className="text-muted text-sm mb-6">
              Free members get one trial use of every tool. After the trial, each tool shows a lock icon with the upgrade prompt. Paying members get unlimited access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {TOOLS.map((t, i) => {
              const Icon = t.icon
              return (
                <div
                  key={i}
                  className="tool-card bg-white rounded-xl p-5 border border-border reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4.5 h-4.5 text-amber" style={{ width: 18, height: 18 }} />
                      </div>
                      <h3 className="font-bold text-navy text-[16px]">{t.name}</h3>
                    </div>
                    {t.proOnly && (
                      <span className="inline-flex items-center gap-1 bg-navy/8 text-navy text-xs font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(26,45,74,0.08)' }}>
                        <Lock style={{ width: 11, height: 11 }} /> Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-amber mb-2">{t.access}</p>
                  <p className="text-sm text-muted leading-relaxed">{t.desc}</p>
                </div>
              )
            })}
          </div>

          {/* ── The Community ── */}
          <div className="reveal bg-white rounded-2xl border border-border p-7">
            <p className="text-sm font-bold text-amber uppercase tracking-widest mb-4">The Community</p>
            <div className="space-y-2.5">
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
              <div className="flex items-start gap-3 pt-1">
                <span className="text-amber font-black mt-0.5">→</span>
                <span className="text-muted italic text-[15px]">No noise. No forwarded articles. No motivational quotes.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — WHO IT IS FOR ═══════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 bg-white">
        <div className="max-w-2xl mx-auto reveal">
          <p className="text-sm font-bold text-amber uppercase tracking-widest mb-6">Who It Is For</p>
          <h2 className="font-black text-[28px] md:text-[36px] text-navy leading-tight mb-8">
            Built for the educators who carry the most.
          </h2>
          <div className="space-y-4">
            {[
              'Principals and school leaders navigating academic and institutional change',
              'Academic coordinators building systems with limited support',
              'Teachers who want to grow professionally — without the noise',
              'Counsellors and mentors working at the edges of student wellbeing',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-amber/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check style={{ width: 13, height: 13, color: '#D4A017' }} />
                </div>
                <span className="text-navy text-[17px]">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 italic text-muted text-[16px]">
            If you run a school, coordinate a department, or teach in a classroom —{' '}
            <strong className="text-navy not-italic">this is built for you.</strong>
          </p>
        </div>
      </section>

      {/* ══ SECTION 5 — PRICING ════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-12 text-center">
            <p className="text-sm font-bold text-amber uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="font-black text-[28px] md:text-[36px] text-navy mb-3">
              Simple pricing. Built for working educators.
            </h2>
            <p className="text-muted text-[17px]">
              Start free. Trial every tool once. Upgrade when you are ready.
            </p>
          </div>

          <div className="space-y-4">
            {TIERS.map((tier, i) => (
              <div
                key={i}
                className={`reveal rounded-2xl p-6 border relative ${
                  tier.highlight
                    ? 'bg-amber-light border-amber/40'
                    : 'bg-white border-border'
                }`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-5 bg-navy text-white text-xs font-bold px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-shrink-0 w-48">
                    <h3 className={`font-black text-lg mb-0.5 ${tier.highlight ? 'text-amber' : 'text-navy'}`}>
                      {tier.name}
                    </h3>
                    <div className="flex items-end gap-1">
                      <span className="font-black text-3xl text-navy">{tier.price}</span>
                      <span className="text-muted text-sm mb-1">{tier.period}</span>
                    </div>
                    {tier.note && (
                      <p className="text-xs font-bold text-amber mt-1">{tier.note}</p>
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="text-[15px] text-navy leading-relaxed">{tier.what}</p>
                  </div>

                  <button
                    onClick={scrollToForm}
                    className="flex-shrink-0 bg-navy text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#15233a] transition-all self-start"
                  >
                    Reserve Spot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — FOUNDER NOTE ════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-5 bg-amber-warm">
        <div className="max-w-2xl mx-auto reveal">
          <p className="text-sm font-bold text-amber uppercase tracking-widest mb-8">A note from the founder.</p>

          <div className="space-y-5 text-[17px] text-navy leading-relaxed">
            <p>I have spent years running schools. Not advising them — running them.</p>
            <p>I know what it feels like to make decisions without a trusted peer to think with. I know what a staffroom looks like at 4pm on a Friday before results week. I know the gap between what a CBSE circular says and what it means for a teacher on Monday morning.</p>
            <p>BeyondBell Circle exists because that gap is too large — and too many good educators are navigating it alone.</p>
            <p>This is not a platform built in isolation from classrooms. Every feature, every tool, every community decision comes from real school experience.</p>
          </div>

          <p className="mt-8 font-black text-navy text-xl italic">Slow down. Think better. Teach better.</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center">
              <span className="text-white font-black text-sm">TK</span>
            </div>
            <div>
              <p className="font-bold text-navy">Thomas Koshy</p>
              <p className="text-muted text-sm">Founder, BeyondBell</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 7 — WAITLIST FORM ═══════════════════════════════════════ */}
      <section ref={formRef} className="py-20 md:py-28 px-5 bg-white" id="waitlist">
        <div className="max-w-xl mx-auto reveal">

          {/* Intro */}
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-amber uppercase tracking-widest mb-4">Join the waitlist.</p>
            <h2 className="font-black text-[28px] md:text-[34px] text-navy mb-3">
              BeyondBell Circle opens in July 2026.
            </h2>
            <p className="text-muted text-[16px]">
              <strong className="text-navy">Founding Members get ₹199/month — locked for life.</strong>{' '}
              After 500, Standard is ₹299/month.
            </p>
            {showSocialProof && (
              <p className="mt-3 text-sm text-muted">
                Join <strong className="text-navy">{count} educators</strong> from CBSE, ICSE, and IGCSE schools already on the waitlist.
              </p>
            )}
          </div>

          {/* The form component */}
          <WaitlistForm onSuccess={() => setCount((c) => (c ?? 0) + 1)} />
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="bg-navy py-10 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
              <span className="text-white font-black text-xs">BB</span>
            </div>
            <span className="text-white font-bold text-sm">BeyondBell</span>
          </div>
          <p className="text-white/50 text-sm italic mb-3">Slow down. Think better. Teach better.</p>
          <p className="text-white/30 text-xs">
            © 2026 BeyondBell Education OPC Private Limited &nbsp;·&nbsp;{' '}
            <a href="https://beyondbell.in" className="hover:text-white/60 transition-colors">beyondbell.in</a>
          </p>
          <p className="text-white/20 text-xs mt-2">
            Privacy Policy · Terms of Service
          </p>
        </div>
      </footer>

    </main>
  )
}




'use client'

/**
 * WaitlistForm
 *
 * Per client v3 spec:
 * - Fields: Full Name, Email, Role (dropdown), School Board (dropdown)
 * - Submit = "Reserve My Spot →"
 * - On success: form replaces itself with confirmation message INLINE — no redirect, no reload
 * - Fine print below button: "No spam. No noise. Just updates on BeyondBell Circle when they matter."
 * - Stores: name, email, role, board in Supabase via /api/waitlist
 * - Fires PostHog event via API route
 */

import { useState, FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

const ROLES  = ['Principal', 'Vice Principal', 'Coordinator', 'Teacher', 'Counsellor', 'Other']
const BOARDS = ['CBSE', 'ICSE', 'IGCSE', 'Other']

type Status = 'idle' | 'loading' | 'success' | 'already' | 'error'

interface Props {
  onSuccess?: () => void
}

export default function WaitlistForm({ onSuccess }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    email:     '',
    role:      '',
    board:     '',
  })

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    // Basic client-side check
    if (!form.full_name.trim() || !form.email.trim() || !form.role || !form.board) {
      setErrMsg('Please fill in all fields.')
      setStatus('error')
      return
    }

    try {
      const res  = await fetch('/api/waitlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrMsg(data.message ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      if (data.already) {
        setStatus('already')
        return
      }

      setStatus('success')
      onSuccess?.()

    } catch {
      setErrMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  // ── POST-SUBMIT CONFIRMATION — replaces form inline, no redirect ──────────
  if (status === 'success') {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 style={{ width: 34, height: 34, color: '#D4A017' }} />
        </div>
        {/* Exact copy from client v3 Section 8 */}
        <h3 className="font-black text-2xl text-navy mb-3">You're on the list.</h3>
        <p className="text-muted text-[16px] leading-relaxed">
          We'll reach out before BeyondBell Circle opens.<br />
          Until then —{' '}
          <em className="font-bold text-navy not-italic">Slow down. Think better.</em>
        </p>
      </div>
    )
  }

  // Already on list
  if (status === 'already') {
    return (
      <div className="text-center py-10 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 style={{ width: 34, height: 34, color: '#D4A017' }} />
        </div>
        <h3 className="font-black text-2xl text-navy mb-3">You're already on the list.</h3>
        <p className="text-muted text-[16px]">
          We have your details. We'll be in touch before we open.
        </p>
      </div>
    )
  }

  // ── FORM ─────────────────────────────────────────────────────────────────
  const inputCls =
    'w-full border border-border rounded-lg px-4 py-3 text-navy text-[15px] font-nunito bg-white focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all placeholder:text-muted/60'

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-bold text-navy mb-1.5">Full Name</label>
        <input
          type="text"
          value={form.full_name}
          onChange={set('full_name')}
          placeholder="e.g. Priya Sharma"
          className={inputCls}
          required
          disabled={status === 'loading'}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-navy mb-1.5">Email Address</label>
        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="e.g. priya@school.edu.in"
          className={inputCls}
          required
          disabled={status === 'loading'}
        />
      </div>

      {/* Role dropdown */}
      <div>
        <label className="block text-sm font-bold text-navy mb-1.5">Your Role</label>
        <select
          value={form.role}
          onChange={set('role')}
          className={`${inputCls} cursor-pointer`}
          required
          disabled={status === 'loading'}
        >
          <option value="" disabled>Select your role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Board dropdown — v3: CBSE / ICSE / IGCSE / Other */}
      <div>
        <label className="block text-sm font-bold text-navy mb-1.5">School Board</label>
        <select
          value={form.board}
          onChange={set('board')}
          className={`${inputCls} cursor-pointer`}
          required
          disabled={status === 'loading'}
        >
          <option value="" disabled>Select your board</option>
          {BOARDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {status === 'error' && errMsg && (
        <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {errMsg}
        </p>
      )}

      {/* Submit — exact label from v3 */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2.5 bg-navy text-white font-bold text-base py-4 rounded-xl hover:bg-[#15233a] transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Reserving your spot…
          </>
        ) : (
          <>
            Reserve My Spot
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Fine print — exact copy from v3 */}
      <p className="text-center text-xs text-muted pt-1">
        No spam. No noise. Just updates on BeyondBell Circle when they matter.
      </p>
    </form>
  )
}






/**
 * POST /api/waitlist
 *
 * Receives the waitlist form, validates fields,
 * inserts into Supabase, returns JSON.
 * No OAuth. No redirect. Pure form-to-database.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS on insert
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ROLES  = ['Principal', 'Vice Principal', 'Coordinator', 'Teacher', 'Counsellor', 'Other']
const BOARDS = ['CBSE', 'ICSE', 'IGCSE', 'Other']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, role, board } = body

    // ── Validation ────────────────────────────────────────────────────────
    if (!full_name?.trim())         return err('Full name is required.')
    if (!email?.trim())             return err('Email address is required.')
    if (!isValidEmail(email))       return err('Please enter a valid email address.')
    if (!ROLES.includes(role))      return err('Please select your role.')
    if (!BOARDS.includes(board))    return err('Please select your school board.')

    // ── Insert into Supabase ──────────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({
        full_name: full_name.trim(),
        email:     email.trim().toLowerCase(),
        role,
        board,
        notified:  false,
      })

    if (dbError) {
      // Unique violation = already on list
      if (dbError.code === '23505') {
        return NextResponse.json(
          { success: true, already: true },
          { status: 200 }
        )
      }
      console.error('[waitlist] DB error:', dbError.message)
      return err('Something went wrong. Please try again.')
    }

    // ── PostHog server-side event (fire and forget) ───────────────────────
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (posthogKey) {
      fetch('https://app.posthog.com/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key:    posthogKey,
          event:      'form_submitted',
          distinct_id: email.trim().toLowerCase(),
          properties: {
            role,
            board,
            timestamp: new Date().toISOString(),
            source:    'waitlist_page',
          },
        }),
      }).catch(() => {}) // non-fatal
    }

    return NextResponse.json({ success: true, already: false }, { status: 201 })

  } catch (e) {
    console.error('[waitlist] Unexpected error:', e)
    return err('Something went wrong. Please try again.')
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function err(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}





-- ═══════════════════════════════════════════════════════════════════════════
-- BeyondBell Circle — Supabase Setup SQL
-- Run this entire file in Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════


-- ── 1. Waitlist table ─────────────────────────────────────────────────────────
-- Stores form submissions: name, email, role, board
-- No auth required — plain form submission

create table if not exists public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  full_name   text        not null,
  email       text        unique not null,
  role        text        not null,   -- Principal / VP / Coordinator / Teacher / Counsellor / Other
  board       text        not null,   -- CBSE / ICSE / IGCSE / Other
  notified    boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.waitlist enable row level security;

-- Only service role can read/write (used by the API route with service key)
create policy "Service role full access"
  on public.waitlist for all
  to service_role
  using (true)
  with check (true);

-- Indexes for fast queries
create index if not exists idx_waitlist_email      on public.waitlist(email);
create index if not exists idx_waitlist_notified   on public.waitlist(notified);
create index if not exists idx_waitlist_created_at on public.waitlist(created_at desc);
create index if not exists idx_waitlist_board      on public.waitlist(board);
create index if not exists idx_waitlist_role       on public.waitlist(role);


-- ── 2. Useful admin views ──────────────────────────────────────────────────────

-- Total signups
-- select count(*) from waitlist;

-- Breakdown by role
-- select role, count(*) from waitlist group by role order by count desc;

-- Breakdown by board
-- select board, count(*) from waitlist group by board order by count desc;

-- Recent signups (last 20)
-- select full_name, email, role, board, created_at
--   from waitlist order by created_at desc limit 20;

-- Founding member slots remaining (first 500)
-- select 500 - count(*) as fm_spots_remaining from waitlist;


-- ═══════════════════════════════════════════════════════════════════════════
-- After running this, also add SUPABASE_SERVICE_ROLE_KEY to your .env.local
-- Find it: Supabase Dashboard → Settings → API → service_role (secret key)
-- ═══════════════════════════════════════════════════════════════════════════