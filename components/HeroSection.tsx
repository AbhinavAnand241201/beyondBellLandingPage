'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Users, Sparkles, MessagesSquare, BookOpen, Library, Bot, Calendar } from 'lucide-react'
import BelloImage from '@/components/ui/BelloImage'
import FloatingCard from '@/components/ui/FloatingCard'

const STATS = [
  { icon: <Users size={14} />, number: '1,243+', label: 'educators' },
  { icon: <Sparkles size={14} />, number: '6', label: 'AI tools' },
  { icon: <MessagesSquare size={14} />, number: '19', label: 'peer groups' },
]

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
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="relative pt-28 md:pt-32 pb-20 md:pb-28 px-5 overflow-hidden" id="top">
      <div className="hero-bg" />

      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-8 items-center">
        {/* ─── LEFT COLUMN ─── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.div variants={item} className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-orange-main" />
            <span className="text-sm font-semibold text-brown-dark">
              BeyondBell Circle
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-sora font-extrabold text-[38px] sm:text-[48px] lg:text-[58px] leading-[1.05] text-brown-dark mb-6 tracking-tight"
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
            className="text-[16px] md:text-[17px] text-muted leading-relaxed max-w-xl mb-7"
          >
            The smarter professional circle for Indian educators — built with AI
            tools, real peers, and practical support.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <button onClick={onCtaClick} className="btn-primary text-[15px] md:text-base">
              <Play size={14} fill="#fff" />
              Join the Waitlist
              <ArrowRight size={16} />
            </button>
            <p className="text-[13px] text-muted flex items-center gap-1.5">
              <span className="live-dot" aria-hidden />
              Founding Members ₹199/month · First 500 only
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-5 border-t border-brown-dark/8">
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-orange-main">{s.icon}</span>
                <span className="font-sora font-extrabold text-brown-dark text-[15px]">
                  {s.number}
                </span>
                <span className="text-[13px] text-muted">{s.label}</span>
                {i < STATS.length - 1 && (
                  <span className="ml-3 h-4 w-px bg-brown-dark/15 hidden sm:inline-block" />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ─── RIGHT COLUMN — Bello + floating cards ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative flex items-center justify-center min-h-[420px] lg:min-h-[540px]"
        >
          <div className="bello-bob">
            <BelloImage pose="hero" width={420} height={520} priority />
          </div>

          {/* Floating cards around Bello */}
          <FloatingCard
            icon={<Calendar size={18} />}
            label="Lesson Planner"
            sublabel="AI · 60 sec"
            className="top-[6%] left-[2%] lg:left-[-4%]"
            floatClass="float-card-a"
          />
          <FloatingCard
            icon={<Library size={18} />}
            label="Resource Hub"
            sublabel="Templates · Guides"
            className="top-[2%] right-[2%] lg:right-[-2%]"
            floatClass="float-card-b"
          />
          <FloatingCard
            icon={<MessagesSquare size={18} />}
            label="Peer Discussion"
            sublabel="19 active groups"
            className="top-[50%] right-[-2%] lg:right-[-8%]"
            floatClass="float-card-c"
          />
          <FloatingCard
            icon={<Bot size={18} />}
            label="AI Quiz Generator"
            sublabel="Board-aligned"
            className="bottom-[6%] left-[6%] lg:left-[-4%]"
            floatClass="float-card-d"
          />
        </motion.div>
      </div>
    </section>
  )
}
