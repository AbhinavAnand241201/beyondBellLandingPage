'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen, ClipboardList, MessageCircle, Calendar, CalendarClock, Sparkles } from 'lucide-react'
import VideoModal from '@/components/VideoModal'

type Tool = {
  icon: ReactNode
  name: string
  desc: string
  /** Real video path. When null, the modal shows a "coming soon" placeholder. */
  videoSrc: string | null
}

const TOOLS: Tool[] = [
  {
    icon: <BookOpen size={22} />,
    name: 'Lesson Planner',
    desc: 'Board-aligned lesson plans for CBSE, ICSE & IGCSE in 60 seconds.',
    videoSrc: null,
  },
  {
    icon: <ClipboardList size={22} />,
    name: 'Question Paper Maker',
    desc: 'Section-balanced paper with answer key in 15 minutes.',
    videoSrc: null,
  },
  {
    icon: <MessageCircle size={22} />,
    name: 'ParentCommunicator',
    desc: '20+ situations. Tone-calibrated. Drafted in 3 minutes.',
    videoSrc: '/parentCommunicator.mp4',
  },
  {
    icon: <Calendar size={22} />,
    name: 'Event Planner',
    desc: 'PTM, annual day, sports day — full timeline + templates.',
    videoSrc: null,
  },
  {
    icon: <CalendarClock size={22} />,
    name: 'Time Table Maker',
    desc: 'Clash-free school timetables generated in minutes.',
    videoSrc: null,
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const card = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function ToolsGrid() {
  const [active, setActive] = useState<Tool | null>(null)

  return (
    <section className="py-16 sm:py-20 md:py-24 px-5 bg-white relative overflow-hidden">
      {/* soft decorative blob */}
      <div
        className="absolute -top-32 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF8A00 0%, transparent 65%)' }}
        aria-hidden
      />

      <div className="relative max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-orange-pale border border-orange-light text-[10px] sm:text-[11px] font-bold text-orange-deep uppercase tracking-[0.18em] mb-4">
            <Sparkles size={12} /> The AI Studio
          </div>
          <h2 className="font-sora font-bold text-[26px] sm:text-[32px] md:text-[40px] leading-[1.1] tracking-tight">
            <span className="text-brown-dark">Five tools.</span>{' '}
            <span className="text-orange-main">Built for real classrooms.</span>
          </h2>
          <p className="mt-3 text-muted text-[14px] sm:text-[16px] max-w-xl mx-auto">
            Tap any tool to watch a 60-second demo.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {TOOLS.map((tool) => (
            <motion.div
              key={tool.name}
              variants={card}
              className="feature-card flex flex-col items-start group"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-main text-white flex items-center justify-center mb-4 shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
                {tool.icon}
              </div>
              <h3 className="font-sora font-bold text-[17px] md:text-lg text-brown-dark mb-1.5">
                {tool.name}
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted leading-relaxed mb-5">
                {tool.desc}
              </p>
              <button
                onClick={() => setActive(tool)}
                className="mt-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-orange-pale border border-orange-light/80 text-orange-deep font-bold text-[13px] hover:bg-orange-main hover:text-white hover:border-orange-main transition-colors"
              >
                <Play size={12} fill="currentColor" />
                Try the Demo
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <VideoModal
        open={active !== null}
        src={active?.videoSrc ?? undefined}
        title={active ? `${active.name} · Live Demo` : undefined}
        placeholder={active !== null && active.videoSrc === null}
        onClose={() => setActive(null)}
      />
    </section>
  )
}
