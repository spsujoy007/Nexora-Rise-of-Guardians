import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Trophy, Star, Award, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react'
import { useGuardianStore } from '@/store/useGuardianStore'
import type { AppNotification } from '@/lib/types'

const ICONS: Record<AppNotification['type'], typeof Trophy> = {
  mission: CheckCircle2,
  levelup: Star,
  badge: Award,
  rank: TrendingUp,
  resolved: Trophy,
  challenge: Sparkles,
}

export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const notifications = useGuardianStore((s) => s.notifications)
  const markRead = useGuardianStore((s) => s.markNotificationsRead)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <p className="font-display text-xs uppercase tracking-wide text-ice">Notifications</p>
        <button onClick={markRead} className="text-[11px] text-guardian-blue hover:text-neon">
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((n) => {
          const Icon = ICONS[n.type]
          return (
            <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-line/60 ${!n.read ? 'bg-guardian-blue/5' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center shrink-0 text-neon">
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ice">{n.title}</p>
                <p className="text-[11px] text-mist mt-0.5 leading-snug">{n.message}</p>
                <p className="text-[10px] text-mist/60 mt-1">{n.timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
