import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { NotFoundPage } from '../pages/NotFoundPage'

interface Props {
  children: ReactNode
}

/**
 * AdminRoute — the concealment guard.
 *
 * Renders a standard 404 Not Found page to any visitor who is:
 *   - unauthenticated, OR
 *   - authenticated but lacks an admin/moderator Custom Claim
 *
 * Critically: there is NO redirect to a login page and NO hint that an admin
 * portal exists. Unauthenticated users see an identical experience to visiting
 * any other non-existent route. Admin JS chunks are never shipped to public users.
 */
export function AdminRoute({ children }: Props) {
  const { isAdmin, loading } = useAuth()

  // While resolving auth state, render nothing to avoid flicker
  if (loading) return null

  if (!isAdmin) {
    return <NotFoundPage />
  }

  return <>{children}</>
}
