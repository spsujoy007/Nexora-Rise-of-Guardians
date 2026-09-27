import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, Minus, Award } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/types'
import { guardianRankLabel } from '@/lib/mockData'
import { cn } from '@/lib/utils'

export function LeaderboardRow({ entry, highlight, index }: { entry: LeaderboardEntry; highlight?: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className={cn(
        'flex items-center gap-4 rounded-xl px-4 py-3 transition-colors',
        highlight ? 'glass-strong glow-blue' : 'hover:bg-black/[0.03]'
      )}
    >
      <span className="w-6 text-center font-mono text-sm text-mist">{entry.rank}</span>
      <img src={entry.guardian.avatar} className="w-9 h-9 rounded-full bg-surface-2" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ice truncate">{entry.guardian.name}</p>
        <p className="text-[11px] text-mist">{guardianRankLabel(entry.guardian.level)} · Lv {entry.guardian.level}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-xs text-mist">
        <Award size={13} /> {entry.guardian.badgeCount}
      </div>
      <span className="font-mono text-sm text-neon w-20 text-right">{entry.guardian.xp.toLocaleString()} XP</span>
      <span
        className={cn(
          'flex items-center gap-0.5 text-xs w-10 justify-end',
          entry.change > 0 ? 'text-neon' : entry.change < 0 ? 'text-danger' : 'text-mist'
        )}
      >
        {entry.change > 0 ? <ArrowUp size={12} /> : entry.change < 0 ? <ArrowDown size={12} /> : <Minus size={12} />}
        {Math.abs(entry.change) || ''}
      </span>
    </motion.div>
  )
}
