import type {
  Guardian,
  Badge,
  Mission,
  Report,
  LeaderboardEntry,
  AppNotification,
  Incident,
} from './types'
import { getRankForLevel, xpForLevel } from './gamification'

const AVATAR = (seed: string) => `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=1e2a3f,101828`

export const ALL_BADGES: Badge[] = [
  { id: 'first-report', name: 'First Report', description: 'Submitted your first incident report', icon: '🎯', tier: 'bronze', unlocked: true, unlockedAt: '2025-11-02' },
  { id: 'smoke-hunter', name: 'Smoke Hunter', description: 'Reported 10 smoke incidents', icon: '🔥', tier: 'silver', unlocked: true, unlockedAt: '2025-12-14' },
  { id: 'dust-slayer', name: 'Dust Slayer', description: 'Reported 15 dust/air pollution incidents', icon: '💨', tier: 'silver', unlocked: true, unlockedAt: '2026-01-08' },
  { id: 'green-guardian', name: 'Green Guardian', description: 'Helped resolve 25 issues', icon: '🛡️', tier: 'gold', unlocked: true, unlockedAt: '2026-02-20' },
  { id: 'river-protector', name: 'River Protector', description: 'Reported 10 water pollution incidents', icon: '🌊', tier: 'silver', unlocked: false },
  { id: 'tree-keeper', name: 'Tree Keeper', description: 'Flagged 5 deforestation cases', icon: '🌳', tier: 'silver', unlocked: false },
  { id: 'eco-warrior', name: 'Eco Warrior', description: 'Reached 1000 contribution score', icon: '⚔️', tier: 'gold', unlocked: true, unlockedAt: '2026-03-11' },
  { id: 'volunteer-hero', name: 'Volunteer Hero', description: 'Joined 3 community cleanup events', icon: '🤝', tier: 'gold', unlocked: false },
  { id: 'community-leader', name: 'Community Leader', description: 'Invited 10 Guardians', icon: '👑', tier: 'platinum', unlocked: false },
  { id: 'night-sentinel', name: 'Night Sentinel', description: '20 reports filed after 9pm', icon: '🌙', tier: 'silver', unlocked: true, unlockedAt: '2026-01-30' },
  { id: 'morning-scout', name: 'Morning Scout', description: '20 reports filed before 7am', icon: '🌅', tier: 'silver', unlocked: false },
  { id: 'hundred-reports', name: '100 Reports', description: 'Filed 100 verified reports', icon: '💯', tier: 'gold', unlocked: false },
  { id: 'thousand-xp', name: '1000 XP', description: 'Earned 1000 lifetime XP', icon: '⚡', tier: 'bronze', unlocked: true, unlockedAt: '2025-12-01' },
  { id: 'ai-verified', name: 'AI Verified', description: '50 reports confirmed by AI with 90%+ confidence', icon: '🤖', tier: 'gold', unlocked: true, unlockedAt: '2026-03-02' },
  { id: 'legend-reporter', name: 'Legend Reporter', description: 'Reached Legend rank', icon: '🏆', tier: 'platinum', unlocked: false },
  { id: 'climate-champion', name: 'Climate Champion', description: 'Reduced est. 500kg CO2 through verified reports', icon: '🌍', tier: 'platinum', unlocked: false },
  { id: 'founding-guardian', name: 'Founding Guardian', description: 'Joined during launch week', icon: '🥇', tier: 'platinum', unlocked: true, unlockedAt: '2025-11-01' },
]

export const CURRENT_GUARDIAN: Guardian = {
  id: 'g-001',
  name: 'Aarav Mehta',
  handle: '@aarav.guardian',
  avatar: AVATAR('aarav'),
  city: 'Vadodara',
  level: 27,
  xp: 1840,
  xpToNext: xpForLevel(27),
  reputation: 6420,
  ecoCoins: 3120,
  contributionScore: 8760,
  totalReports: 142,
  verifiedReports: 118,
  resolvedReports: 94,
  streakDaily: 23,
  streakWeekly: 9,
  streakMonthly: 3,
  badges: ALL_BADGES,
  joinedAt: '2025-11-01',
  carbonReducedKg: 412,
  treesEquivalent: 19,
  rankGlobal: 187,
}

