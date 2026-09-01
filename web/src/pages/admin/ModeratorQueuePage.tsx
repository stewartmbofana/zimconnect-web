import {
  collectionGroup,
  query,
  where,
  onSnapshot,
  doc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, XCircle, Edit3 } from 'lucide-react'
import { db } from '../../firebase'
import type { Submission } from '../../data/types'
import { RejectModal } from './moderation/RejectModal'
import { RevisionModal } from './moderation/RevisionModal'

export function ModeratorQueuePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Submission | null>(null)
  const [action, setAction] = useState<'reject' | 'revision' | null>(null)
  const [approving, setApproving] = useState<string | null>(null)

  useEffect(() => {
    // collectionGroup query across all locations' submissions
    const q = query(
      collectionGroup(db, 'submissions'),
      where('status', '==', 'pending')
    )
    return onSnapshot(q, (snap) => {
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Submission)))
      setLoading(false)
    })
  }, [])

  async function handleApprove(sub: Submission) {
    setApproving(sub.id)
    try {
      const batch = writeBatch(db)
      const submissionRef = doc(db, 'locations', sub.locationId, 'submissions', sub.id)
      const publicationRef = doc(db, 'locations', sub.locationId, 'publications', sub.id)

      batch.set(publicationRef, {
        title: sub.title,
        description: sub.description,
        category: sub.category,
        locationId: sub.locationId,
        priceUSD: sub.priceUSD ?? null,
        priceZIG: sub.priceZIG ?? null,
        photoUrls: sub.photoUrls,
        sellerPhone: sub.submitterPhone,
        sellerName: sub.submitterName ?? null,
        featured: false,
        status: 'active',
        publishedAt: serverTimestamp(),
        expiresAt: null,
      })

      batch.update(submissionRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
      })

      await batch.commit()
    } finally {
      setApproving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-brand-emerald" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Moderation Queue</h1>
        <span className="text-sm text-gray-500">{submissions.length} pending</span>
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle size={40} className="mx-auto mb-3 text-brand-emerald" />
          <p>No pending submissions. Queue is clear!</p>
        </div>
      )}

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              {/* Photos */}
              {sub.photoUrls.length > 0 && (
                <div className="flex gap-2 shrink-0">
                  {sub.photoUrls.slice(0, 3).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                    />
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{sub.title}</h3>
                  <span className="text-xs font-medium text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded-full capitalize shrink-0">
                    {sub.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{sub.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>📍 {sub.locationId}</span>
                  <span>📞 {sub.submitterPhone}</span>
                  {sub.priceUSD != null && <span>\${sub.priceUSD} USD</span>}
                  {sub.priceZIG != null && <span>ZiG {sub.priceZIG}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(sub)}
                  disabled={approving === sub.id}
                  className="flex items-center gap-1.5 bg-brand-emerald text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {approving === sub.id ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => { setSelected(sub); setAction('revision') }}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Edit3 size={14} />
                  Revision
                </button>
                <button
                  onClick={() => { setSelected(sub); setAction('reject') }}
                  className="flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <XCircle size={14} />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && action === 'reject' && (
        <RejectModal
          submission={selected}
          onClose={() => { setSelected(null); setAction(null) }}
        />
      )}
      {selected && action === 'revision' && (
        <RevisionModal
          submission={selected}
          onClose={() => { setSelected(null); setAction(null) }}
        />
      )}
    </div>
  )
}
