import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, type UserMetadata } from '@/lib/supabase'
import { type AppRole, ROLE_HOME, normalizeRole } from '@/lib/rbac'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  avatarInitials: string
  role: AppRole
}

interface SignUpMetadata {
  role?: AppRole
  full_name?: string
  company_name?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<{ error: string | null; needsEmailVerification: boolean }>
  signOut: () => Promise<void>
  getHomeForRole: (role: AppRole) => string
}

const AuthContext = createContext<AuthContextValue | null>(null)

function sessionToUser(session: Session): AuthUser | null {
  const meta = session.user.user_metadata as Partial<UserMetadata>
  const role = normalizeRole(meta.role)

  const fullName = meta.full_name ?? session.user.email ?? 'User'
  const initials = fullName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    fullName,
    avatarInitials: initials,
    role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session ? sessionToUser(session) : null)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? sessionToUser(session) : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    if (!data.session) return { error: 'Sign-in succeeded but no session was returned.' }

    const meta = data.session.user.user_metadata as Partial<UserMetadata>
    const normalizedRole = normalizeRole(meta.role)
    if (normalizedRole !== meta.role) {
      await supabase.auth.updateUser({
        data: {
          ...meta,
          role: normalizedRole,
          full_name: meta.full_name ?? data.session.user.email ?? 'User',
        },
      })
    }

    const authUser = sessionToUser(data.session)
    if (!authUser) {
      await supabase.auth.signOut()
      return { error: 'Your account could not be loaded. Please sign in again.' }
    }
    return { error: null }
  }

  async function signUp(
    email: string,
    password: string,
    metadata: SignUpMetadata
  ): Promise<{ error: string | null; needsEmailVerification: boolean }> {
    const normalizedMetadata = {
      ...metadata,
      role: normalizeRole(metadata.role),
      full_name: metadata.full_name?.trim() || 'User',
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: normalizedMetadata },
    })
    if (error) return { error: error.message, needsEmailVerification: false }
    // If Supabase's "Confirm email" setting is on, signUp succeeds but
    // returns no session until the user clicks the verification link.
    return { error: null, needsEmailVerification: !data.session }
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  function getHomeForRole(role: AppRole): string {
    return ROLE_HOME[role]
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, getHomeForRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be called inside <AuthProvider>')
  return ctx
}
