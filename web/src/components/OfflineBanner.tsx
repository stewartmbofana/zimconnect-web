import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

/**
 * Shows a banner when the browser reports being offline.
 * Listens to the online/offline events so it updates dynamically.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline  = () => setIsOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online',  goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online',  goOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-amber-500 text-white text-sm font-medium py-2 px-4">
      <WifiOff size={15} />
      You're offline — browsing cached directory data
    </div>
  )
}
