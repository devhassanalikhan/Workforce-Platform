// src/components/guards/ProtectedRoute.tsx

import { Navigate, useLocation } from 'react-router'
import { type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { hasRole, ROLE_HOME, type AppRole } from '@/lib/rbac'
import LoadingScreen from '@/components/LoadingScreen'

interface Props {
  requiredRole: AppRole
  /**
   * When true, requires an EXACT role match rather than "at least this
   * role" hierarchy elevation. Used for routes like /employer-portal where
   * a higher-privilege role (e.g. admin) should NOT fall through into a
   * lower role's own workflow page — admin has a separate, dedicated
   * oversight view instead.
   */
  exactRole?: boolean
  children: ReactNode
}

export default function ProtectedRoute({ requiredRole, exactRole = false, children }: Props) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingScreen />

  // Not authenticated — send to login, preserving intended destination
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  const isAuthorized = exactRole
    ? user.role === requiredRole
    : hasRole(user.role, requiredRole)

  // Authenticated but insufficient (or, for exactRole routes, mismatched)
  // role — redirect to the user's own role home instead.
  if (!isAuthorized) {
    return <Navigate to={ROLE_HOME[user.role]} replace />
  }

  return <>{children}</>
}
