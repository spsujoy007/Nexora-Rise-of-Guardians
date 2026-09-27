import type { RankTier } from './types'

// Guardian rank tiers unlocked at specific levels
export const RANK_TIERS: RankTier[] = [
  { level: 1, name: 'Recruit' },
  { level: 5, name: 'Scout' },
  { level: 10, name: 'Sentinel' },
  { level: 20, name: 'Guardian' },
  { level: 35, name: 'Elite Guardian' },
  { level: 50, name: 'Titan' },
  { level: 70, name: 'Commander' },
  { level: 90, name: 'Legend' },
  { level: 100, name: 'Nexora Guardian' },
]

export function getRankForLevel(level: number): RankTier {
  let current = RANK_TIERS[0]
  for (const tier of RANK_TIERS) {
    if (level >= tier.level) current = tier
    else break
  }
  return current
}

export function getNextRank(level: number): RankTier | null {
  return RANK_TIERS.find((t) => t.level > level) ?? null
}

// XP required to go from level N to N+1 (progressive curve)
export function xpForLevel(level: number): number {
  return Math.round(120 * Math.pow(level, 1.32) + 80)
}

// XP award table — the "why" behind every XP gain in the app
export const XP_REWARDS = {
  verifiedReport: 120,
  highQualityImage: 30,
  dailyLogin: 15,
  missionDaily: 40,
  missionWeekly: 150,
  missionMonthly: 600,
  weeklyStreakBonus: 80,
  monthlyStreakBonus: 350,
  inviteFriend: 60,
  verifyOthersReport: 20,
  comment: 5,
  receivedLike: 3,
  issueResolvedBonus: 200,
  communityEvent: 100,
} as const

export const ECO_COIN_REWARDS = {
  verifiedReport: 25,
  missionDaily: 10,
  missionWeekly: 40,
  missionMonthly: 150,
  issueResolvedBonus: 60,
  badgeUnlock: 50,
} as const

export function severityColor(severity: string): string {
  switch (severity) {
    case 'Critical':
      return 'var(--color-danger)'
    case 'High':
      return '#FF7A45'
    case 'Moderate':
      return 'var(--color-amber)'
    default:
      return 'var(--color-neon)'
  }
}

export function reputationLabel(rep: number): string {
  if (rep >= 9000) return 'Trusted Guardian'
  if (rep >= 6000) return 'Verified Guardian'
  if (rep >= 3000) return 'Rising Guardian'
  return 'New Guardian'
}
