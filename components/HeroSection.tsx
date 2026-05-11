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
    <section
      className="relative pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-28 px-5 overflow-hidden"
      id="top"
    >
      <div className="hero-bg" />

      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-8 items-center">
        {/* ─── LEFT COLUMN ─── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center lg:text-left order-2 lg:order-1"
        >
          <motion.div variants={item} className="flex items-center justify-center lg:justify-start gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-main" />
            <span className="text-[13px] sm:text-sm font-semibold text-brown-dark">
              BeyondBell Circle
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-sora font-extrabold text-[32px] sm:text-[40px] md:text-[48px] lg:text-[58px] leading-[1.05] text-brown-dark mb-5 sm:mb-6 tracking-tight"
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
            className="text-[15px] sm:text-[16px] md:text-[17px] text-muted leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-7"
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
              className="btn-primary text-[15px] md:text-base w-full sm:w-auto"
            >
              <Play size={14} fill="#fff" />
              Join the Waitlist
              <ArrowRight size={16} />
            </button>
            <p className="text-[12px] sm:text-[13px] text-muted flex items-center justify-center lg:justify-start gap-1.5">
              <span className="live-dot" aria-hidden />
              Founding Members ₹199/month · First 500 only
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-5 gap-y-2.5 pt-5 border-t border-brown-dark/8"
          >
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-orange-main">{s.icon}</span>
                <span className="font-sora font-extrabold text-brown-dark text-[14px] sm:text-[15px]">
                  {s.number}
                </span>
                <span className="text-[12px] sm:text-[13px] text-muted">{s.label}</span>
                {i < STATS.length - 1 && (
                  <span className="ml-2 sm:ml-3 h-4 w-px bg-brown-dark/15 hidden sm:inline-block" />
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
          className="relative flex items-center justify-center min-h-[340px] sm:min-h-[420px] lg:min-h-[540px] order-1 lg:order-2"
        >
          <div className="bello-bob">
            {/* Smaller on mobile, larger on lg+ */}
            <div className="block sm:hidden">
              <BelloImage pose="hero" width={260} height={325} priority />
            </div>
            <div className="hidden sm:block lg:hidden">
              <BelloImage pose="hero" width={340} height={425} priority />
            </div>
            <div className="hidden lg:block">
              <BelloImage pose="hero" width={420} height={520} priority />
            </div>
          </div>

          {/* Top-left card — visible on all sizes */}
          <FloatingCard
            icon={<Calendar size={18} />}
            label="Lesson Planner"
            sublabel="AI · 60 sec"
            className="top-[4%] left-[-4%] sm:left-[2%] lg:left-[-4%] scale-[0.78] sm:scale-90 lg:scale-100 origin-top-left"
            floatClass="float-card-a"
          />

          {/* Top-right card — visible on all sizes */}
          <FloatingCard
            icon={<Library size={18} />}
            label="Resource Hub"
            sublabel="Templates · Guides"
            className="top-[2%] right-[-4%] sm:right-[2%] lg:right-[-2%] scale-[0.78] sm:scale-90 lg:scale-100 origin-top-right"
            floatClass="float-card-b"
          />

          {/* Mid-right card — hidden on smallest screens */}
          <FloatingCard
            icon={<MessagesSquare size={18} />}
            label="Peer Discussion"
            sublabel="19 active groups"
            className="hidden sm:flex top-[48%] right-[-4%] sm:right-[-2%] lg:right-[-8%] scale-90 lg:scale-100"
            floatClass="float-card-c"
          />

          {/* Bottom-left card — hidden on smallest screens */}
          <FloatingCard
            icon={<Bot size={18} />}
            label="AI Quiz Generator"
            sublabel="Board-aligned"
            className="hidden sm:flex bottom-[8%] left-[2%] lg:left-[-4%] scale-90 lg:scale-100"
            floatClass="float-card-d"
          />
        </motion.div>
      </div>
    </section>
  )
}
