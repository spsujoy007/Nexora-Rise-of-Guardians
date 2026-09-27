import type { Report } from './types'

export interface CityHealthMetrics {
  /** 0–1, higher = cleaner/healthier city, drives the 3D scene's color + fog */
  index: number
  resolvedRatio: number
  criticalRatio: number
  sampleSize: number
}

/**
 * Turns the raw report list into a single "city health" signal.
 * This is what makes the Guardian City scene a real data visualization
 * rather than decoration — swap `reports` for a live Firestore query
 * (see README) and the skyline reacts to the real city.
 */
export function computeCityHealth(reports: Report[]): CityHealthMetrics {
  const total = reports.length || 1
  const resolved = reports.filter((r) => r.status === 'Resolved').length
  const critical = reports.filter(
    (r) => r.analysis.severity === 'Critical' || r.analysis.severity === 'High'
  ).length

  const resolvedRatio = resolved / total
  const criticalRatio = critical / total
  const index = Math.max(0.08, Math.min(1, resolvedRatio * 0.65 + (1 - criticalRatio) * 0.35))

  return { index, resolvedRatio, criticalRatio, sampleSize: reports.length }
}
