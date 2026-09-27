import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { CelebrationOverlay } from '@/components/gamification/CelebrationOverlay'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen hud-grid">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
      <CelebrationOverlay />
    </div>
  )
}
