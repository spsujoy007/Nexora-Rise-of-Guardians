import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react'
import type { Report } from '@/lib/types'
import { Chip } from '@/components/ui/Chip'

const statusTone: Record<Report['status'], 'blue' | 'amber' | 'neon' | 'danger' | 'default'> = {
  Pending: 'default',
  Verified: 'blue',
  Dispatched: 'amber',
  Resolved: 'neon',
  Rejected: 'danger',
}

export function ReportCard({ report }: { report: Report }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(report.likes)

  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl glass overflow-hidden">
      <div className="relative">
        <img src={report.imageUrl} alt={report.title} className="w-full h-44 object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Chip className="backdrop-blur-md !bg-white/95 shadow-sm" tone={statusTone[report.status]}>{report.status}</Chip>
          <Chip className="backdrop-blur-md !bg-white/95 shadow-sm" tone={report.analysis.severity === 'Critical' || report.analysis.severity === 'High' ? 'danger' : 'amber'}>
            {report.analysis.severity}
          </Chip>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <img src={report.guardianAvatar} className="w-7 h-7 rounded-full bg-surface-2" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-ice truncate">{report.guardianName}</p>
            <p className="text-[10px] text-mist">{report.timestamp}</p>
          </div>
        </div>
        <p className="text-sm text-ice/90 font-medium leading-snug">{report.title}</p>
        <p className="flex items-center gap-1 text-xs text-mist">
          <MapPin size={11} /> {report.locationLabel}
        </p>
        <div className="flex items-center gap-4 pt-2 border-t border-line">
          <button
            onClick={() => {
              setLiked((l) => !l)
              setLikes((n) => n + (liked ? -1 : 1))
            }}
            className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-danger' : 'text-mist hover:text-ice'}`}
          >
            <Heart size={15} fill={liked ? 'var(--color-danger)' : 'none'} /> {likes}
          </button>
          <span className="flex items-center gap-1.5 text-xs text-mist">
            <MessageCircle size={15} /> {report.comments}
          </span>
          <button className="flex items-center gap-1.5 text-xs text-mist hover:text-ice ml-auto">
            <Share2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
