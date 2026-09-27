import { NavLink } from 'react-router-dom'
import { Zap, Coins, Bell, Menu } from 'lucide-react'
import { useState } from 'react'
import { useGuardianStore } from '@/store/useGuardianStore'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/report', label: 'Report' },
  { to: '/missions', label: 'Missions' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/community', label: 'Community' },
  { to: '/profile', label: 'Profile' },
  { to: '/municipal', label: 'Municipal' },
]

export function Navbar() {
  const guardian = useGuardianStore((s) => s.guardian)
  const notifications = useGuardianStore((s) => s.notifications)
  const unread = notifications.filter((n) => !n.read).length
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <img src="/nexora_logo.png" alt="Nexora Logo" className="h-6 w-auto object-contain" />
            
          </NavLink>
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive ? 'text-neon bg-neon/10' : 'text-mist hover:text-ice hover:bg-black/5'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-guardian-blue glass rounded-lg px-2.5 py-1.5">
              <Zap size={13} /> {guardian.xp}/{guardian.xpToNext}
            </span>
            <span className="flex items-center gap-1.5 text-amber glass rounded-lg px-2.5 py-1.5">
              <Coins size={13} /> {guardian.ecoCoins.toLocaleString()}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-lg hover:bg-black/5 text-mist hover:text-ice transition-colors"
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger animate-pulse" />
              )}
            </button>
            {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
          </div>

          <NavLink to="/profile" className="shrink-0">
            <img src={guardian.avatar} alt="avatar" className="w-9 h-9 rounded-full border border-line bg-surface-2" />
          </NavLink>

          <button className="lg:hidden p-2 text-mist" onClick={() => setMobileOpen((o) => !o)}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-line px-4 py-2 flex flex-col gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn('px-3 py-2.5 rounded-lg text-sm font-medium', isActive ? 'text-neon bg-neon/10' : 'text-mist')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
