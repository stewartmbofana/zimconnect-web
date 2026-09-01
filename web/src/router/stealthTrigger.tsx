import { lazy, Suspense, useCallback, useRef, useState } from 'react'

const AdminLoginModal = lazy(() =>
  import('../pages/admin/AdminLoginModal').then((m) => ({ default: m.AdminLoginModal }))
)

const CLICK_THRESHOLD = 5
const CLICK_WINDOW_MS = 3000

/**
 * Stealth trigger hook.
 *
 * Counts rapid clicks on the NationalAccentRibbon. When CLICK_THRESHOLD clicks
 * occur within CLICK_WINDOW_MS, the concealed AdminLoginModal is revealed.
 *
 * No visual affordance is given; the trigger is discoverable only by those who
 * know it exists.
 */
export function useStealthTrigger() {
  const [open, setOpen] = useState(false)
  const clickTimestamps = useRef<number[]>([])

  const handleClick = useCallback(() => {
    const now = Date.now()
    const recent = clickTimestamps.current.filter(
      (t) => now - t < CLICK_WINDOW_MS
    )
    recent.push(now)
    clickTimestamps.current = recent

    if (recent.length >= CLICK_THRESHOLD) {
      clickTimestamps.current = []
      setOpen(true)
    }
  }, [])

  function AdminLoginModalWrapper() {
    if (!open) return null
    return (
      <Suspense fallback={null}>
        <AdminLoginModal onClose={() => setOpen(false)} />
      </Suspense>
    )
  }

  return { handleClick, AdminLoginModal: AdminLoginModalWrapper }
}