export const DAILY_MISSIONS: Mission[] = [
  { id: 'd1', cadence: 'daily', title: 'Report one pollution incident', description: 'File a new verified report anywhere in your city', progress: 1, target: 1, xpReward: 40, coinReward: 10, completed: true },
  { id: 'd2', cadence: 'daily', title: 'Verify three reports', description: 'Help confirm reports submitted by other Guardians', progress: 2, target: 3, xpReward: 40, coinReward: 10, completed: false },
  { id: 'd3', cadence: 'daily', title: 'Complete one patrol', description: 'Walk your assigned patrol zone and check for hazards', progress: 0, target: 1, xpReward: 40, coinReward: 10, completed: false },
]

export const WEEKLY_MISSIONS: Mission[] = [
  { id: 'w1', cadence: 'weekly', title: 'Report five incidents', description: 'File five verified reports this week', progress: 3, target: 5, xpReward: 150, coinReward: 40, completed: false },
  { id: 'w2', cadence: 'weekly', title: 'Help resolve two issues', description: 'Contribute follow-up evidence that leads to resolution', progress: 1, target: 2, xpReward: 150, coinReward: 40, completed: false },
  { id: 'w3', cadence: 'weekly', title: 'Invite two Guardians', description: 'Grow the Guardian network in your city', progress: 2, target: 2, xpReward: 150, coinReward: 40, completed: true },
]

export const MONTHLY_MISSIONS: Mission[] = [
  { id: 'm1', cadence: 'monthly', title: 'Become Top Guardian', description: 'Finish in the top 10 of your city leaderboard', progress: 14, target: 10, xpReward: 600, coinReward: 150, completed: false },
  { id: 'm2', cadence: 'monthly', title: 'Complete fifty reports', description: 'File 50 reports across the month', progress: 31, target: 50, xpReward: 600, coinReward: 150, completed: false },
  { id: 'm3', cadence: 'monthly', title: 'Help clean community', description: 'Join a verified community cleanup drive', progress: 0, target: 1, xpReward: 600, coinReward: 150, completed: false },
]

const NAMES = [
  'Priya Sharma', 'Rohan Patel', 'Ananya Iyer', 'Karan Verma', 'Ishaan Gupta',
  'Sneha Reddy', 'Vivaan Joshi', 'Diya Nair', 'Arjun Rao', 'Meera Kulkarni',
  'Kabir Malhotra', 'Tara Desai', 'Aditya Singh', 'Riya Kapoor', 'Yash Chawla',
]

function seededGuardianEntry(i: number): LeaderboardEntry {
  const level = Math.max(6, 100 - i * 3 - Math.floor(Math.random() * 4))
  return {
    rank: i + 1,
    guardian: {
      id: `g-${100 + i}`,
      name: NAMES[i % NAMES.length],
      handle: `@${NAMES[i % NAMES.length].split(' ')[0].toLowerCase()}`,
      avatar: AVATAR(NAMES[i % NAMES.length]),
      level,
      reputation: 9800 - i * 210,
      xp: 42000 - i * 1450,
      badgeCount: Math.max(3, 18 - i),
    },
    change: Math.floor(Math.random() * 5) - 2,
  }
}

export const LEADERBOARD_GLOBAL: LeaderboardEntry[] = Array.from({ length: 20 }, (_, i) => seededGuardianEntry(i))

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'levelup', title: 'Level Up!', message: 'You reached Level 27 — Elite Guardian tier unlocks at 35.', timestamp: '2m ago', read: false },
  { id: 'n2', type: 'badge', title: 'Badge Unlocked', message: 'AI Verified badge earned for 50 high-confidence reports.', timestamp: '1h ago', read: false },
  { id: 'n3', type: 'resolved', title: 'Issue Resolved', message: 'Your report at Sayajigunj Lake was resolved by the municipal team.', timestamp: '3h ago', read: true },
  { id: 'n4', type: 'rank', title: 'Top 10 Guardian', message: "You're now ranked #8 in Vadodara this week.", timestamp: 'Yesterday', read: true },
  { id: 'n5', type: 'mission', title: 'Mission Complete', message: "Weekly mission 'Invite two Guardians' complete. +150 XP.", timestamp: '2 days ago', read: true },
  { id: 'n6', type: 'challenge', title: 'New Challenge', message: 'Monsoon Cleanup Challenge is now live — earn 2x Eco Coins.', timestamp: '3 days ago', read: true },
]

