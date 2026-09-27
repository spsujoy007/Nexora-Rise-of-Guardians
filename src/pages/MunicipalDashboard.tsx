import { useMemo, useState } from 'react'
import { Download, CheckCircle2, Sparkles, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { OSMIncidentMap } from '@/components/map/OSMIncidentMap'
import { CategoryDonut } from '@/components/charts/CategoryDonut'
import { AQITrendChart } from '@/components/charts/AQITrendChart'
import { useGuardianStore } from '@/store/useGuardianStore'
import { MAP_INCIDENTS, AQI_TREND, CATEGORY_BREAKDOWN } from '@/lib/mockData'
import { generateMunicipalSummary } from '@/lib/aiAnalysis'
import { cn } from '@/lib/utils'
import type { Severity, ReportStatus } from '@/lib/types'

const SEVERITIES: Array<Severity | 'All'> = ['All', 'Low', 'Moderate', 'High', 'Critical']

export function MunicipalDashboard() {
  const reports = useGuardianStore((s) => s.reports)
  const [severity, setSeverity] = useState<Severity | 'All'>('All')
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set())
  const [summary, setSummary] = useState<string | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)

  const filtered = useMemo(
    () => reports.filter((r) => severity === 'All' || r.analysis.severity === severity),
    [reports, severity]
  )

  function resolve(id: string) {
    setResolvedIds((prev) => new Set(prev).add(id))
  }

  function statusOf(id: string, original: ReportStatus): ReportStatus {
    return resolvedIds.has(id) ? 'Resolved' : original
  }

  async function runSummary() {
    setLoadingSummary(true)
    const s = await generateMunicipalSummary(filtered.length, filtered[0]?.analysis.pollutionType ?? 'Garbage Burning')
    setSummary(s)
    setLoadingSummary(false)
  }

  function exportCSV() {
    const rows = [
      ['ID', 'Title', 'Location', 'Severity', 'Type', 'Status', 'Confidence'],
      ...filtered.map((r) => [r.id, r.title, r.locationLabel, r.analysis.severity, r.analysis.pollutionType, statusOf(r.id, r.status), `${r.analysis.confidence}%`]),
    ]
    const csv = rows.map((row) => row.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nexora_reports_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-guardian-blue mb-1">Municipal Command Center</p>
          <h1 className="text-2xl font-bold text-ice">Environmental Operations Dashboard</h1>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download size={15} /> Export Reports
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>City Hotspot Map (OpenStreetMap)</CardTitle></CardHeader>
            <CardBody><OSMIncidentMap incidents={MAP_INCIDENTS} /></CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incoming Reports</CardTitle>
              <div className="flex gap-1.5">
                {SEVERITIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors',
                      severity === s ? 'bg-guardian-blue/15 text-guardian-blue border-guardian-blue/40' : 'text-mist border-line hover:text-ice'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-mist uppercase border-b border-line">
                    <th className="pb-2 pr-3">Report</th>
                    <th className="pb-2 pr-3">Location</th>
                    <th className="pb-2 pr-3">Severity</th>
                    <th className="pb-2 pr-3">Confidence</th>
                    <th className="pb-2 pr-3">Status</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const status = statusOf(r.id, r.status)
                    return (
                      <tr key={r.id} className="border-b border-line/60">
                        <td className="py-2.5 pr-3">
                          <p className="text-ice/90 font-medium truncate max-w-[180px]">{r.title}</p>
                          <p className="text-[11px] text-mist">{r.id}</p>
                        </td>
                        <td className="py-2.5 pr-3 text-mist text-xs">{r.locationLabel}</td>
                        <td className="py-2.5 pr-3">
                          <Chip tone={r.analysis.severity === 'Critical' || r.analysis.severity === 'High' ? 'danger' : 'amber'}>
                            {r.analysis.severity}
                          </Chip>
                        </td>
                        <td className="py-2.5 pr-3 font-mono text-xs text-mist">{r.analysis.confidence}%</td>
                        <td className="py-2.5 pr-3">
                          <Chip tone={status === 'Resolved' ? 'neon' : status === 'Dispatched' ? 'amber' : 'blue'}>{status}</Chip>
                        </td>
                        <td className="py-2.5 text-right">
                          {status !== 'Resolved' && (
                            <button onClick={() => resolve(r.id)} className="text-guardian-blue hover:text-neon">
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
            <CardBody><CategoryDonut data={CATEGORY_BREAKDOWN} /></CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle>AQI Trend</CardTitle></CardHeader>
            <CardBody><AQITrendChart data={AQI_TREND} /></CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><Sparkles size={13} className="text-neon" /> AI Municipal Summary</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {summary ? (
                <p className="text-sm text-ice/85 leading-relaxed">{summary}</p>
              ) : (
                <p className="text-sm text-mist">Generate a Gemini-written summary of current reports for your team briefing.</p>
              )}
              <Button variant="outline" size="sm" className="w-full" onClick={runSummary} disabled={loadingSummary}>
                {loadingSummary ? <><Loader2 size={13} className="animate-spin" /> Generating…</> : 'Generate Summary'}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
