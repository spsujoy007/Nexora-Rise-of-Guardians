import { motion } from 'framer-motion'
import { AlertTriangle, Activity, ShieldAlert, ClipboardList, Sparkles } from 'lucide-react'
import type { AIAnalysis } from '@/lib/types'
import { Chip } from '@/components/ui/Chip'
import { severityColor } from '@/lib/gamification'

export function AIAnalysisResult({ analysis }: { analysis: AIAnalysis }) {
  const sevTone = analysis.severity === 'Critical' || analysis.severity === 'High' ? 'danger' : analysis.severity === 'Moderate' ? 'amber' : 'neon'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-strong p-5 space-y-4"
    >
      <div className="flex items-center gap-2 text-neon">
        <Sparkles size={16} />
        <p className="font-display text-xs uppercase tracking-widest">Based on the info with Gemini AI</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip tone="blue">{analysis.pollutionType}</Chip>
        <Chip tone={sevTone as 'danger' | 'amber' | 'neon'}>
          <AlertTriangle size={11} /> {analysis.severity} severity
        </Chip>
        <Chip>
          <Activity size={11} /> {analysis.confidence}% confidence
        </Chip>
        {analysis.duplicateOf && <Chip tone="amber">Possible duplicate of {analysis.duplicateOf}</Chip>}
      </div>

      <p className="text-sm text-ice/90 leading-relaxed">{analysis.summary}</p>

      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-mist uppercase tracking-wide mb-1.5">
            <ShieldAlert size={12} /> Possible Cause
          </p>
          <p className="text-sm text-ice/85">{analysis.possibleCause}</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-mist uppercase tracking-wide mb-1.5">
            <AlertTriangle size={12} /> Health Risk
          </p>
          <p className="text-sm text-ice/85">{analysis.healthRisk}</p>
        </div>
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-mist uppercase tracking-wide mb-2">
          <ClipboardList size={12} /> Suggested Municipal Action
        </p>
        <ul className="space-y-1.5">
          {analysis.suggestedActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ice/90">
              <span className="text-neon mt-1">▹</span> {action}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="h-1 rounded-full"
        style={{ background: `linear-gradient(90deg, ${severityColor(analysis.severity)}, transparent)` }}
      />
    </motion.div>
  )
}


