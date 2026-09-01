import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { Phone, Shield, Heart, Flame, Building2 } from 'lucide-react'
import { db } from '../../firebase'
import type { EmergencyContact } from '../../data/types'

const CATEGORY_ICONS = {
  police:   <Shield size={16} className="text-blue-600" />,
  hospital: <Heart size={16} className="text-red-500" />,
  fire:     <Flame size={16} className="text-orange-500" />,
  council:  <Building2 size={16} className="text-gray-500" />,
  other:    <Phone size={16} className="text-gray-400" />,
}

interface Props { locationId: string }

export function EmergencyContacts({ locationId }: Props) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'emergencyContacts'),
      where('locationId', '==', locationId)
    )
    return onSnapshot(q, (snap) => {
      setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EmergencyContact)))
      setLoading(false)
    })
  }, [locationId])

  if (loading) return <p className="text-sm text-gray-400">Loading contacts…</p>
  if (contacts.length === 0) return <p className="text-sm text-gray-500">No contacts available for this city.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {contacts.map((c) => (
        <a
          key={c.id}
          href={`tel:${c.phone}`}
          className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-brand-emerald hover:shadow-sm transition-all"
        >
          {CATEGORY_ICONS[c.category]}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{c.name}</p>
            <p className="text-xs text-gray-500">{c.phone}</p>
          </div>
          <Phone size={14} className="text-brand-emerald shrink-0" />
        </a>
      ))}
    </div>
  )
}
