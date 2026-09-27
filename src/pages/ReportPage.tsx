import { useEffect, useState } from 'react'
import { ReportForm } from '@/components/report/ReportForm'
import { generateMunicipalSummary } from '@/lib/aiAnalysis'
import { Sparkles } from 'lucide-react'

export function ReportPage() {
  const [summary, setSummary] = useState<string>('')

  useEffect(() => {
    // Fetch the live Gemini AI summary using a mock number of reports for demonstration
    generateMunicipalSummary(124, 'Illegal Dumping').then((res) => {
      setSummary(res)
    }).catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-xs uppercase tracking-widest text-neon mb-1">Citizen Report</p>
        <h1 className="text-2xl font-bold text-ice">Protect your city in under a minute</h1>
        <p className="text-sm text-mist mt-1">Every verified report earns XP, Eco Coins, and moves your city closer to clean.</p>
      </div>

      {summary && (
        <div className="rounded-xl glass border border-neon/30 p-4 flex items-start gap-3">
          <Sparkles className="text-neon shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-ice/90 leading-relaxed italic">
            <strong className="text-neon">Gemini City AI Insight:</strong> {summary}
          </p>
        </div>
      )}

      <ReportForm />
    </div>
  )
}
