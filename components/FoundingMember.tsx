'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import BelloImage from '@/components/ui/BelloImage'

const FM_TOTAL = 500

interface FoundingMemberProps {
  count: number | null
  displayCount: number
  popKey: number
  onCtaClick: () => void
}

export default function FoundingMember({
  count,
  displayCount,
  popKey,
  onCtaClick,
}: FoundingMemberProps) {
  const fmPct = count !== null ? Math.min((count / FM_TOTAL) * 100, 100) : 0
  const remaining = count !== null ? Math.max(FM_TOTAL - count, 0) : null

  return (
    <section
      className="py-16 sm:py-20 md:py-24 px-5 bg-pale-fade relative overflow-hidden"
      id="pricing"
    >
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        {/* LEFT — content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <p className="text-[11px] sm:text-[12px] font-bold text-orange-main uppercase tracking-[0.22em] mb-4">
            Founding Member
          </p>
          <h2 className="font-sora font-bold text-[26px] sm:text-[34px] md:text-[42px] leading-[1.05] text-brown-dark mb-5 sm:mb-6 tracking-tight">
            Become a{' '}
            <span className="text-orange-main">Founding Member.</span>
          </h2>

          <div className="flex items-end justify-center lg:justify-start gap-2 mb-3">
            <span className="font-sora font-extrabold text-[56px] sm:text-[64px] md:text-[72px] leading-none text-orange-main tabular-nums">
              ₹199
            </span>
            <span className="text-muted text-base sm:text-lg md:text-xl mb-2 sm:mb-3">/ month</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-pale border border-orange-light rounded-pill text-[11px] sm:text-[12px] font-semibold text-brown-dark mb-5">
            <Lock size={12} className="text-orange-main" />
            Locked for life
          </div>

          <p className="text-[14px] sm:text-[15px] text-muted mb-6 sm:mb-7 max-w-md mx-auto lg:mx-0 leading-relaxed">
            After 500 spots, standard pricing becomes ₹299/month.
          </p>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] text-muted font-medium">
                {count !== null ? (
                  <>
                    <span key={popKey} className="counter-pop font-semibold text-brown-dark tabular-nums">
                      {displayCount}
                    </span>{' '}
                    of 500 claimed
                  </>
                ) : (
                  '0 of 500 claimed'
                )}
              </p>
              {remaining !== null && remaining > 0 && (
                <p className="text-[11px] font-bold text-orange-main uppercase tracking-wider flex items-center gap-1.5">
                  <span className="live-dot" aria-hidden />
                  {remaining} left
                </p>
              )}
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(fmPct, 0.5)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          <button onClick={onCtaClick} className="btn-primary text-[14px] sm:text-[15px] w-full sm:w-auto">
            Reserve My Spot
            <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* RIGHT — Bello confident */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center bello-bob order-1 lg:order-2"
        >
          <div className="block sm:hidden">
            <BelloImage pose="confident" width={220} height={270} />
          </div>
          <div className="hidden sm:block lg:hidden">
            <BelloImage pose="confident" width={300} height={365} />
          </div>
          <div className="hidden lg:block">
            <BelloImage pose="confident" width={360} height={440} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
