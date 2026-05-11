'use client'

import { motion } from 'framer-motion'
import { Sparkles, Users, Sun, BookOpen } from 'lucide-react'

const FEATURES = [
  {
    icon: <Sparkles size={20} />,
    title: 'AI Studio',
    desc: 'Smart tools for lesson plans, worksheets, quizzes and more.',
  },
  {
    icon: <Users size={20} />,
    title: 'Peer Circles',
    desc: 'Connect by role, subject and board.',
  },
  {
    icon: <Sun size={20} />,
    title: 'Morning Briefing',
    desc: 'Daily updates, insights and what matters most.',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Resource Library',
    desc: 'Templates, guides and curated resources.',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const card = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function FeaturesGrid() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-5 bg-white" id="how">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-sora font-bold text-[26px] sm:text-[32px] md:text-[40px] leading-[1.1] tracking-tight">
            <span className="text-brown-dark">Everything educators need.</span>
            <br />
            <span className="text-orange-main">In one smarter circle.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={card} className="feature-card flex flex-col items-start">
              <div className="w-11 h-11 rounded-2xl bg-orange-main flex items-center justify-center text-white mb-4 shadow-soft">
                {f.icon}
              </div>
              <h3 className="font-sora font-bold text-[17px] md:text-lg text-brown-dark mb-1.5">
                {f.title}
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
