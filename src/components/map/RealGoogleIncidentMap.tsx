import { useState } from 'react'
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api'
import type { Incident } from '@/lib/types'
import { severityColor } from '@/lib/gamification'
import { Chip } from '@/components/ui/Chip'

const containerStyle = { width: '100%', height: '340px', borderRadius: '16px' }

// Dark, brand-matched map styling so the real map doesn't clash with the
// rest of the HUD aesthetic.
const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#0b1120' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1120' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8792A8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#101828' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#08111f' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
]

export function RealGoogleIncidentMap({ incidents, className }: { incidents: Incident[]; className?: string }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })
  const [active, setActive] = useState<Incident | null>(null)

  if (!isLoaded) {
    return (
      <div className={`rounded-2xl border border-line bg-surface flex items-center justify-center h-[340px] text-sm text-mist ${className ?? ''}`}>
        Loading map…
      </div>
    )
  }

  const center =
    incidents.length > 0
      ? { lat: incidents[0].lat, lng: incidents[0].lng }
      : { lat: 22.3072, lng: 73.1812 } // Vadodara fallback

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-line ${className ?? ''}`}>
      <div className="absolute top-3 left-3 z-10">
        <Chip tone="neon">● LIVE HOTSPOT MAP</Chip>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{ styles: mapStyles, disableDefaultUI: true, zoomControl: true }}
      >
        {incidents.map((incident) => (
          <MarkerF
            key={incident.id}
            position={{ lat: incident.lat, lng: incident.lng }}
            onClick={() => setActive(incident)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: severityColor(incident.severity),
              fillOpacity: 1,
              strokeColor: '#05070D',
              strokeWeight: 2,
            }}
          />
        ))}
        {active && (
          <InfoWindowF position={{ lat: active.lat, lng: active.lng }} onCloseClick={() => setActive(null)}>
            <div className="text-xs text-black">
              <p className="font-medium">{active.title}</p>
              <p className="mt-0.5">{active.severity} · {active.type}</p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  )
}
