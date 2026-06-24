import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type AppRole, ROLE_HOME } from '@/lib/rbac'

// ── Persona definitions ────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  fullName: string
  avatarInitials: string
  role: AppRole
}

const DEMO_PERSONAS: Record<AppRole, AuthUser> = {
  applicant: {
    id: 'u-001',
    email: 'ali.khan@demo.workforcex.pk',
    fullName: 'Ali Khan',
    avatarInitials: 'AK',
    role: 'applicant',
  },
  employer: {
    id: 'u-002',
    email: 'hr@alrashid-construction.ae',
    fullName: 'Omar Al-Rashid',
    avatarInitials: 'OA',
    role: 'employer',
  },
  admin: {
    id: 'u-003',
    email: 'ops@workforcex.io',
    fullName: 'M Taha',
    avatarInitials: 'MT',
    role: 'admin',
  },
  super_admin: {
    id: 'u-004',
    email: 'root@workforcex.io',
    fullName: 'Hassan Ali Khan',
    avatarInitials: 'HAK',
    role: 'super_admin',
  },
}

// ── Context definition ─────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signIn: (role: AppRole) => void
  signOut: () => void
  /** Resolved destination after a role-based login */
  getHomeForRole: (role: AppRole) => string
}

const STORAGE_KEY = 'wfx_session'

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rehydrate session on mount (survives page refresh within the tab)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored) as AuthUser)
      }
    } catch {
      // Corrupt storage — ignore and start fresh
    }
    setIsLoading(false)
  }, [])

  function signIn(role: AppRole) {
    const persona = DEMO_PERSONAS[role]
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persona))
    setUser(persona)
  }

  function signOut() {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  function getHomeForRole(role: AppRole): string {
    return ROLE_HOME[role]
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, getHomeForRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be called inside <AuthProvider>')
  return ctx
}
