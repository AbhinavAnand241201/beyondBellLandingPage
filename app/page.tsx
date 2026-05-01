'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen, ClipboardList, MessageCircle, Calendar, Shield, FileCheck,
  Users, Star, Zap, ChevronRight, Check, ArrowRight, Menu, X,
  GraduationCap, Lock, Sparkles, Play, LayoutGrid, Award, Globe, Bell
} from 'lucide-react'
import WaitlistModal from '@/components/WaitlistModal'

const TOOLS = [
  {
    icon: BookOpen,
    name: 'Lesson Architect',
    tagline: 'Board-aligned lesson plans in 60 seconds',
    desc: 'Complete 7-part lesson plans for CBSE, ICSE, IGCSE, Cambridge & State Boards — with Bloom\'s taxonomy, student activities, formative assessment, and teacher notes built in.',
    tier: 'Free · Standard · Pro',
    accent: '#F5A400', bg: '#FFF4DC',
  },
  {
    icon: ClipboardList,
    name: 'Assessment Builder',
    tagline: 'Question papers that follow the blueprint',
    desc: 'Complete papers with answer keys, Bloom\'s level tags, and CBSE section weightage. IGCSE command words (describe, analyse, evaluate) applied precisely.',
    tier: 'Free · Standard · Pro',
    accent: '#1A2D4E', bg: '#EBF0F8',
  },
  {
    icon: MessageCircle,
    name: 'Parent Communicator',
    tagline: '20+ situations handled with empathy',
    desc: 'Professional parent messages for academic concerns, behaviour, health, achievements and more — in English or Hindi, formatted for WhatsApp, email, or letterhead.',
    tier: 'Free · Standard · Pro',
    accent: '#059669', bg: '#ECFDF5',
  },
  {
    icon: Calendar,
    name: 'Event Architect',
    tagline: '8-document event pack, generated instantly',
    desc: 'Annual Day, Science Fair, Sports Day, PTM and 25+ events — with planning timeline, roles matrix, budget template, parent letters, stage script and feedback form.',
    tier: 'Standard · Pro',
    accent: '#7C3AED', bg: '#F5F3FF',
  },
  {
    icon: Shield,
    name: 'Principal Desk',
    tagline: 'RAG-powered policy advisory',
    desc: 'Ask anything about NEP 2020, RTE, POCSO, CBSE affiliation, or SQAA — and get cited answers sourced directly from the policy documents. No hallucinations.',
    tier: 'Pro only',
    accent: '#DC2626', bg: '#FEF2F2',
    proOnly: true,
  },
  {
    icon: FileCheck,
    name: 'Compliance Generator',
    tagline: 'SQAA evidence documentation, done',
    desc: 'Structured evidence documents for all 7 SQAA domains — with self-evaluation scores, gap analysis, and the document checklist for physical submission.',
    tier: 'Pro only',
    accent: '#0891B2', bg: '#F0F9FF',
    proOnly: true,
  },
]

const SPACES = [
  { icon: Users, name: 'Staffroom', desc: 'Morning Briefing · Teaching Wins · Ask Anything · Vent & Recharge · Friday Reflections' },
  { icon: GraduationCap, name: 'CBSE Circle', desc: 'NCERT Alignment · Exam Strategy · Sample Paper Exchange · NEP 2020 in Practice' },
  { icon: Globe, name: 'IGCSE / Cambridge', desc: 'ATL Skills · Extended Essay · Cambridge Assessment · Subject Strategy' },
  { icon: BookOpen, name: 'Subject Spaces', desc: 'Maths · Sciences · English · Social Studies · Languages · Arts · Tech/CS · Early Years' },
  { icon: Award, name: 'Leadership Lounge', desc: 'Principal to Principal · Policy Decoded · Staff Development · School Improvement — Pro only' },
  { icon: LayoutGrid, name: 'Resource Room', desc: 'Lesson Plans · Assessments · Worksheets · Rubrics · Parent Comms · Events · Policies' },
]

