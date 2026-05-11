import Image from 'next/image'

export type BelloPose = 'hero' | 'relaxed' | 'reading' | 'confident' | 'happy'

interface BelloImageProps {
  pose: BelloPose
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

const POSE_MAP: Record<BelloPose, string> = {
  hero: '/images/bello/bello-hero.png',
  relaxed: '/images/bello/bello-relaxed.png',
  reading: '/images/bello/bello-reading.png',
  confident: '/images/bello/bello-confident.png',
  happy: '/images/bello/bello-happy.png',
}

export default function BelloImage({
  pose,
  width = 400,
  height = 480,
  className = '',
  priority = false,
}: BelloImageProps) {
  return (
    <Image
      src={POSE_MAP[pose]}
      alt={`Bello the BeyondBell mascot — ${pose} pose`}
      width={width}
      height={height}
      className={`object-contain drop-shadow-[0_18px_24px_rgba(43,27,14,0.18)] ${className}`}
      priority={priority}
    />
  )
}
