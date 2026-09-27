import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit as fsLimit,
  runTransaction,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import { xpForLevel } from './gamification'
import type { Guardian, Report } from './types'

const GUARDIANS = 'guardians'
const REPORTS = 'reports'

/** Updates specific fields on a Guardian's profile (e.g. avatar chosen post-signup). */
export async function updateGuardianProfile(uid: string, updates: Partial<Guardian>): Promise<void> {
  if (!db) return
  await setDoc(doc(db, GUARDIANS, uid), updates, { merge: true })
}

/** Creates a fresh Guardian profile doc for a first-time signer. No-op if one already exists. */
export async function ensureGuardianDoc(uid: string, name: string, avatar: string): Promise<void> {
  if (!db) return
  const ref = doc(db, GUARDIANS, uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return

  const fresh: Omit<Guardian, 'id'> = {
    name,
    handle: `@${name.split(' ')[0]?.toLowerCase() ?? 'guardian'}`,
    avatar,
    city: 'Unknown',
    level: 1,
    xp: 0,
    xpToNext: xpForLevel(1),
    reputation: 0,
    ecoCoins: 0,
    contributionScore: 0,
    totalReports: 0,
    verifiedReports: 0,
    resolvedReports: 0,
    streakDaily: 0,
    streakWeekly: 0,
    streakMonthly: 0,
    badges: [],
    joinedAt: new Date().toISOString(),
    carbonReducedKg: 0,
    treesEquivalent: 0,
    rankGlobal: 0,
  }
  await setDoc(ref, fresh)
}

/** Live subscription to one Guardian's profile — fires immediately, then on every change. */
export function subscribeToGuardian(uid: string, onChange: (guardian: Guardian) => void): Unsubscribe | null {
  if (!db) return null
  return onSnapshot(doc(db, GUARDIANS, uid), (snap) => {
    if (!snap.exists()) return
    onChange({ id: uid, ...(snap.data() as Omit<Guardian, 'id'>) })
  })
}

/** Live subscription to the most recent reports across all Guardians. */
export function subscribeToReports(onChange: (reports: Report[]) => void, max = 100): Unsubscribe | null {
  if (!db) return null
  const reportsQuery = query(collection(db, REPORTS), orderBy('timestamp', 'desc'), fsLimit(max))
  return onSnapshot(reportsQuery, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Report, 'id'>) })))
  })
}

/** Writes a new report. The live subscription above picks it up automatically — no local push needed. */
export async function createReport(report: Omit<Report, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore is not configured — check frontend/.env')
  const ref = await addDoc(collection(db, REPORTS), { ...report, createdAt: serverTimestamp() })
  return ref.id
}

/**
 * Atomically awards XP/coins and rolls levels up, inside a Firestore
 * transaction so two simultaneous report submissions can never race and
 * corrupt a Guardian's XP total.
 */
export async function awardXPTransaction(
  uid: string,
  xpGain: number,
  coinGain: number
): Promise<{ leveledUpTo: number | null }> {
  if (!db) return { leveledUpTo: null }
  const ref = doc(db, GUARDIANS, uid)
  let leveledUpTo: number | null = null

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) return
    const data = snap.data() as Guardian

    let xp = data.xp + xpGain
    let level = data.level
    let threshold = xpForLevel(level)
    let leveled = false
    while (xp >= threshold) {
      xp -= threshold
      level += 1
      leveled = true
      threshold = xpForLevel(level)
    }
    if (leveled) leveledUpTo = level

    tx.update(ref, {
      xp,
      level,
      xpToNext: threshold,
      ecoCoins: data.ecoCoins + coinGain,
      contributionScore: data.contributionScore + xpGain,
    })
  })

  return { leveledUpTo }
}
