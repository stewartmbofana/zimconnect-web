import type { User } from 'firebase/auth'

export interface AdminClaims {
  role: 'admin' | 'moderator' | null
}

/**
 * Extracts the admin role from the Firebase ID token custom claims.
 * Returns null if the user is not authenticated or has no admin role.
 */
export async function getAdminClaims(user: User | null): Promise<AdminClaims> {
  if (!user) return { role: null }

  const tokenResult = await user.getIdTokenResult()
  const role = tokenResult.claims['role']

  if (role === 'admin' || role === 'moderator') {
    return { role }
  }

  return { role: null }
}

/**
 * Checks whether the given claims allow access to admin features.
 */
export function isAdminOrModerator(claims: AdminClaims): boolean {
  return claims.role === 'admin' || claims.role === 'moderator'
}
