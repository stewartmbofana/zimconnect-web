import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { AlertTriangle, Newspaper } from 'lucide-react'
import { db } from '../../firebase'
import type { CivicBulletin as CivicBulletinType } from '../../data/types'

interface Props { locationId: string }

export function CivicBulletin({ locationId }: Props) {
  const [bulletins, setBulletins] = useState<CivicBulletinType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'civicBulletins'),
      where('locationId', '==', locationId),
      orderBy('publishedAt', 'desc')
    )
    return onSnapshot(q, (snap) => {
      setBulletins(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CivicBulletinType)))
      setLoading(false)
    })
  }, [locationId])

  if (loading) return <p className="text-sm text-gray-400">Loading bulletins…</p>
  if (bulletins.length === 0) return <p className="text-sm text-gray-500">No bulletins for this city.</p>

  return (
    <div className="space-y-3">
      {bulletins.map((b) => (
        <article
          key={b.id}
          className={`rounded-xl border p-4 ${
            b.isUrgent
              ? 'bg-red-50 border-brand-crimson'
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-start gap-3">
            {b.isUrgent ? (
              <AlertTriangle size={18} className="text-brand-crimson shrink-0 mt-0.5" />
            ) : (
              <Newspaper size={18} className="text-gray-400 shrink-0 mt-0.5" />
            )}
            <div>
              {b.isUrgent && (
                <span className="text-xs font-bold text-brand-crimson uppercase tracking-wide mb-1 block">
                  Urgent Notice
                </span>
              )}
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{b.title}</h3>
              <p className="text-sm text-gray-600">{b.body}</p>
              {b.source && (
                <p className="text-xs text-gray-400 mt-2">Source: {b.source}</p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
