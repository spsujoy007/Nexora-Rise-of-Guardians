
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CloudSun, Wind, Droplets, Sparkles, ArrowRight, Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Chip } from '@/components/ui/Chip'
import { LevelRing } from '@/components/gamification/LevelRing'
import { StreakFlame } from '@/components/gamification/StreakFlame'
import { MissionCard } from '@/components/gamification/MissionCard'
import { IncidentMap } from '@/components/map/IncidentMap'
import { AQITrendChart } from '@/components/charts/AQITrendChart'
import { LeaderboardRow } from '@/components/gamification/LeaderboardRow'
import { useGuardianStore } from '@/store/useGuardianStore'
import { MAP_INCIDENTS, AQI_TREND, LEADERBOARD_GLOBAL, RECENT_REPORTS } from '@/lib/mockData'
import { guardianRankLabel } from '@/lib/mockData'
import { reputationLabel } from '@/lib/gamification'
import useGoogleAuth from '@/hooks/useGoogleAuth'



export function Dashboard() {
  const {user, loading}= useGoogleAuth()
  console.log("The user: ", user)
  const guardian = useGuardianStore((s) => s.guardian)
  const dailyMissions = useGuardianStore((s) => s.dailyMissions)
  const progressMission = useGuardianStore((s) => s.progressMission)

  if(loading){
    return <></>
  }

  return (
    <div className="space-y-6">
      {/* Hero row */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-4">
        <Card strong className="lg:col-span-2">
          <CardBody className="flex flex-col sm:flex-row items-center gap-6">
            <LevelRing level={guardian.level} xp={guardian.xp} xpToNext={guardian.xpToNext} avatar={guardian.avatar} size={110} />
            <div className="flex-1 w-full text-center sm:text-left">
              <p className="text-xs text-mist uppercase tracking-wide">Welcome back</p>
              <h1 className="font-display text-2xl font-bold text-ice">{user?.displayName}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <Chip tone="blue">{guardianRankLabel(guardian.level)}</Chip>
                <Chip tone="neon">
                  <img src={guardian.avatar} className="w-3 h-3 mr-1" /> {guardian.coins}
                </Chip>
                <Chip>Global #{guardian.rankGlobal}</Chip>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-mist mb-1.5">
                  <span>XP Progress</span>
                  <span className="font-mono">{guardian.xp} / {guardian.xpToNext}</span>
                </div>
                <Progress value={guardian.xp} max={guardian.xpToNext} height={10} />
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <StreakFlame label="Day Streak" count={guardian.streakDaily} />
          <StreakFlame label="Week Streak" count={guardian.streakWeekly} />
          <StreakFlame label="Month Streak" count={guardian.streakMonthly} />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: map + AQI */}
        <div className="lg:col-span-2 space-y-6">
          

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardBody className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber/15 text-amber flex items-center justify-center"><CloudSun size={18} /></div>
                <div>
                  <p className="text-[11px] text-mist">Current AQI</p>
                  <p className="font-mono text-lg font-bold text-ice">103 <span className="text-xs text-amber">Moderate</span></p>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-guardian-blue/15 text-guardian-blue flex items-center justify-center"><Wind size={18} /></div>
                <div>
                  <p className="text-[11px] text-mist">Wind</p>
                  <p className="font-mono text-lg font-bold text-ice">12 <span className="text-xs text-mist">km/h NE</span></p>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon/15 text-neon flex items-center justify-center"><Droplets size={18} /></div>
                <div>
                  <p className="text-[11px] text-mist">Humidity</p>
                  <p className="font-mono text-lg font-bold text-ice">64<span className="text-xs text-mist">%</span></p>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>AQI Trend — Last 7 Days</CardTitle></CardHeader>
            <CardBody><AQITrendChart data={AQI_TREND} /></CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5"><Sparkles size={13} className="text-neon" /> AI Insight of the Day</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ice/85 leading-relaxed">
                Garbage burning reports have risen 22% around Raopura Market this week. Gemini recommends
                prioritizing a cleanup dispatch there before the weekend to prevent further AQI spikes in
                the surrounding residential blocks.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Right: missions + leaderboard + nearby */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Daily Operations</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {dailyMissions.map((m) => (
                <MissionCard key={m.id} mission={m} onAdvance={progressMission} />
              ))}
              <Link to="/missions" className="text-xs text-guardian-blue hover:text-neon flex items-center gap-1 justify-end pt-1">
                View all missions <ArrowRight size={12} />
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>City Leaderboard</CardTitle></CardHeader>
            <CardBody className="space-y-1">
              {LEADERBOARD_GLOBAL.slice(0, 5).map((entry, i) => (
                <LeaderboardRow key={entry.guardian.id} entry={entry} index={i} />
              ))}
              <Link to="/leaderboard" className="text-xs text-guardian-blue hover:text-neon flex items-center gap-1 justify-end pt-1">
                Full leaderboard <ArrowRight size={12} />
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><Flame size={13} className="text-amber" /> Nearby Incidents</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {RECENT_REPORTS.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <img src={r.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-ice truncate">{r.title}</p>
                    <p className="text-[10px] text-mist">{r.locationLabel} · {r.timestamp}</p>
                  </div>
                  <Chip tone={r.analysis.severity === 'Critical' || r.analysis.severity === 'High' ? 'danger' : 'amber'}>
                    {r.analysis.severity}
                  </Chip>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
