import { motion } from 'framer-motion'
import type { Badge } from '@/lib/types'
import { cn } from '@/lib/utils'

const tierRing: Record<Badge['tier'], string> = {
  bronze: 'from-[#B08D57] to-[#7A5B33]',
  silver: 'from-[#C9D3E0] to-[#7C8AA0]',
  gold: 'from-[#FFD36E] to-[#C99A2E]',
  platinum: 'from-[#39FF9E] to-[#2F6FF0]',
}

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          whileHover={{ y: -4 }}
          className="group flex flex-col items-center gap-2"
          title={badge.description}
        >
          <div
            className={cn(
              'clip-hex w-16 h-16 flex items-center justify-center text-2xl bg-gradient-to-br border border-black/10 transition-all',
              badge.unlocked ? tierRing[badge.tier] : 'from-black/5 to-black/0 grayscale opacity-40'
            )}
          >
            <span className={badge.unlocked ? '' : 'opacity-50'}>{badge.icon}</span>
          </div>
          <span className={cn('text-[11px] text-center leading-tight', badge.unlocked ? 'text-ice' : 'text-mist')}>
            {badge.name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
