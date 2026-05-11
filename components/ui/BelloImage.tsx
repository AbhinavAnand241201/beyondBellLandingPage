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

const ASSETS_READY = process.env.NEXT_PUBLIC_BELLO_READY === 'true'

function BelloPlaceholder({
  pose,
  width,
  height,
  className,
}: {
  pose: BelloPose
  width: number
  height: number
  className: string
}) {
  const shapeMap: Record<BelloPose, string> = {
    hero: 'rounded-[40%_40%_35%_35%]',
    relaxed: 'rounded-[45%_45%_50%_50%]',
    reading: 'rounded-[38%_42%_35%_40%]',
    confident: 'rounded-[40%_40%_38%_38%]',
    happy: 'rounded-[42%_42%_48%_48%]',
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      style={{ width, height }}
      aria-label={`Bello placeholder — ${pose}`}
    >
      <div
        className={`bg-gradient-to-b from-orange-main to-orange-light opacity-30 ${shapeMap[pose]} transition-all`}
        style={{ width: width * 0.75, height: height * 0.8 }}
      />
      <span className="text-[11px] font-mono text-orange-main bg-orange-pale px-3 py-1 rounded-full border border-orange-light">
        bello-{pose}.png
      </span>
    </div>
  )
}

export default function BelloImage({
  pose,
  width = 400,
  height = 480,
  className = '',
  priority = false,
}: BelloImageProps) {
  if (!ASSETS_READY) {
    return <BelloPlaceholder pose={pose} width={width} height={height} className={className} />
  }

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
