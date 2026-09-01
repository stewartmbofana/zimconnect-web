import { useState, useEffect } from 'react'
import { collectionGroup, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Star, StarOff, RotateCw, Archive, Loader2 } from 'lucide-react'
import { db } from '../../firebase'
import type { Publication } from '../../data/types'

export function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collectionGroup(db, 'publications'), where('status', '==', 'active'))
    return onSnapshot(q, (snap) => {
      setPublications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Publication)))
      setLoading(false)
    })
  }, [])

  async function toggleFeatured(pub: Publication) {
    setActing(pub.id)
    try {
      await updateDoc(
        doc(db, 'locations', pub.locationId, 'publications', pub.id),
        { featured: !pub.featured }
      )
    } finally { setActing(null) }
  }

  async function renewExpiry(pub: Publication) {
    setActing(pub.id)
    const newExpiry = new Date()
    newExpiry.setDate(newExpiry.getDate() + 30)
    try {
      await updateDoc(
        doc(db, 'locations', pub.locationId, 'publications', pub.id),
        { expiresAt: newExpiry.toISOString(), renewedAt: serverTimestamp() }
      )
    } finally { setActing(null) }
  }

  async function retirePublication(pub: Publication) {
    if (!confirm(`Retire "${pub.title}"?`)) return
    setActing(pub.id)
    try {
      await updateDoc(
        doc(db, 'locations', pub.locationId, 'publications', pub.id),
        { status: 'retired', retiredAt: serverTimestamp() }
      )
    } finally { setActing(null) }
  }

  if (loading) return <Loader2 className="animate-spin text-brand-emerald" size={24} />

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Live Publications</h2>
      <p className="text-sm text-gray-500 mb-4">{publications.length} active publications</p>

      <div className="space-y-3">
        {publications.map((pub) => {
          const busy = acting === pub.id
          return (
            <div key={pub.id} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{pub.title}</h3>
                  {pub.featured && (
                    <span className="text-xs font-medium text-brand-gold bg-yellow-50 px-2 py-0.5 rounded-full shrink-0">Featured</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {pub.locationId} · {pub.category}
                  {pub.expiresAt && ` · Expires ${new Date(pub.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleFeatured(pub)}
                  disabled={busy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    pub.featured
                      ? 'bg-yellow-50 border-brand-gold text-brand-gold hover:bg-yellow-100'
                      : 'border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold'
                  }`}
                >
                  {busy ? <Loader2 className="animate-spin" size={12} /> : pub.featured ? <StarOff size={12} /> : <Star size={12} />}
                  {pub.featured ? 'Unpin' : 'Feature'}
                </button>
                <button
                  onClick={() => renewExpiry(pub)}
                  disabled={busy}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-brand-emerald hover:text-brand-emerald transition-colors"
                >
                  {busy ? <Loader2 className="animate-spin" size={12} /> : <RotateCw size={12} />}
                  Renew 30d
                </button>
                <button
                  onClick={() => retirePublication(pub)}
                  disabled={busy}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-brand-crimson hover:text-brand-crimson transition-colors"
                >
                  {busy ? <Loader2 className="animate-spin" size={12} /> : <Archive size={12} />}
                  Retire
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
