import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Incident } from '@/lib/types'
import { severityColor } from '@/lib/gamification'
import { Chip } from '@/components/ui/Chip'

// ============================================================
// Stylized placeholder "tactical map" rendered in pure SVG so the full
// experience works with zero API keys. IncidentMap.tsx (the switcher)
// swaps this out automatically for RealGoogleIncidentMap once
// VITE_GOOGLE_MAPS_API_KEY is set — nothing here needs to change by hand.
// ============================================================

function project(lat: number, lng: number, bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
  const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100
  return { x, y }
}

export function StylizedIncidentMap({ incidents, className }: { incidents: Incident[]; className?: string }) {
  const [active, setActive] = useState<Incident | null>(null)

  const bounds = useMemo(() => {
    const lats = incidents.map((i) => i.lat)
    const lngs = incidents.map((i) => i.lng)
    const pad = 0.006
    return {
      minLat: Math.min(...lats) - pad,
      maxLat: Math.max(...lats) + pad,
      minLng: Math.min(...lngs) - pad,
      maxLng: Math.max(...lngs) + pad,
    }
  }, [incidents])

  return (
    <div className={`relative rounded-2xl overflow-hidden hud-grid border border-line bg-surface ${className ?? ''}`}>
      <div className="absolute top-3 left-3 z-10">
        <Chip tone="blue">● LIVE HOTSPOT MAP</Chip>
      </div>
      <div className="absolute top-3 right-3 z-10 text-[10px] font-mono text-mist bg-void/60 px-2 py-1 rounded-md border border-line">
        simulated · connect Google Maps API for live tiles
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-[340px]">
        <defs>
          <radialGradient id="glowSpot" r="50%">
            <stop offset="0%" stopColor="var(--color-guardian-blue)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-guardian-blue)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#glowSpot)" />

        {incidents.map((incident) => {
          const { x, y } = project(incident.lat, incident.lng, bounds)
          const color = severityColor(incident.severity)
          return (
            <g key={incident.id} onMouseEnter={() => setActive(incident)} onMouseLeave={() => setActive(null)} className="cursor-pointer">
              <circle cx={x} cy={y} r={5} fill={color} opacity={0.18}>
                <animate attributeName="r" values="4;8;4" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0;0.25" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r={2} fill={color} stroke="#05070D" strokeWidth={0.5} />
            </g>
          )
        })}
      </svg>

      {active && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 glass-strong rounded-xl px-4 py-3"
        >
          <p className="text-sm font-medium text-ice">{active.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Chip tone={active.severity === 'Critical' || active.severity === 'High' ? 'danger' : 'amber'}>{active.severity}</Chip>
            <Chip>{active.type}</Chip>
          </div>
        </motion.div>
      )}
    </div>
  )
}
