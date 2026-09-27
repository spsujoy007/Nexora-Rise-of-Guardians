import { motion } from 'framer-motion'
import { TreeDeciduous, Leaf, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Progress } from '@/components/ui/Progress'
import { LevelRing } from '@/components/gamification/LevelRing'
import { BadgeGrid } from '@/components/gamification/BadgeGrid'
import { ContributionHeatmap } from '@/components/charts/ContributionHeatmap'
import { MissionCard } from '@/components/gamification/MissionCard'
import { useGuardianStore } from '@/store/useGuardianStore'
import { CONTRIBUTION_HEATMAP, guardianRankLabel } from '@/lib/mockData'
import { reputationLabel } from '@/lib/gamification'
import useGoogleAuth from '@/hooks/useGoogleAuth'

const ACTIVITY = [
  { text: 'Filed a report at Sayajigunj Lake', time: '2h ago', xp: 120 },
  { text: 'Verified a report by Priya Sharma', time: '5h ago', xp: 20 },
  { text: 'Completed weekly mission: Invite two Guardians', time: '1d ago', xp: 150 },
  { text: 'Report at Makarpura Industrial Estate marked Resolved', time: '2d ago', xp: 200 },
  { text: "Unlocked badge: AI Verified", time: '3d ago', xp: 0 },
]

export function Profile() {
  const {user}= useGoogleAuth()

  const guardian = useGuardianStore((s) => s.guardian)
  const daily = useGuardianStore((s) => s.dailyMissions)
  const weekly = useGuardianStore((s) => s.weeklyMissions)

  return (
    <div className="space-y-6">
      <Card strong>
        <CardBody className="flex flex-col sm:flex-row items-center gap-6">
          <LevelRing level={guardian.level} xp={guardian.xp} xpToNext={guardian.xpToNext} avatar={guardian.avatar} size={120} />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-2xl font-bold text-ice">{user?.displayName}</h1>
            <p className="text-sm text-mist">{user?.email?.split('@')[0] ?? guardian.handle.replace(/^@/, '')}.guardian</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <Chip tone="blue">{guardianRankLabel(guardian.level)}</Chip>
              <Chip tone="neon">{reputationLabel(guardian.reputation)}</Chip>
              <Chip><MapPin size={11} /> {guardian.city}</Chip>
              <Chip><Calendar size={11} /> Joined {new Date(guardian.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Chip>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-mono text-xl font-bold text-ice">{guardian.totalReports}</p>
              <p className="text-[10px] text-mist uppercase">Reports</p>
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-neon">{guardian.verifiedReports}</p>
              <p className="text-[10px] text-mist uppercase">Verified</p>
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-guardian-blue">{guardian.resolvedReports}</p>
              <p className="text-[10px] text-mist uppercase">Resolved</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Contribution Activity — Last 12 Months</CardTitle></CardHeader>
            <CardBody>
              <ContributionHeatmap data={CONTRIBUTION_HEATMAP} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Achievements & Badges</CardTitle></CardHeader>
            <CardBody>
              <BadgeGrid badges={guardian.badges} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
            <CardBody className="space-y-0">
              {ACTIVITY.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 py-3 border-b border-line last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-neon shrink-0" />
                  <p className="text-sm text-ice/90 flex-1">{a.text}</p>
                  <span className="text-[11px] text-mist">{a.time}</span>
                  {a.xp > 0 && <span className="text-[11px] font-mono text-guardian-blue">+{a.xp} XP</span>}
                </motion.div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><TrendingUp size={13} /> Impact Estimate</CardTitle></CardHeader>
            <CardBody className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-neon/10 border border-neon/30 p-4 text-center">
                <Leaf className="text-neon mx-auto mb-1.5" size={20} />
                <p className="font-mono text-lg font-bold text-ice">{guardian.carbonReducedKg}kg</p>
                <p className="text-[10px] text-mist uppercase">CO₂ Reduced</p>
              </div>
              <div className="rounded-xl bg-guardian-blue/10 border border-guardian-blue/30 p-4 text-center">
                <TreeDeciduous className="text-guardian-blue mx-auto mb-1.5" size={20} />
                <p className="font-mono text-lg font-bold text-ice">{guardian.treesEquivalent}</p>
                <p className="text-[10px] text-mist uppercase">Trees Equivalent</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Reputation</CardTitle></CardHeader>
            <CardBody>
              <div className="flex items-center justify-between text-xs text-mist mb-1.5">
                <span>Guardian Reputation</span>
                <span className="font-mono text-ice">{guardian.reputation.toLocaleString()}</span>
              </div>
              <Progress value={guardian.reputation} max={10000} height={8} />
              <p className="text-[11px] text-mist mt-2">Reach 9,000 to unlock Trusted Guardian status.</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Current Missions</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {[...daily.slice(0, 1), ...weekly.slice(0, 2)].map((m) => (
                <MissionCard key={m.id} mission={m} />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
