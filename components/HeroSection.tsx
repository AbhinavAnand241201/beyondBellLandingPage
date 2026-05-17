'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Users, Sparkles, MessagesSquare, Library, Bot, Calendar } from 'lucide-react'
import BelloImage from '@/components/ui/BelloImage'
import FloatingCard from '@/components/ui/FloatingCard'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface HeroSectionProps {
  onCtaClick: () => void
  count: number | null
}

export default function HeroSection({ onCtaClick, count }: HeroSectionProps) {
  // First stat: live count if we have any, otherwise founder-seat consistency.
  const liveStat =
    count !== null && count > 0
      ? { icon: <Users size={14} />, number: count.toLocaleString('en-IN'), label: count === 1 ? 'reserved' : 'reserved' }
      : { icon: <Users size={14} />, number: '500', label: 'founder seats' }

  const stats = [
    liveStat,
    { icon: <Sparkles size={14} />, number: '5', label: 'AI tools' },
    { icon: <MessagesSquare size={14} />, number: '19', label: 'peer groups' },
  ]

  return (
    <section
      className="relative pt-24 sm:pt-28 md:pt-32 pb-14 md:pb-28 px-5 overflow-hidden"
      id="top"
    >
      <div className="hero-bg" />

      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-8 items-center">
        {/* ─── LEFT COLUMN — text first on every viewport ─── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center lg:text-left"
        >
          <motion.div variants={item} className="inline-flex items-center justify-center gap-2 mb-4 px-3 py-1 rounded-pill bg-orange-pale border border-orange-light/80">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-main" />
            <span className="text-[12px] sm:text-[13px] font-semibold text-brown-dark">
              BeyondBell Circle
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-sora font-extrabold text-[30px] sm:text-[40px] md:text-[48px] lg:text-[58px] leading-[1.05] text-brown-dark mb-4 sm:mb-6 tracking-tight"
          >
            <motion.span variants={item} className="block">
              Beyond the classroom.
            </motion.span>
            <motion.span variants={item} className="block">
              Beyond the noise.
            </motion.span>
            <motion.span variants={item} className="block text-orange-main underline-accent">
              Beyond the bell.
            </motion.span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-[14px] sm:text-[16px] md:text-[17px] text-muted leading-relaxed max-w-xl mx-auto lg:mx-0 mb-5 sm:mb-7"
          >
            The smarter professional circle for Indian educators — built with AI
            tools, real peers, and practical support.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-3 sm:gap-4 mb-5"
          >
            <button
              onClick={onCtaClick}
              className="btn-primary text-[14px] sm:text-base w-full sm:w-auto"
            >
              <Play size={14} fill="#fff" />
              Join the Waitlist
              <ArrowRight size={16} />
            </button>
            <p className="text-[12px] sm:text-[13px] text-muted flex items-center justify-center lg:justify-start gap-1.5">
              <span className="live-dot" aria-hidden />
              <span>₹199/month · First 500 only</span>
            </p>
          </motion.div>
        </motion.div>

        {/* ─── RIGHT COLUMN — mascot + floating cards ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative flex items-center justify-center min-h-[360px] sm:min-h-[440px] lg:min-h-[540px]"
        >
          <div className="bello-bob relative z-0">
            <div className="block sm:hidden">
              <BelloImage pose="hero" width={200} height={250} priority />
            </div>
            <div className="hidden sm:block md:hidden">
              <BelloImage pose="hero" width={300} height={375} priority />
            </div>
            <div className="hidden md:block lg:hidden">
              <BelloImage pose="hero" width={360} height={450} priority />
            </div>
            <div className="hidden lg:block">
              <BelloImage pose="hero" width={420} height={520} priority />
            </div>
          </div>

          {/*
            MOBILE-ONLY (visible <md): just 2 compact cards, positioned at torso/
            hip level so they hug the mascot's body — never over the head/megaphone.
          */}
          <div className="md:hidden absolute top-[32%] -left-1 scale-[0.72] origin-top-left z-10 pointer-events-none">
            <FloatingCard
              icon={<Calendar size={16} />}
              label="Lesson Planner"
              sublabel="AI · 60 sec"
              className="!relative !inset-auto"
              floatClass="float-card-a"
            />
          </div>
          <div className="md:hidden absolute bottom-[20%] -right-1 scale-[0.72] origin-bottom-right z-10 pointer-events-none">
            <FloatingCard
              icon={<MessagesSquare size={16} />}
              label="Peer Discussion"
              sublabel="19 groups"
              className="!relative !inset-auto"
              floatClass="float-card-c"
            />
          </div>

          {/* DESKTOP (md+): full set of 4 floating cards around the mascot */}
          <FloatingCard
            icon={<Calendar size={18} />}
            label="Lesson Planner"
            sublabel="AI · 60 sec"
            className="hidden md:flex top-[6%] left-[-2%] lg:left-[-4%] scale-90 lg:scale-100 origin-top-left"
            floatClass="float-card-a"
          />
          <FloatingCard
            icon={<Library size={18} />}
            label="Resource Hub"
            sublabel="Templates · Guides"
            className="hidden md:flex top-[2%] right-[-2%] lg:right-[-2%] scale-90 lg:scale-100 origin-top-right"
            floatClass="float-card-b"
          />
          <FloatingCard
            icon={<MessagesSquare size={18} />}
            label="Peer Discussion"
            sublabel="19 active groups"
            className="hidden md:flex top-[48%] right-[-4%] lg:right-[-8%] scale-90 lg:scale-100"
            floatClass="float-card-c"
          />
          <FloatingCard
            icon={<Bot size={18} />}
            label="AI Quiz Generator"
            sublabel="Board-aligned"
            className="hidden md:flex bottom-[8%] left-[2%] lg:left-[-4%] scale-90 lg:scale-100"
            floatClass="float-card-d"
          />
        </motion.div>

        {/* ─── STATS — span full width below both columns on mobile, left-only on lg ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="lg:col-start-1 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-5 gap-y-2.5 pt-5 border-t border-brown-dark/8"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-orange-main">{s.icon}</span>
              <span className="font-sora font-extrabold text-brown-dark text-[14px] sm:text-[15px]">
                {s.number}
              </span>
              <span className="text-[12px] sm:text-[13px] text-muted">{s.label}</span>
              {i < stats.length - 1 && (
                <span className="ml-2 sm:ml-3 h-4 w-px bg-brown-dark/15 hidden sm:inline-block" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