const TIERS = [
  {
    name: 'Free', price: '₹0', period: 'forever',
    desc: 'Explore the tools. Read the community.',
    highlight: false,
    features: [
      '2 lesson plans / day',
      '1 assessment / day',
      '3 parent messages / day',
      'Read community feed',
      'Join Spaces (read-only)',
      '3 resource downloads / month',
      'Event recordings (7 days after live)',
    ],
  },
  {
    name: 'Standard', price: '₹199', period: '/month',
    desc: 'Unlimited tools. Full community. Your professional home.',
    highlight: true,
    note: '₹1,999/year · First 500 founding members locked for life',
    features: [
      'Unlimited lesson plans & assessments',
      'Unlimited parent messages & event plans',
      'Post, reply, react in community',
      'Live event access',
      'Unlimited resource downloads + uploads',
      '5 direct messages / day',
      'Create Study Groups (Level 3+)',
      'Standard verified educator badge',
    ],
  },
  {
    name: 'Pro', price: '₹299', period: '/month',
    desc: 'For principals and leaders who need the full picture.',
    highlight: false,
    note: '₹2,999/year · Recommended for principals & HODs',
    features: [
      'Everything in Standard',
      'Principal Desk (RAG policy advisory)',
      'Compliance Generator (SQAA docs)',
      'Leadership Lounge access',
      'Unlimited direct messages',
      'Priority Q&A at live events',
      '2× Circle Points multiplier',
      'Gold Pro verified badge + featured profile',
    ],
  },
]

const REP = [
  { pts: '+15 pts', action: 'Reply marked Helpful', note: 'No cap' },
  { pts: '+20 pts', action: 'Upload a resource', note: 'Unlimited' },
  { pts: '+25 pts', action: 'Resource gets 4★+', note: 'Per resource' },
  { pts: '+15 pts', action: 'Attend live event', note: 'Per event' },
  { pts: '+100 pts', action: 'Complete a cohort', note: 'Per cohort' },
  { pts: '+30 pts', action: 'Successful referral', note: 'No cap' },
]

