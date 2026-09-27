import { create } from 'zustand'
import type { Guardian, Report, Mission, AppNotification } from '@/lib/types'
import {
  CURRENT_GUARDIAN,
  RECENT_REPORTS,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  MONTHLY_MISSIONS,
  NOTIFICATIONS,
} from '@/lib/mockData'
import { xpForLevel } from '@/lib/gamification'
import { isFirebaseConfigured } from '@/lib/firebase'
import {
  subscribeToGuardian,
  subscribeToReports,
  createReport,
  awardXPTransaction,
} from '@/lib/firestoreService'
import type { Unsubscribe } from 'firebase/firestore'

// Module-level (not store state) so we can tear them down cleanly on logout
// without putting non-serializable function refs into Zustand state.
let unsubGuardian: Unsubscribe | null = null
let unsubReports: Unsubscribe | null = null
const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem('nexora-selected-avatar') : null

interface GuardianStore {
  guardian: Guardian
  reports: Report[]
  dailyMissions: Mission[]
  weeklyMissions: Mission[]
  monthlyMissions: Mission[]
  notifications: AppNotification[]
  isAuthenticated: boolean
  firebaseUid: string | null
  celebration: { type: 'levelup' | 'badge' | 'mission' | null; payload?: string }

  /** Mock-mode login — used when Firebase isn't configured (default demo experience). */
  login: () => void
  /**
   * Real-mode login — call after a successful Firebase signInWithPopup.
   * Starts live onSnapshot subscriptions that replace the mock arrays.
   */
  loginWithFirebase: (uid: string) => void
  logout: () => void
  addReport: (report: Report) => void
  awardXP: (amount: number, coins?: number) => void
  markNotificationsRead: () => void
  clearCelebration: () => void
  progressMission: (id: string) => void
}

export const useGuardianStore = create<GuardianStore>((set, get) => ({
  guardian: savedAvatar ? { ...CURRENT_GUARDIAN, avatar: savedAvatar } : CURRENT_GUARDIAN,
  reports: RECENT_REPORTS,
  dailyMissions: DAILY_MISSIONS,
  weeklyMissions: WEEKLY_MISSIONS,
  monthlyMissions: MONTHLY_MISSIONS,
  notifications: NOTIFICATIONS,
  isAuthenticated: false,
  firebaseUid: null,
  celebration: { type: null },

  login: () => set({ isAuthenticated: true }),

  loginWithFirebase: (uid) => {
    unsubGuardian?.()
    unsubReports?.()

    unsubGuardian = subscribeToGuardian(uid, (guardian) => set({ guardian }))
    unsubReports = subscribeToReports((reports) => set({ reports }))

    set({ isAuthenticated: true, firebaseUid: uid })
  },

  logout: () => {
    unsubGuardian?.()
    unsubReports?.()
    unsubGuardian = null
    unsubReports = null
    set({ isAuthenticated: false, firebaseUid: null })
  },

  addReport: async (report) => {
    const { firebaseUid } = get()

    if (isFirebaseConfigured && firebaseUid) {
      // Live mode: write to Firestore. The onSnapshot subscription above
      // will bring the new report into state automatically — no local
      // push needed, which also means every Guardian sees it appear live.
      const { id: _unused, ...reportData } = report
      await createReport(reportData)
      await get().awardXP(120, 25)
      return
    }

    // Mock mode: keep the local-array behavior so the demo still works
    // with zero configuration.
    set((state) => ({ reports: [report, ...state.reports] }))
    get().awardXP(120, 25)
  },

  awardXP: async (amount, coins = 0) => {
    const { firebaseUid } = get()

    if (isFirebaseConfigured && firebaseUid) {
      const { leveledUpTo } = await awardXPTransaction(firebaseUid, amount, coins)
      if (leveledUpTo) set({ celebration: { type: 'levelup', payload: String(leveledUpTo) } })
      // The guardian doc's onSnapshot subscription updates `guardian` itself.
      return
    }

    set((state) => {
      let { xp, level } = state.guardian
      xp += amount
      let leveledUp = false
      let threshold = xpForLevel(level)
      while (xp >= threshold) {
        xp -= threshold
        level += 1
        leveledUp = true
        threshold = xpForLevel(level)
      }
      const newGuardian: Guardian = {
        ...state.guardian,
        xp,
        level,
        xpToNext: threshold,
        ecoCoins: state.guardian.ecoCoins + coins,
        contributionScore: state.guardian.contributionScore + amount,
      }
      return {
        guardian: newGuardian,
        celebration: leveledUp ? { type: 'levelup', payload: String(level) } : state.celebration,
      }
    })
  },

  markNotificationsRead: () =>
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

  clearCelebration: () => set({ celebration: { type: null } }),

  progressMission: (id) => {
    set((state) => {
      const bump = (missions: Mission[]) =>
        missions.map((m) =>
          m.id === id && !m.completed
            ? { ...m, progress: Math.min(m.target, m.progress + 1), completed: m.progress + 1 >= m.target }
            : m
        )
      return {
        dailyMissions: bump(state.dailyMissions),
        weeklyMissions: bump(state.weeklyMissions),
        monthlyMissions: bump(state.monthlyMissions),
      }
    })
  },
}))
