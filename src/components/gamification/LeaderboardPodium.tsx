import { motion } from 'framer-motion'
import type { LeaderboardEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

const podiumStyle = [
  { order: 'order-2', height: 'h-36', ring: 'ring-[#FFD36E]', label: '1', crown: '👑' },
  { order: 'order-1', height: 'h-28', ring: 'ring-[#C9D3E0]', label: '2', crown: '' },
  { order: 'order-3', height: 'h-24', ring: 'ring-[#C99A2E]', label: '3', crown: '' },
]

export function LeaderboardPodium({ top3 }: { top3: LeaderboardEntry[] }) {
  const arranged = [top3[1], top3[0], top3[2]] // silver, gold, bronze visual order

  return (
    <div className="flex items-end justify-center gap-4 sm:gap-8 pt-6">
      {arranged.map((entry, i) => {
        if (!entry) return null
        const style = podiumStyle[i]
        return (
          <motion.div
            key={entry.guardian.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 120 }}
            className={cn('flex flex-col items-center gap-2', style.order)}
          >
            <span className="text-2xl">{style.crown}</span>
            <div className={cn('rounded-full ring-2 p-1', style.ring)}>
              <img src={entry.guardian.avatar} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-2" />
            </div>
            <p className="text-sm font-semibold text-ice text-center">{entry.guardian.name}</p>
            <p className="font-mono text-xs text-mist">{entry.guardian.xp.toLocaleString()} XP</p>
            <div
              className={cn(
                'w-20 sm:w-24 glass-strong rounded-t-lg flex items-start justify-center pt-2 font-display text-xl font-bold text-gradient',
                style.height
              )}
            >
              {style.label}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
