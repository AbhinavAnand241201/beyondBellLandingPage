'use client'

import type { ReactNode } from 'react'

interface FloatingCardProps {
  icon: ReactNode
  label: string
  sublabel?: string
  className?: string
  floatClass?: string
}

export default function FloatingCard({
  icon,
  label,
  sublabel,
  className = '',
  floatClass = 'float-card-a',
}: FloatingCardProps) {
  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 border border-orange-light/40 ${floatClass} ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-orange-pale flex items-center justify-center text-orange-main shrink-0">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="font-sora font-bold text-[14px] text-brown-dark whitespace-nowrap">
          {label}
        </div>
        {sublabel && (
          <div className="text-[11px] text-muted whitespace-nowrap">{sublabel}</div>
        )}
      </div>
    </div>
  )
}
