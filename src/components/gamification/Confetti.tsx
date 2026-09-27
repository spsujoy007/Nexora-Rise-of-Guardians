import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#2F6FF0', '#39FF9E', '#FFB020', '#EAF2FF']

export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 2 + Math.random() * 1.5,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 6,
      })),
    [count]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute rounded-sm"
          style={{ width: p.size, height: p.size * 0.4, backgroundColor: p.color, top: 0 }}
        />
      ))}
    </div>
  )
}