const REPORT_TEMPLATES: Array<Pick<Report, 'title' | 'description' | 'locationLabel'> & { lat: number; lng: number; type: Report['analysis']['pollutionType']; severity: Report['analysis']['severity'] }> = [
  { title: 'Open garbage burning near market', description: 'Thick smoke from burning garbage behind the vegetable market, strong smell spreading to nearby homes', locationLabel: 'Raopura Market', lat: 22.3094, lng: 73.1812, type: 'Garbage Burning', severity: 'High' },
  { title: 'Industrial smoke from factory chimney', description: 'Factory chimney releasing dark smoke continuously since morning', locationLabel: 'Makarpura Industrial Estate', lat: 22.2587, lng: 73.1653, type: 'Industrial Emission', severity: 'Critical' },
  { title: 'Plastic waste piling near riverside', description: 'Large amount of plastic bottles and bags accumulating near the river bank', locationLabel: 'Vishwamitri Riverfront', lat: 22.3162, lng: 73.1943, type: 'Plastic Waste', severity: 'Moderate' },
  { title: 'Illegal dumping near residential lane', description: 'Construction debris and household waste dumped illegally on empty plot', locationLabel: 'Alkapuri Lane 4', lat: 22.3072, lng: 73.1723, type: 'Illegal Dumping', severity: 'Moderate' },
  { title: 'Sewage water overflow into drain', description: 'Sewage water overflowing from a broken pipe into the open drain', locationLabel: 'Sayajigunj', lat: 22.3126, lng: 73.1901, type: 'Water Pollution', severity: 'High' },
  { title: 'Trees cut illegally near park boundary', description: 'Several mature trees cut down overnight near the park boundary wall', locationLabel: 'Sursagar Park', lat: 22.3049, lng: 73.1937, type: 'Deforestation', severity: 'High' },
]

export const RECENT_REPORTS: Report[] = REPORT_TEMPLATES.map((t, i) => ({
  id: `RPT-${2200 + i}`,
  guardianId: `g-${100 + i}`,
  guardianName: NAMES[i % NAMES.length],
  guardianAvatar: AVATAR(NAMES[i % NAMES.length]),
  title: t.title,
  description: t.description,
  imageUrl: `https://picsum.photos/seed/nexora-${i}/640/420`,
  lat: t.lat,
  lng: t.lng,
  locationLabel: t.locationLabel,
  timestamp: `${(i + 1) * 2}h ago`,
  status: i === 0 ? 'Dispatched' : i === 1 ? 'Verified' : i % 3 === 0 ? 'Resolved' : 'Pending',
  likes: 12 + i * 7,
  comments: 2 + i,
  analysis: {
    pollutionType: t.type,
    severity: t.severity,
    confidence: 84 + i * 2,
    possibleCause: 'AI-inferred cause based on visual evidence and description context.',
    healthRisk: 'Localized health risk to nearby residents; see full analysis for detail.',
    suggestedActions: ['Dispatch cleanup team', 'Notify ward officer', 'Advise nearby residents'],
    duplicateOf: null,
    summary: `AI detected ${t.type.toLowerCase()} classified as ${t.severity} severity.`,
  },
}))

export const MAP_INCIDENTS: Incident[] = RECENT_REPORTS.map((r) => ({
  id: r.id,
  lat: r.lat,
  lng: r.lng,
  severity: r.analysis.severity,
  type: r.analysis.pollutionType,
  title: r.title,
}))

export const AQI_TREND = [
  { day: 'Mon', aqi: 118 }, { day: 'Tue', aqi: 132 }, { day: 'Wed', aqi: 96 },
  { day: 'Thu', aqi: 141 }, { day: 'Fri', aqi: 108 }, { day: 'Sat', aqi: 87 }, { day: 'Sun', aqi: 103 },
]

export const CATEGORY_BREAKDOWN = [
  { name: 'Air / Smoke', value: 38 },
  { name: 'Waste Dumping', value: 26 },
  { name: 'Water Pollution', value: 18 },
  { name: 'Industrial', value: 12 },
  { name: 'Other', value: 6 },
]

export const CONTRIBUTION_HEATMAP: number[] = Array.from({ length: 371 }, (_, i) => {
  const noise = Math.sin(i * 0.35) * 0.5 + Math.random()
  return Math.max(0, Math.round(noise * 4))
})

export function guardianRankLabel(level: number) {
  return getRankForLevel(level).name
}
