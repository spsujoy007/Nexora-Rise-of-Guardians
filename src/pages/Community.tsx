import { useState } from 'react'
import { ReportCard } from '@/components/feed/ReportCard'
import { useGuardianStore } from '@/store/useGuardianStore'
import { cn } from '@/lib/utils'

const FILTERS = ['All', 'Pending', 'Verified', 'Dispatched', 'Resolved'] as const

export function Community() {
  const reports = useGuardianStore((s) => s.reports)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const filtered = filter === 'All' ? reports : reports.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-neon mb-1">Community Feed</p>
        <h1 className="text-2xl font-bold text-ice">Guardians in Action</h1>
        <p className="text-sm text-mist mt-1">Like, comment, and rally around reports from your city.</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              filter === f ? 'bg-guardian-blue/15 text-guardian-blue border-guardian-blue/40' : 'text-mist border-line hover:text-ice'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  )
}
