import { lazy, Suspense } from 'react'
import type { Incident } from '@/lib/types'
import { isMapsConfigured } from '@/lib/firebase'
import { StylizedIncidentMap } from './StylizedIncidentMap'

// ============================================================
// Public API used by every page (Dashboard, Landing, MunicipalDashboard).
// This is the ON/OFF switch: renders the zero-config SVG map by default,
// and lazy-loads the real Google Map only once VITE_GOOGLE_MAPS_API_KEY
// is set — so the Maps SDK never even downloads in mock mode.
// ============================================================

const RealGoogleIncidentMap = lazy(() =>
  import('./RealGoogleIncidentMap').then((m) => ({ default: m.RealGoogleIncidentMap }))
)

export function IncidentMap({ incidents, className }: { incidents: Incident[]; className?: string }) {
  if (!isMapsConfigured) {
    return <StylizedIncidentMap incidents={incidents} className={className} />
  }

  return (
    <Suspense fallback={<StylizedIncidentMap incidents={incidents} className={className} />}>
      <RealGoogleIncidentMap incidents={incidents} className={className} />
    </Suspense>
  )
}
