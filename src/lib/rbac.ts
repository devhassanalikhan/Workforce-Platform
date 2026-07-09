// src/lib/rbac.ts

export const APP_ROLES = ['applicant', 'employer', 'admin', 'super_admin'] as const
export type AppRole = (typeof APP_ROLES)[number]

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  applicant:   1,
  employer:    2,
  admin:       3,
  super_admin: 4,
}

export const DEFAULT_ROLE: AppRole = 'applicant'

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && (APP_ROLES as readonly string[]).includes(value)
}

export function normalizeRole(value: unknown): AppRole | null {
  if (isAppRole(value)) return value
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) return null
  return null
}

/**
 * Returns true if the actor's role meets or exceeds the required minimum.
 * e.g. hasRole('admin', 'employer') === true
 */
export function hasRole(userRole: AppRole, requiredRole: AppRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/** Minimum role required to access each protected route. */
export const ROUTE_MIN_ROLE: Record<string, AppRole> = {
  '/dashboard':       'applicant',
  '/employer-portal': 'employer',
  '/admin/employers': 'admin',
  '/talent':          'admin',
  '/placement':       'admin',
  '/wasl':            'admin',
}

/** Default redirect target per role after successful login. */
export const ROLE_HOME: Record<AppRole, string> = {
  applicant:   '/dashboard',
  employer:    '/employer-portal',
  admin:       '/talent',
  super_admin: '/talent',
}
