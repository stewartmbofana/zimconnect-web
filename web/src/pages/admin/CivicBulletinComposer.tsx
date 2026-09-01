import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Send, Loader2, AlertTriangle } from 'lucide-react'
import { db } from '../../firebase'
import { ZIM_CITIES, type CityId } from '../../data/constants'

export function CivicBulletinComposer() {
  const [locationId, setLocationId] = useState<CityId>('harare')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [source, setSource] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handlePublish() {
    if (!title.trim() || !body.trim()) return
    setLoading(true)
    setSuccess(false)
    try {
      await addDoc(collection(db, 'civicBulletins'), {
        title: title.trim(),
        body: body.trim(),
        source: source.trim() || null,
        locationId,
        isUrgent,
        publishedAt: serverTimestamp(),
      })
      setTitle(''); setBody(''); setSource(''); setIsUrgent(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Civic Bulletin Composer</h2>
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value as CityId)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            >
              {ZIM_CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              <span className="flex items-center gap-1 text-sm font-medium text-brand-crimson">
                <AlertTriangle size={14} />
                Urgent Notice
              </span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Water Supply Interruption — Highlands"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Bulletin content…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Official Source <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. ZINWA, Harare City Council"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            disabled={loading || !title.trim() || !body.trim()}
            className="flex items-center gap-2 bg-brand-emerald text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            Publish Bulletin
          </button>
          {success && <span className="text-sm text-brand-emerald font-medium">✓ Published!</span>}
        </div>
      </div>
    </section>
  )
}
