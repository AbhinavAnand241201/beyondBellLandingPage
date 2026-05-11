'use client'

import { motion } from 'framer-motion'
import { Calendar, PenTool, Link2 } from 'lucide-react'
import BelloImage from '@/components/ui/BelloImage'

const FEATURES = [
  {
    icon: <Calendar size={22} />,
    title: 'Plan',
    desc: 'Save time with school-ready AI tools.',
  },
  {
    icon: <PenTool size={22} />,
    title: 'Create',
    desc: 'Write, organize, and prepare faster.',
  },
  {
    icon: <Link2 size={22} />,
    title: 'Connect',
    desc: 'Grow with thoughtful educators.',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const card = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function PlanCreateConnect() {
  return (
    <section className="py-20 md:py-24 px-5 bg-orange-pale relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-sora font-bold text-[28px] md:text-4xl text-center text-brown-dark mb-12 tracking-tight"
        >
          Plan. <span className="text-orange-main">Create.</span> Connect.
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 bello-bob"
          >
            <BelloImage pose="relaxed" width={280} height={340} />
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-1"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.title} variants={card} className="feature-card flex flex-col items-start">
                <div className="w-12 h-12 rounded-2xl bg-orange-pale flex items-center justify-center text-orange-main mb-4 border border-orange-light">
                  {f.icon}
                </div>
                <h3 className="font-sora font-bold text-lg text-brown-dark mb-1.5">
                  {f.title}
                </h3>
                <p className="text-[14px] text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
