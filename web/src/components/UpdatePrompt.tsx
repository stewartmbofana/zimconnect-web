import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

/**
 * Detects when a new service worker is waiting to activate and shows a
 * "New version available" prompt. The user can accept or dismiss.
 */
export function UpdatePrompt() {
  const [show, setShow] = useState(false)
  const [worker, setWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener('updatefound', () => {
        const sw = reg.installing
        if (!sw) return
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            setWorker(sw)
            setShow(true)
          }
        })
      })
    })
  }, [])

  function handleUpdate() {
    if (worker) {
      worker.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  }

  if (!show) return null

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-xl shadow-2xl px-5 py-3 flex items-center gap-4 max-w-sm w-full mx-4">
      <div className="flex-1 text-sm">
        <p className="font-semibold">New version available</p>
        <p className="text-gray-400 text-xs">Reload to get the latest updates.</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShow(false)} className="text-gray-400 hover:text-white text-xs transition-colors">
          Later
        </button>
        <button
          onClick={handleUpdate}
          className="flex items-center gap-1.5 bg-brand-emerald text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors"
        >
          <RefreshCw size={12} />
          Reload
        </button>
      </div>
    </div>
  )
}
