import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import useGoogleAuth from '@/hooks/useGoogleAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useGoogleAuth();

  if (loading) return null;
  if (!user?.uid) return <Navigate to="/login" replace />;

  return <AppShell>{children}</AppShell>
}
