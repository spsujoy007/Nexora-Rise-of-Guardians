import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Trophy, MapPinned, Camera, Users, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'
import { LeaderboardPodium } from '@/components/gamification/LeaderboardPodium'
import { MissionCard } from '@/components/gamification/MissionCard'
import { IncidentMap } from '@/components/map/IncidentMap'
import { LEADERBOARD_GLOBAL, MAP_INCIDENTS, DAILY_MISSIONS } from '@/lib/mockData'
import { formatNumber } from '@/lib/utils'

const FEATURES = [
  { icon: Camera, title: 'Report in Seconds', desc: 'Snap a photo, drop a pin — Gemini AI classifies severity and cause instantly.' },
  { icon: Zap, title: 'Level Up Your Impact', desc: 'Earn XP, Eco Coins and reputation for every verified action you take.' },
  { icon: Trophy, title: 'Climb the Ranks', desc: 'Compete on city, state, and global leaderboards. Top Guardians get recognized.' },
  { icon: MapPinned, title: 'Live Hotspot Intel', desc: 'See pollution incidents unfold on a real-time city map as they happen.' },
  { icon: Users, title: 'Guardian Network', desc: 'Follow, verify, and team up with other Guardians defending your city.' },
  { icon: Shield, title: 'Municipal Response', desc: 'Verified reports route straight to ward officers for rapid dispatch.' },
]

const STATS = [
  { label: 'Active Guardians', value: 48200 },
  { label: 'Incidents Resolved', value: 112500 },
  { label: 'Cities Covered', value: 34 },
  { label: 'CO₂ Reduced (kg)', value: 892000 },
]

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen hud-grid overflow-x-hidden">
      {/* Top bar */}
      <header className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/nexora_logo.png" alt="Nexora Logo" className="h-6 w-auto object-contain" />
          
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
          Guardian Login
        </Button>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative">
        <div className="absolute -top-20 right-0 w-[420px] h-[420px] bg-guardian-blue/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-0 w-[380px] h-[380px] bg-neon/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium text-neon mb-6">
            <Sparkles size={12} /> Powered by Gemini AI
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight text-ice">
            Become a <span className="text-gradient">Guardian</span> of your city
          </h1>
          <p className="mt-6 text-lg text-mist max-w-xl mx-auto">
            NEXORA turns environmental reporting into a game you actually want to play — report hazards,
            earn XP, unlock badges, and race up the leaderboard while your city gets cleaner.
          </p>
          <div className="mt-9 flex items-center justify-center gap-4">
            <Button variant="neon" size="lg" onClick={() => navigate('/login')}>
              Start Your Mission <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
              Explore Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
        >
          {STATS.map((s) => (
            <Card key={s.label} className="text-center py-5">
              <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">{formatNumber(s.value)}</p>
              <p className="text-xs text-mist mt-1">{s.label}</p>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-bold text-center mb-2">Everything a Guardian needs</h2>
        <p className="text-center text-mist mb-10">One platform. Real impact. Addictive progress.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full">
                <CardBody>
                  <div className="w-11 h-11 rounded-xl bg-guardian-blue/15 flex items-center justify-center text-guardian-blue mb-4">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-ice mb-1.5">{f.title}</h3>
                  <p className="text-sm text-mist leading-relaxed">{f.desc}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map + Mission preview */}
      <section className="max-w-7xl mx-auto px-6 py-16 ">
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Today's Operations</h2>
          <div className="space-y-3">
            {DAILY_MISSIONS.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard preview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-xl font-bold text-center mb-6">This Week's Top Guardians</h2>
        <Card strong>
          <CardBody>
            <LeaderboardPodium top3={LEADERBOARD_GLOBAL.slice(0, 3)} />
          </CardBody>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Your city needs Guardians.</h2>
        <p className="text-mist mb-8">Join thousands turning everyday walks into environmental missions.</p>
        <Button variant="neon" size="lg" onClick={() => navigate('/login')}>
          Join NEXORA Free <ArrowRight size={16} />
        </Button>
      </section>

      <footer className="border-t border-line py-8 text-center text-xs text-mist">
        NEXORA — The Future of Environmental Intelligence.
      </footer>
    </div>
  )
}
