import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Chip({
  className,
  tone = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: 'default' | 'blue' | 'neon' | 'amber' | 'danger' }) {
  const tones: Record<string, string> = {
    default: 'bg-black/5 text-mist border-line',
    blue: 'bg-guardian-blue/15 text-guardian-blue border-guardian-blue/30',
    neon: 'bg-neon/15 text-neon border-neon/30',
    amber: 'bg-amber/15 text-amber border-amber/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide',
        tones[tone],
        className
      )}
      {...props}
    />
  )
}
