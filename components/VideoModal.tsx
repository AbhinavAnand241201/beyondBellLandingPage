'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface VideoModalProps {
  open: boolean
  src: string
  title?: string
  onClose: () => void
}

export default function VideoModal({ open, src, title, onClose }: VideoModalProps) {
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
    const v = videoRef.current
    if (!v) return
    if (open) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="video-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-black/92 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Video preview'}
          suppressHydrationWarning
        >
          <button
            onClick={onClose}
            aria-label="Close video"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-orange-main flex items-center justify-center text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          {title && (
            <div className="absolute top-5 left-5 md:top-7 md:left-7 flex items-center gap-2.5">
              <span className="live-dot" aria-hidden />
              <span className="font-sora font-bold text-white text-[14px] tracking-tight">
                {title}
              </span>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[1280px] aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_30px_80px_-20px_rgba(255,138,0,0.55)] ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Slight zoom to crop the recorded browser chrome (tab bar) */}
            <video
              ref={videoRef}
              src={src}
              controls
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: 'scale(1.12) translateY(-3%)', transformOrigin: 'center center' }}
              suppressHydrationWarning
            />
          </motion.div>

          <p className="absolute bottom-6 left-0 right-0 text-center text-white/55 text-[12px] tracking-wider uppercase">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">ESC</kbd> or click outside to close
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
