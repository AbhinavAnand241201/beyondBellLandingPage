'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, MessageCircle, Sparkles, Clock, Heart } from 'lucide-react'
import VideoModal from '@/components/VideoModal'

const BULLETS = [
  { icon: <Sparkles size={14} />, text: '20+ situation types — admissions, late fees, behaviour, results' },
  { icon: <Heart size={14} />, text: 'Tone-calibrated for WhatsApp, email, or formal letter' },
  { icon: <Clock size={14} />, text: 'Drafted in 3 minutes. Sounds like you wrote it.' },
]

export default function ParentCommunicatorDemo() {
  const [open, setOpen] = useState(false)

  return (
    <section className="py-16 sm:py-20 md:py-24 px-5 bg-white relative overflow-hidden">
      {/* decorative orange shapes */}
      <div
        className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #FFDBA6 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #FF8A00 0%, transparent 65%)' }}
        aria-hidden
      />

      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
        {/* LEFT — copy + bullets + cta */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-orange-pale border border-orange-light text-[10px] sm:text-[11px] font-bold text-orange-deep uppercase tracking-[0.18em] mb-4 sm:mb-5">
            <MessageCircle size={12} /> Featured Tool
          </div>

          <h2 className="font-sora font-bold text-[26px] sm:text-[32px] md:text-[40px] leading-[1.05] text-brown-dark mb-4 sm:mb-5 tracking-tight">
            Parent<span className="text-orange-main">Communicator.</span>
          </h2>

          <p className="text-[15px] md:text-[17px] text-muted leading-relaxed mb-7 max-w-md">
            The parent message you have been putting off — drafted in three minutes, in the right tone.
          </p>

          <ul className="space-y-3 mb-9">
            {BULLETS.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-orange-main text-white flex items-center justify-center shrink-0 mt-0.5 shadow-soft">
                  {b.icon}
                </span>
                <span className="text-[14px] md:text-[15px] text-brown-dark font-medium">
                  {b.text}
                </span>
              </motion.li>
            ))}
          </ul>

          <button
            onClick={() => setOpen(true)}
            className="btn-primary text-[13px] sm:text-[14px] tracking-wider uppercase w-full sm:w-auto"
          >
            <Play size={14} fill="#fff" />
            Video Demo
          </button>
        </motion.div>

        {/* RIGHT — video poster card */}
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative aspect-video w-full rounded-2xl overflow-hidden bg-brown-dark shadow-lift ring-1 ring-brown-dark/10"
          aria-label="Play ParentCommunicator video demo"
        >
          {/* Animated gradient backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,138,0,0.55) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(255,176,77,0.35) 0%, transparent 50%), #1a0e05',
            }}
          />

          {/* Faint browser chrome (suggests "this is a tool screen") */}
          <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/5">
            <span className="win-dot bg-[#FF5F57]/80" />
            <span className="win-dot bg-[#FEBC2E]/80" />
            <span className="win-dot bg-[#28C840]/80" />
            <span className="ml-3 text-[10px] text-white/45 font-mono">
              beyondbell.in / parent-communicator
            </span>
          </div>

          {/* Center play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-orange-main flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-glow">
              <span className="absolute inset-0 rounded-full bg-orange-main animate-ping opacity-25" />
              <Play size={28} fill="#fff" className="ml-1.5 sm:hidden" />
              <Play size={36} fill="#fff" className="ml-1.5 hidden sm:block" />
            </div>
            <p className="mt-4 sm:mt-6 font-sora font-bold text-base sm:text-lg md:text-xl tracking-tight text-center">
              Watch ParentCommunicator
            </p>
            <p className="mt-1 text-[10px] sm:text-[12px] text-white/65 uppercase tracking-[0.2em] text-center">
              Click to play · 60-second demo
            </p>
          </div>

          {/* Live pip */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15">
            <span className="live-dot" aria-hidden />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Live Preview</span>
          </div>
        </motion.button>
      </div>

      <VideoModal
        open={open}
        src="/parentCommunicator.mp4"
        title="ParentCommunicator · Live Demo"
        onClose={() => setOpen(false)}
      />
    </section>
  )
}
