'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import BelloImage from '@/components/ui/BelloImage'
import WaitlistForm from '@/components/WaitlistForm'

const BENEFITS = [
  'For Indian educators',
  'Meaningful connections',
  'Smarter tools. Real impact.',
]

interface SignupSectionProps {
  formRef: React.RefObject<HTMLDivElement | null>
  onSuccess: () => void
  planIntent?: { plan: 'founding' | 'free' } | null
}

export default function SignupSection({ formRef, onSuccess, planIntent }: SignupSectionProps) {
  return (
    <section
      ref={formRef}
      id="contact"
      className="py-16 sm:py-20 md:py-24 px-5 bg-white relative"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-light to-transparent" />

      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-start">
        {/* LEFT — copy + benefits + Bello */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-sora font-bold text-[26px] sm:text-[32px] md:text-[40px] leading-[1.1] text-brown-dark tracking-tight mb-6 sm:mb-7">
            Join the circle shaping the{' '}
            <span className="text-orange-main">future of education.</span>
          </h2>

          <ul className="space-y-3.5 mb-8">
            {BENEFITS.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-orange-pale border border-orange-light flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-orange-main" />
                </span>
                <span className="text-[15px] md:text-[16px] font-medium text-brown-dark">
                  {b}
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="hidden md:block mb-6 bello-bob">
            <BelloImage pose="happy" width={240} height={290} />
          </div>

          <p className="italic text-muted text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed max-w-md">
            Slow down. Think better. Teach better.
          </p>
        </motion.div>

        {/* RIGHT — Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-card shadow-lift border border-brown-dark/8 p-5 sm:p-6 md:p-8"
        >
          <WaitlistForm onSuccess={onSuccess} planIntent={planIntent} />
        </motion.div>
      </div>
    </section>
  )
}
