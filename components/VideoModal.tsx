'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Clock3, Sparkles } from 'lucide-react'

interface VideoModalProps {
  open: boolean
  src?: string
  title?: string
  /** When true, render the "demo coming soon" placeholder instead of <video>. */
  placeholder?: boolean
  onClose: () => void
}

export default function VideoModal({
  open,
  src,
  title,
  placeholder = false,
  onClose,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Lock body scroll while open + ESC closes
  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  // Autoplay on open; pause + reset on close
  useEffect(() => {
    if (placeholder) return
    const v = videoRef.current
    if (!v) return
    if (open) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [open, placeholder])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="video-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-6 md:p-10 bg-black/95 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Video preview'}
          suppressHydrationWarning
        >
          {/* ───────────── TOP BAR ───────────── */}
          <div
            className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {title ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-pill bg-brown-dark text-white shadow-lift max-w-[70%]">
                <span className="live-dot shrink-0" aria-hidden />
                <span className="font-sora font-bold text-[12px] sm:text-[14px] tracking-tight truncate">
                  {title}
                </span>
              </div>
            ) : (
              <span />
            )}

            <button
              onClick={onClose}
              aria-label="Close video"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-orange-main hover:bg-orange-deep flex items-center justify-center text-white shadow-lift transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* ───────────── BODY ───────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[1280px] aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_30px_80px_-20px_rgba(255,138,0,0.55)] ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {placeholder ? (
              /* ─── "Demo arriving soon" placeholder ─── */
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(255,138,0,0.55) 0%, transparent 50%), radial-gradient(circle at 75% 70%, rgba(255,176,77,0.35) 0%, transparent 55%), #1a0e05',
                }}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-main flex items-center justify-center mb-5 shadow-glow">
                  <span className="absolute inset-0 rounded-full bg-orange-main animate-ping opacity-25" />
                  <Sparkles size={32} className="text-white" />
                </div>
                <h3 className="font-sora font-bold text-white text-[22px] sm:text-[28px] tracking-tight mb-2">
                  Demo arriving soon
                </h3>
                <p className="text-white/70 text-[14px] sm:text-[15px] leading-relaxed max-w-md mb-5">
                  We&apos;re recording the final preview. Join the waitlist and you&apos;ll be the first to see it.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-white/10 border border-white/15">
                  <Clock3 size={13} className="text-orange-main" />
                  <span className="text-[11px] sm:text-[12px] font-bold text-white uppercase tracking-wider">
                    Live before launch
                  </span>
                </div>
              </div>
            ) : (
              /* ─── Actual video player ─── */
              <video
                ref={videoRef}
                src={src}
                controls
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scale(1.12) translateY(-3%)', transformOrigin: 'center center' }}
                suppressHydrationWarning
              />
            )}
          </motion.div>

          {/* ───────────── DESKTOP-ONLY HINT ───────────── */}
          <p className="hidden md:block absolute bottom-6 left-0 right-0 text-center text-white/55 text-[12px] tracking-wider uppercase">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">ESC</kbd> or click outside to close
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
