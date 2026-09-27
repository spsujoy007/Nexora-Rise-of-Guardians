import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Progress({
  value,
  max,
  className,
  barClassName,
  height = 8,
}: {
  value: number
  max: number
  className?: string
  barClassName?: string
  height?: number
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div
      className={cn('w-full rounded-full bg-black/5 overflow-hidden border border-line', className)}
      style={{ height }}
    >
      <motion.div
        className={cn('h-full rounded-full bg-gradient-to-r from-guardian-blue to-neon', barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}
