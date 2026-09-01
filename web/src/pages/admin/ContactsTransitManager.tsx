import { useState, useEffect } from 'react'
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore'
import { Plus, Trash2, Loader2, Phone, Route } from 'lucide-react'
import { db } from '../../firebase'
import { ZIM_CITIES, type CityId } from '../../data/constants'
import type { EmergencyContact, KombiRoute } from '../../data/types'

export function ContactsTransitManager() {
  const [locationId, setLocationId] = useState<CityId>('harare')
  const [tab, setTab] = useState<'contacts' | 'routes'>('contacts')
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [routes, setRoutes] = useState<KombiRoute[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const cq = query(collection(db, 'emergencyContacts'), where('locationId', '==', locationId))
    const rq = query(collection(db, 'kombiRoutes'), where('locationId', '==', locationId))
    const u1 = onSnapshot(cq, (s) => setContacts(s.docs.map((d) => ({ id: d.id, ...d.data() } as EmergencyContact))))
    const u2 = onSnapshot(rq, (s) => setRoutes(s.docs.map((d) => ({ id: d.id, ...d.data() } as KombiRoute))))
    return () => { u1(); u2() }
  }, [locationId])

  async function addContact() {
    setSaving(true)
    try {
      await addDoc(collection(db, 'emergencyContacts'), {
        name: 'New Contact', category: 'other', phone: '', locationId, createdAt: serverTimestamp()
      })
    } finally { setSaving(false) }
  }

  async function deleteContact(id: string) {
    await deleteDoc(doc(db, 'emergencyContacts', id))
  }

  async function addRoute() {
    setSaving(true)
    try {
      await addDoc(collection(db, 'kombiRoutes'), {
        name: 'New Route', origin: '', destination: '', fare: 0, fareUnit: 'USD', rank: '', locationId, createdAt: serverTimestamp()
      })
    } finally { setSaving(false) }
  }

  async function deleteRoute(id: string) {
    await deleteDoc(doc(db, 'kombiRoutes', id))
  }

  async function saveContact(c: EmergencyContact) {
    await updateDoc(doc(db, 'emergencyContacts', c.id), { name: c.name, phone: c.phone, category: c.category })
  }

  async function saveRoute(r: KombiRoute) {
    await updateDoc(doc(db, 'kombiRoutes', r.id), { name: r.name, origin: r.origin, destination: r.destination, fare: r.fare, fareUnit: r.fareUnit, rank: r.rank })
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Contacts & Transit Management</h2>

      <div className="flex items-center gap-4 mb-4">
        <select value={locationId} onChange={(e) => setLocationId(e.target.value as CityId)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald">
          {ZIM_CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden">
          {(['contacts', 'routes'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${tab === t ? 'bg-brand-emerald text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              {t === 'contacts' ? <Phone size={13} /> : <Route size={13} />}
              {t === 'contacts' ? 'Contacts' : 'Routes'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'contacts' && (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3">
              <input className="flex-1 border-0 text-sm font-medium text-gray-900 focus:outline-none" defaultValue={c.name}
                onBlur={(e) => saveContact({ ...c, name: e.target.value })} />
              <input className="w-36 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald" defaultValue={c.phone}
                onBlur={(e) => saveContact({ ...c, phone: e.target.value })} placeholder="Phone" />
              <button onClick={() => deleteContact(c.id)} className="text-gray-300 hover:text-brand-crimson transition-colors"><Trash2 size={15} /></button>
            </div>
          ))}
          <button onClick={addContact} disabled={saving}
            className="flex items-center gap-2 text-sm text-brand-emerald hover:underline mt-2 disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            Add Contact
          </button>
        </div>
      )}

      {tab === 'routes' && (
        <div className="space-y-2">
          {routes.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3">
              <input className="flex-1 min-w-[120px] border-0 text-sm font-medium text-gray-900 focus:outline-none" defaultValue={r.name}
                onBlur={(e) => saveRoute({ ...r, name: e.target.value })} />
              <input className="w-28 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none" defaultValue={r.origin} placeholder="From"
                onBlur={(e) => saveRoute({ ...r, origin: e.target.value })} />
              <span className="text-gray-400 text-xs">→</span>
              <input className="w-28 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none" defaultValue={r.destination} placeholder="To"
                onBlur={(e) => saveRoute({ ...r, destination: e.target.value })} />
              <input className="w-20 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none" type="number" defaultValue={r.fare}
                onBlur={(e) => saveRoute({ ...r, fare: parseFloat(e.target.value) || 0 })} />
              <button onClick={() => deleteRoute(r.id)} className="text-gray-300 hover:text-brand-crimson transition-colors"><Trash2 size={15} /></button>
            </div>
          ))}
          <button onClick={addRoute} disabled={saving}
            className="flex items-center gap-2 text-sm text-brand-emerald hover:underline mt-2 disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            Add Route
          </button>
        </div>
      )}
    </section>
  )
}
