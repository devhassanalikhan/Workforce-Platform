import { describe, expect, it } from 'vitest'
import { DEFAULT_ROLE, hasRole, normalizeRole } from './rbac'

describe('rbac role normalization and hierarchy', () => {
  it('returns a valid role unchanged', () => {
    expect(normalizeRole('employer')).toBe('employer')
    expect(normalizeRole('admin')).toBe('admin')
    expect(normalizeRole('super_admin')).toBe('super_admin')
  })

  it('returns null for a missing role field', () => {
    expect(normalizeRole(undefined)).toBeNull()
    expect(normalizeRole(null)).toBeNull()
    expect(normalizeRole('   ')).toBeNull()
  })

  it('returns null for an invalid role value', () => {
    expect(normalizeRole('unknown-role')).toBeNull()
    expect(normalizeRole(42 as unknown as string)).toBeNull()
  })

  it('uses the default role for auth flows that omit the role field intentionally', () => {
    expect(DEFAULT_ROLE).toBe('applicant')
  })

  it('treats higher-ranked roles as satisfying lower role requirements', () => {
    expect(hasRole('applicant', 'applicant')).toBe(true)
    expect(hasRole('employer', 'applicant')).toBe(true)
    expect(hasRole('admin', 'employer')).toBe(true)
    expect(hasRole('super_admin', 'admin')).toBe(true)
    expect(hasRole('employer', 'admin')).toBe(false)
  })
})
