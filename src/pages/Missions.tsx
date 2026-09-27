import { useState } from 'react'
import { motion } from 'framer-motion'
import { MissionCard } from '@/components/gamification/MissionCard'
import { useGuardianStore } from '@/store/useGuardianStore'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'daily', label: 'Daily Operations' },
  { key: 'weekly', label: 'Weekly Operations' },
  { key: 'monthly', label: 'Monthly Operations' },
] as const

export function Missions() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('daily')
  const dailyMissions = useGuardianStore((s) => s.dailyMissions)
  const weeklyMissions = useGuardianStore((s) => s.weeklyMissions)
  const monthlyMissions = useGuardianStore((s) => s.monthlyMissions)
  const progressMission = useGuardianStore((s) => s.progressMission)

  const missions = tab === 'daily' ? dailyMissions : tab === 'weekly' ? weeklyMissions : monthlyMissions

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-neon mb-1">Guardian Operations</p>
        <h1 className="text-2xl font-bold text-ice">Missions</h1>
        <p className="text-sm text-mist mt-1">Complete operations to earn XP, Eco Coins, and streak bonuses.</p>
      </div>

      <div className="flex gap-2 rounded-xl glass p-1.5 w-full sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === t.key ? 'bg-guardian-blue text-white' : 'text-mist hover:text-ice'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {missions.map((m) => (
          <MissionCard key={m.id} mission={m} onAdvance={progressMission} />
        ))}
      </motion.div>
    </div>
  )
}
