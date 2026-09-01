import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { MapPin, DollarSign } from 'lucide-react'
import { db } from '../../firebase'
import type { KombiRoute } from '../../data/types'

interface Props { locationId: string }

export function KombiTransitGuide({ locationId }: Props) {
  const [routes, setRoutes] = useState<KombiRoute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'kombiRoutes'),
      where('locationId', '==', locationId)
    )
    return onSnapshot(q, (snap) => {
      setRoutes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as KombiRoute)))
      setLoading(false)
    })
  }, [locationId])

  if (loading) return <p className="text-sm text-gray-400">Loading routes…</p>
  if (routes.length === 0) return <p className="text-sm text-gray-500">No route data available for this city.</p>

  return (
    <div className="space-y-3">
      {routes.map((r) => (
        <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin size={11} />
                <span>{r.origin} → {r.destination}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Rank / Terminus: {r.rank}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-brand-emerald whitespace-nowrap">
              <DollarSign size={13} />
              {r.fare} {r.fareUnit}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
