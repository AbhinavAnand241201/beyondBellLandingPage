'use client'

import { motion } from 'framer-motion'
import { Bot, Sun, Users, FolderOpen, TrendingUp, Bell, CheckCircle2 } from 'lucide-react'
import BelloImage from '@/components/ui/BelloImage'

const FEATURES = [
  { icon: <Bot size={18} />, text: 'AI tools for real school work' },
  { icon: <Sun size={18} />, text: 'Morning briefings with clarity' },
  { icon: <Users size={18} />, text: 'Peer circles by role and board' },
  { icon: <FolderOpen size={18} />, text: 'Templates, guides, and resources' },
]

export default function ProfessionalHome() {
  return (
    <section className="py-20 md:py-24 px-5 bg-white" id="about">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[12px] font-bold text-orange-main uppercase tracking-[0.22em] mb-4">
            Why BeyondBell
          </p>
          <h2 className="font-sora font-bold text-[28px] md:text-[40px] leading-[1.1] text-brown-dark mb-7 tracking-tight">
            A professional home for{' '}
            <span className="text-orange-main">educators.</span>
          </h2>

          <ul className="space-y-4 mb-10">
            {FEATURES.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-4"
              >
                <span className="w-9 h-9 rounded-full bg-orange-pale border border-orange-light flex items-center justify-center text-orange-main shrink-0">
                  {f.icon}
                </span>
                <span className="text-[15px] md:text-[16px] font-medium text-brown-dark">
                  {f.text}
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <BelloImage pose="reading" width={220} height={260} />
          </div>
        </motion.div>

        {/* RIGHT — dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="rounded-2xl bg-white shadow-lift border border-brown-dark/8 overflow-hidden">
            {/* mac chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-orange-pale border-b border-brown-dark/5">
              <span className="win-dot bg-[#FF5F57]" />
              <span className="win-dot bg-[#FEBC2E]" />
              <span className="win-dot bg-[#28C840]" />
              <span className="ml-3 text-[11px] text-muted font-mono">beyondbell.in / dashboard</span>
            </div>

            {/* dashboard svg mockup */}
            <div className="p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">
                    Good morning, Priya
                  </p>
                  <p className="font-sora font-bold text-lg text-brown-dark">
                    Your Morning Briefing
                  </p>
                </div>
                <Bell size={18} className="text-orange-main" />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Lessons planned', val: '12' },
                  { label: 'Peer threads', val: '34' },
                  { label: 'New resources', val: '8' },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-orange-pale border border-orange-light/60 p-3">
                    <div className="font-sora font-extrabold text-2xl text-brown-dark leading-none">
                      {m.val}
                    </div>
                    <div className="text-[10px] text-muted mt-1 uppercase tracking-wider font-semibold">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-brown-dark/6 p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-orange-main" />
                  <span className="text-[12px] font-semibold text-brown-dark">
                    Activity this week
                  </span>
                </div>
                <div className="flex items-end gap-1.5 h-14">
                  {[40, 60, 30, 75, 55, 85, 65].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 5 ? 'var(--orange-main)' : 'var(--orange-light)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {[
                  'Lesson plan: Photosynthesis · Grade 8',
                  'Peer reply from Anita · CBSE leaders',
                  'New: PTM communication template',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-brown-dark/80">
                    <CheckCircle2 size={13} className="text-orange-main shrink-0" />
                    <span className="truncate">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* subtle decoration */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-orange-main/15 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-orange-light/40 blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
