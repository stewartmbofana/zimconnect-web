import { describe, it, expect, vi } from 'vitest'
import { getAdminClaims, isAdminOrModerator } from './claims'
import type { User } from 'firebase/auth'

function makeUser(role?: string): User {
  return {
    getIdTokenResult: vi.fn().mockResolvedValue({
      claims: role !== undefined ? { role } : {},
    }),
  } as unknown as User
}

describe('getAdminClaims', () => {
  it('returns null role when user is null', async () => {
    const result = await getAdminClaims(null)
    expect(result).toEqual({ role: null })
  })

  it('returns admin role for admin user', async () => {
    const result = await getAdminClaims(makeUser('admin'))
    expect(result).toEqual({ role: 'admin' })
  })

  it('returns moderator role for moderator user', async () => {
    const result = await getAdminClaims(makeUser('moderator'))
    expect(result).toEqual({ role: 'moderator' })
  })

  it('returns null role for authenticated user with no admin claim', async () => {
    const result = await getAdminClaims(makeUser())
    expect(result).toEqual({ role: null })
  })

  it('returns null role for authenticated user with unknown role claim', async () => {
    const result = await getAdminClaims(makeUser('viewer'))
    expect(result).toEqual({ role: null })
  })
})

describe('isAdminOrModerator', () => {
  it('returns true for admin', () => {
    expect(isAdminOrModerator({ role: 'admin' })).toBe(true)
  })

  it('returns true for moderator', () => {
    expect(isAdminOrModerator({ role: 'moderator' })).toBe(true)
  })

  it('returns false for null role', () => {
    expect(isAdminOrModerator({ role: null })).toBe(false)
  })
})
