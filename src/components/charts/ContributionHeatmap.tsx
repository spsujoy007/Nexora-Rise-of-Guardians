function intensity(v: number) {
  if (v === 0) return 'bg-surface-2'
  if (v === 1) return 'bg-amber/30'
  if (v === 2) return 'bg-amber/60'
  if (v === 3) return 'bg-amber/80'
  return 'bg-amber'
}

export function ContributionHeatmap({ data }: { data: number[] }) {
  const weeks: number[][] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  const legend = [0, 1, 2, 3, 4]
  const weekdayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)
  startDate.setDate(startDate.getDate() - data.length + 1)
  const monthLabels = weeks.map((_, weekIndex) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + weekIndex * 7)
    return date.getDate() <= 7 ? date.toLocaleDateString('en-US', { month: 'short' }) : ''
  })

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-1">
        <div className="grid grid-cols-[28px_auto] gap-x-2 w-max" aria-label="Contribution activity by day">
          <div />
          <div className="flex gap-[3px] h-5 text-[11px] text-mist">
            {monthLabels.map((label, index) => (
              <span key={index} className="w-[10px] shrink-0">{label}</span>
            ))}
          </div>
          <div className="flex flex-col justify-between h-[88px] text-[11px] text-mist">
            {weekdayLabels.map((label, index) => <span key={index}>{label}</span>)}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((v, di) => (
                  <div
                    key={di}
                    className={`w-[10px] h-[10px] rounded-[2px] ${intensity(v)}`}
                    title={`${v} contributions`}
                    aria-label={`${v} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 text-[11px] text-mist">
        <span>Learn how we count contributions</span>
        <div className="flex items-center gap-2" aria-label="Contribution intensity legend">
          <span>Less</span>
          <div className="flex gap-[3px]" aria-hidden="true">
            {legend.map((value) => (
              <span key={value} className={`w-[10px] h-[10px] rounded-[2px] ${intensity(value)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
