import { useMemo, useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { LeaderboardPodium } from '@/components/gamification/LeaderboardPodium'
import { LeaderboardRow } from '@/components/gamification/LeaderboardRow'
import { LEADERBOARD_GLOBAL } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const SCOPES = ['Global', 'Country', 'State', 'District', 'City', 'College', 'Friends'] as const
const TIME_FILTERS = ['Today', 'Weekly', 'Monthly', 'All Time'] as const

export function Leaderboard() {
  const [scope, setScope] = useState<(typeof SCOPES)[number]>('City')
  const [time, setTime] = useState<(typeof TIME_FILTERS)[number]>('Weekly')

  // Reshuffle mock data deterministically based on filters so switching feels alive
  const data = useMemo(() => {
    const seed = SCOPES.indexOf(scope) + TIME_FILTERS.indexOf(time)
    return [...LEADERBOARD_GLOBAL]
      .map((e, i) => ({ ...e, rank: i + 1 }))
      .sort((a, b) => ((a.guardian.xp + seed * 7) % 97) - ((b.guardian.xp + seed * 7) % 97))
      .map((e, i) => ({ ...e, rank: i + 1 }))
  }, [scope, time])

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-neon mb-1">Rankings</p>
        <h1 className="text-2xl font-bold text-ice">Leaderboard</h1>
        <p className="text-sm text-mist mt-1">See who's leading the fight for a cleaner city.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {SCOPES.map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                scope === s ? 'bg-guardian-blue/15 text-guardian-blue border-guardian-blue/40' : 'text-mist border-line hover:text-ice'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 rounded-xl glass p-1">
          {TIME_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                time === t ? 'bg-neon text-[#03170D]' : 'text-mist hover:text-ice'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Card strong>
        <CardBody>
          <LeaderboardPodium top3={data.slice(0, 3)} />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-1">
          {data.map((entry, i) => (
            <LeaderboardRow key={entry.guardian.id} entry={entry} index={i} highlight={i === 7} />
          ))}
        </CardBody>
      </Card>
    </div>
  )
}
