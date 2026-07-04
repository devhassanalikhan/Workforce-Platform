import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}))

describe('AuthContext role handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(supabase.auth.getSession as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { session: null } })
    ;(supabase.auth.onAuthStateChange as ReturnType<typeof vi.fn>).mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
  })

  it('signUp includes a normalized role in metadata', async () => {
    ;(supabase.auth.signUp as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { session: null }, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {
      await result.current.signUp('person@example.com', 'secret123!', { role: 'employer', full_name: 'Jane Doe' })
    })

    expect(supabase.auth.signUp).toHaveBeenCalledWith(expect.objectContaining({
      email: 'person@example.com',
      password: 'secret123!',
      options: { data: expect.objectContaining({ role: 'employer', full_name: 'Jane Doe' }) },
    }))
  })

  it('rejects signUp when the role is invalid', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {
      const response = await result.current.signUp('person@example.com', 'secret123!', { role: 'not-a-role' as never, full_name: 'Jane Doe' })
      expect(response).toEqual({ error: 'A valid role is required to create an account.', needsEmailVerification: false })
    })

    expect(supabase.auth.signUp).not.toHaveBeenCalled()
  })

  it('fills in a missing role field during sign-in by updating user metadata', async () => {
    ;(supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'u1',
            email: 'person@example.com',
            user_metadata: { full_name: 'Jane Doe' },
          },
        },
      },
      error: null,
    })
    ;(supabase.auth.updateUser as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { user: {} }, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await act(async () => {
      const response = await result.current.signIn('person@example.com', 'secret123!')
      expect(response).toEqual({ error: null })
    })

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: expect.objectContaining({ role: 'applicant', full_name: 'Jane Doe' }),
    })
  })
})
