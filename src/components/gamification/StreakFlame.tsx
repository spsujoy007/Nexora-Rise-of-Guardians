import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StreakFlame({ label, count, active = true }: { label: string; count: number; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl glass px-4 py-3 min-w-[92px]">
      <motion.div
        animate={active ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className={cn('relative', active ? 'text-amber' : 'text-mist')}
      >
        <Flame size={26} fill={active ? 'var(--color-amber)' : 'none'} strokeWidth={1.5} />
      </motion.div>
      <span className="font-mono text-lg font-bold text-ice leading-none">{count}</span>
      <span className="text-[10px] uppercase tracking-wider text-mist">{label}</span>
    </div>
  )
}
