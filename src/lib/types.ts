// ============================================================
// NEXORA domain types
// ============================================================

export type PollutionType =
  | 'Air Smoke'
  | 'Garbage Burning'
  | 'Water Pollution'
  | 'Illegal Dumping'
  | 'Industrial Emission'
  | 'Deforestation'
  | 'Noise Pollution'
  | 'Plastic Waste'

export type Severity = 'Low' | 'Moderate' | 'High' | 'Critical'

export type ReportStatus = 'Pending' | 'Verified' | 'Dispatched' | 'Resolved' | 'Rejected'

export interface AIAnalysis {
  pollutionType: PollutionType
  severity: Severity
  confidence: number // 0-100
  possibleCause: string
  healthRisk: string
  suggestedActions: string[]
  duplicateOf?: string | null
  summary: string
}

export interface Report {
  id: string
  guardianId: string
  guardianName: string
  guardianAvatar: string
  title: string
  description: string
  imageUrl: string
  lat: number
  lng: number
  locationLabel: string
  timestamp: string
  status: ReportStatus
  likes: number
  comments: number
  analysis: AIAnalysis
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  unlocked: boolean
  unlockedAt?: string
}

export type MissionCadence = 'daily' | 'weekly' | 'monthly'

export interface Mission {
  id: string
  cadence: MissionCadence
  title: string
  description: string
  progress: number
  target: number
  xpReward: number
  coinReward: number
  completed: boolean
}

export interface RankTier {
  level: number
  name: string
}

export interface Guardian {
  id: string
  name: string
  handle: string
  avatar: string
  city: string
  level: number
  xp: number
  xpToNext: number
  reputation: number
  ecoCoins: number
  contributionScore: number
  totalReports: number
  verifiedReports: number
  resolvedReports: number
  streakDaily: number
  streakWeekly: number
  streakMonthly: number
  badges: Badge[]
  joinedAt: string
  carbonReducedKg: number
  treesEquivalent: number
  rankGlobal: number
}

export interface LeaderboardEntry {
  rank: number
  guardian: Pick<Guardian, 'id' | 'name' | 'handle' | 'avatar' | 'level' | 'reputation'> & {
    xp: number
    badgeCount: number
  }
  change: number // rank delta vs last period
}

export interface AppNotification {
  id: string
  type: 'mission' | 'levelup' | 'badge' | 'rank' | 'resolved' | 'challenge'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export interface Incident {
  id: string
  lat: number
  lng: number
  severity: Severity
  type: PollutionType
  title: string
}
