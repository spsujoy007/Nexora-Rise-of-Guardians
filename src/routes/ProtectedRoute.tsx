import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useGuardianStore } from '@/store/useGuardianStore'
import { AppShell } from '@/components/layout/AppShell'
import useGoogleAuth from '@/hooks/useGoogleAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  // const isAuthenticated = useGuardianStore((s) => s.isAuthenticated)
  const { user, loading } = useGoogleAuth();
  console.log('FROM PROTECTED: ', user);

  if (loading) return null;
  if (!user?.accessToken) return <Navigate to="/login" replace />;

  return <AppShell>{children}</AppShell>
}
