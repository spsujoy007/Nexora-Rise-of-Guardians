import { motion } from 'framer-motion'
import { guardianRankLabel } from '@/lib/mockData'
import useGoogleAuth from '@/hooks/useGoogleAuth'

export function LevelRing({
  level,
  xp,
  xpToNext,
  avatar,
  size = 120,
}: {
  level: number
  xp: number
  xpToNext: number
  avatar: string
  size?: number
}) {
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(1, xp / xpToNext)
  const {user}= useGoogleAuth()

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-line)"
          strokeWidth={5}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-guardian-blue)" />
            <stop offset="100%" stopColor="var(--color-neon)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative rounded-full overflow-hidden border-2 border-void" style={{ width: size - 26, height: size - 26 }}>
        <img src={avatar} alt="Guardian avatar" className="w-full h-full object-cover bg-surface-2" />
      </div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-void border border-guardian-blue px-2.5 py-0.5 glow-blue">
        <span className="font-mono text-[11px] font-bold text-neon">LV {level}</span>
      </div>
      <div className="sr-only">{guardianRankLabel(level)}</div>
    </div>
  )
}
