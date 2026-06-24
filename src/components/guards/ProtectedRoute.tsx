import { Navigate, useLocation } from 'react-router'
import { type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { hasRole, ROLE_HOME, type AppRole } from '@/lib/rbac'
import LoadingScreen from '@/components/LoadingScreen'

interface Props {
  requiredRole: AppRole
  children: ReactNode
}

export default function ProtectedRoute({ requiredRole, children }: Props) {
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

  // Authenticated but insufficient role — redirect to role's own home
  if (!hasRole(user.role, requiredRole)) {
    return <Navigate to={ROLE_HOME[user.role]} replace />
  }

  return <>{children}</>
}
