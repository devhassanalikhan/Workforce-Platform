export type AppRole = 'applicant' | 'employer' | 'admin' | 'super_admin'

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  applicant:   1,
  employer:    2,
  admin:       3,
  super_admin: 4,
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
  '/dashboard': 'applicant',
  '/employers': 'employer',
  '/talent':    'admin',
  '/placement': 'admin',
  '/wasl':      'admin',
}

/** Default redirect target per role after successful login. */
export const ROLE_HOME: Record<AppRole, string> = {
  applicant:   '/dashboard',
  employer:    '/employers',
  admin:       '/talent',
  super_admin: '/talent',
}
