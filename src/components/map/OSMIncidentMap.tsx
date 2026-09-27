import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import type { Incident } from '@/lib/types'
import { severityColor } from '@/lib/gamification'
import { Chip } from '@/components/ui/Chip'

export function OSMIncidentMap({ incidents, className }: { incidents: Incident[]; className?: string }) {
  const [active, setActive] = useState<Incident | null>(null)

  const center = useMemo(() => {
    if (incidents.length === 0) return [0, 0] as [number, number]
    const lat = incidents.reduce((sum, i) => sum + i.lat, 0) / incidents.length
    const lng = incidents.reduce((sum, i) => sum + i.lng, 0) / incidents.length
    return [lat, lng] as [number, number]
  }, [incidents])

  return (
    <div className={`relative rounded-2xl overflow-hidden hud-grid border border-line bg-surface ${className ?? ''}`}>
      <div className="absolute top-3 right-3 z-[1000]">
        <Chip tone="blue">● LIVE HOTSPOT MAP</Chip>
      </div>

      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '340px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {incidents.map((incident) => (
          <CircleMarker
            key={incident.id}
            center={[incident.lat, incident.lng]}
            pathOptions={{ 
                fillColor: severityColor(incident.severity), 
                color: '#05070D', 
                weight: 1.5, 
                fillOpacity: 0.85 
            }}
            radius={7}
            eventHandlers={{
                mouseover: () => setActive(incident),
                mouseout: () => setActive(null),
                click: () => setActive(incident)
            }}
          />
        ))}
      </MapContainer>

      {active && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000]">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-xl px-4 py-3 shadow-lg"
          >
            <p className="text-sm font-medium text-ice">{active.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Chip tone={active.severity === 'Critical' || active.severity === 'High' ? 'danger' : 'amber'}>{active.severity}</Chip>
              <Chip>{active.type}</Chip>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
