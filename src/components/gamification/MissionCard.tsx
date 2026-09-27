import { motion } from 'framer-motion'
import { CheckCircle2, Zap, Coins } from 'lucide-react'
import type { Mission } from '@/lib/types'
import { Progress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'

export function MissionCard({ mission, onAdvance }: { mission: Mission; onAdvance?: (id: string) => void }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'rounded-xl glass p-4 flex flex-col gap-3 border',
        mission.completed ? 'border-neon/40' : 'border-line'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ice">{mission.title}</p>
          <p className="text-xs text-mist mt-0.5">{mission.description}</p>
        </div>
        {mission.completed && <CheckCircle2 className="text-neon shrink-0" size={20} />}
      </div>

      <Progress value={mission.progress} max={mission.target} height={7} />
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-mist">
          {mission.progress}/{mission.target}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-guardian-blue font-mono">
            <Zap size={12} /> {mission.xpReward}
          </span>
          <span className="flex items-center gap-1 text-amber font-mono">
            <Coins size={12} /> {mission.coinReward}
          </span>
        </div>
      </div>

      {!mission.completed && onAdvance && (
        <button
          onClick={() => onAdvance(mission.id)}
          className="mt-1 text-xs font-medium text-guardian-blue hover:text-neon transition-colors self-start"
        >
          Simulate progress →
        </button>
      )}
    </motion.div>
  )
}
