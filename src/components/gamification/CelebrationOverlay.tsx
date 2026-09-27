import { AnimatePresence, motion } from 'framer-motion'
import { useGuardianStore } from '@/store/useGuardianStore'
import { Confetti } from './Confetti'
import { guardianRankLabel } from '@/lib/mockData'
import { Button } from '@/components/ui/Button'

export function CelebrationOverlay() {
  const celebration = useGuardianStore((s) => s.celebration)
  const clear = useGuardianStore((s) => s.clearCelebration)

  return (
    <AnimatePresence>
      {celebration.type === 'levelup' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 backdrop-blur-sm"
        >
          <Confetti />
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="glass-strong rounded-3xl px-10 py-10 text-center max-w-sm mx-4 glow-neon"
          >
            <p className="font-display uppercase tracking-[0.3em] text-xs text-neon mb-2">Level Up</p>
            <h2 className="font-display text-5xl font-bold text-gradient mb-2">LV {celebration.payload}</h2>
            <p className="text-sm text-mist mb-6">
              You've reached <span className="text-ice font-medium">{guardianRankLabel(Number(celebration.payload))}</span> tier
            </p>
            <Button variant="neon" onClick={clear} className="w-full">
              Continue Guardian Duty
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