export default function LandingPage() {
  const [modal, setModal] = useState(false)
  const [nav, setNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const openModal = () => { setModal(true); setNav(false) }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-brand-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-brand flex items-center justify-center">
              <span className="font-poppins font-black text-sm text-black">BB</span>
            </div>
            <span className="font-poppins font-bold text-brand-black text-lg">
              BeyondBell<span className="text-yellow-brand">.</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-inter font-medium text-brand-muted">
            {[['Tools', '#tools'], ['Community', '#community'], ['Pricing', '#pricing'], ['About', '#about']].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-brand-black transition-colors">{label}</a>
            ))}
          </nav>
          <button onClick={openModal} className="hidden md:flex items-center gap-1.5 bg-yellow-brand text-brand-black font-poppins font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-dark transition-all hover:-translate-y-px hover:shadow-md">
            Join Waitlist <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => setNav(!nav)} className="md:hidden p-2 rounded-lg hover:bg-brand-grey">
            {nav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {nav && (
          <div className="md:hidden bg-white border-t border-brand-border px-5 py-5 space-y-4 animate-fade-in">
            {[['Tools', '#tools'], ['Community', '#community'], ['Pricing', '#pricing'], ['About', '#about']].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setNav(false)} className="block text-sm font-medium text-brand-black py-1">{label}</a>
            ))}
            <button onClick={openModal} className="w-full bg-yellow-brand text-brand-black font-poppins font-semibold text-sm py-3 rounded-xl">
              Join the Waitlist
            </button>
          </div>
        )}
      </header>

      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,#FFF4DC,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_80%,#F7F7F7,transparent)]" />
        <div className="absolute top-1/3 right-8 w-80 h-80 rounded-full bg-yellow-brand/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-4 w-52 h-52 rounded-full bg-yellow-brand/8 blur-2xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-light border border-yellow-brand/30 rounded-full px-4 py-2 mb-8 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-yellow-brand" />
            <span className="text-xs font-semibold font-inter uppercase tracking-widest text-brand-black">
              Coming Soon · Join 500 Founding Members
            </span>
          </div>
          <h1 className="font-poppins font-black text-5xl md:text-[64px] lg:text-7xl text-brand-black leading-[1.04] mb-7 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            The Professional Home<br />
            India&apos;s School Teachers<br />
            <span className="text-yellow-brand squiggle">Deserve.</span>
          </h1>
          <p className="font-inter text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            6 purpose-built AI tools that eliminate hours of daily routine work —
            plus a native peer community where your experience is actually valued.
            Built by an educator who runs a school.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={openModal}
              className="group flex items-center justify-center gap-3 bg-yellow-brand text-brand-black font-poppins font-bold text-base px-9 py-4 rounded-xl hover:bg-yellow-dark transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-brand/25 w-full sm:w-auto"
            >
              Join the Waitlist — Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#tools"
              className="flex items-center justify-center gap-2 text-brand-black font-inter font-medium text-base px-9 py-4 rounded-xl border border-brand-border hover:border-yellow-brand hover:bg-yellow-light transition-all w-full sm:w-auto"
            >
              <Play className="w-4 h-4 fill-current" /> See all features
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-14">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['9M+', 'School teachers in India'],
            ['27,000+', 'CBSE-affiliated schools'],
            ['45–90', 'Minutes lost daily to lesson plans'],
            ['0', 'Trusted AI tools built for Indian teachers — until now'],
          ].map(([val, label], i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="font-poppins font-black text-3xl md:text-4xl text-yellow-brand mb-2">{val}</div>
              <div className="text-xs text-white/55 font-inter leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="py-20 md:py-28 bg-brand-grey">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-14 reveal">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-brand-black mb-4">
              6 tools. Every routine task. <span className="text-yellow-brand">Done.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((t, i) => {
              const Icon = t.icon
              return (
                <div key={i} className="card-lift bg-white rounded-2xl p-6 border border-brand-border reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.bg }}>
                      <Icon className="w-6 h-6" style={{ color: t.accent }} />
                    </div>
                    {t.proOnly && (
                      <span className="inline-flex items-center gap-1 bg-brand-navy/10 text-brand-navy rounded-full px-2.5 py-1 text-xs font-semibold">
                        <Lock className="w-3 h-3" /> Pro
                      </span>
                    )}
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-brand-black mb-1">{t.name}</h3>
                  <p className="text-xs font-semibold text-yellow-dark mb-3">{t.tagline}</p>
                  <p className="text-sm text-brand-muted font-inter leading-relaxed mb-4">{t.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 lg:px-10">
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl p-7 reveal relative ${tier.highlight ? 'bg-yellow-brand shadow-xl shadow-yellow-brand/20 ring-2 ring-yellow-dark' : 'bg-brand-grey border border-brand-border'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <h3 className="font-poppins font-bold text-xl text-brand-black mb-1">{tier.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="font-poppins font-black text-4xl text-brand-black">{tier.price}</span>
                  <span className={`font-inter text-sm mb-1.5 ${tier.highlight ? 'text-brand-black/70' : 'text-brand-muted'}`}>{tier.period}</span>
                </div>
                <button
                  onClick={openModal}
                  className="w-full bg-brand-black text-white font-poppins font-semibold text-sm py-3 rounded-xl mb-5 hover:bg-brand-navy transition-all"
                >
                  {tier.name === 'Free' ? 'Start Free' : `Join ${tier.name}`} — Waitlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-brand-black py-12">
        <div className="max-w-6xl mx-auto px-5 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-brand flex items-center justify-center">
              <span className="font-poppins font-black text-sm text-black">BB</span>
            </div>
            <div>
              <p className="font-poppins font-bold text-white text-sm">BeyondBell Circle</p>
              <p className="text-white/35 text-xs font-inter">For India&apos;s School Educators</p>
            </div>
          </div>
          <button onClick={openModal} className="bg-yellow-brand text-brand-black font-poppins font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-dark transition-all">
            Join Waitlist
          </button>
        </div>
      </footer>

      {modal && <WaitlistModal onClose={() => setModal(false)} />}
    </div>
  )
}
