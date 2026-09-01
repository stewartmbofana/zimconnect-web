import { useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { X, XCircle, Loader2 } from 'lucide-react'
import { db } from '../../../firebase'
import type { Submission } from '../../../data/types'

interface Props {
  submission: Submission
  onClose: () => void
}

export function RejectModal({ submission, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReject() {
    if (!reason.trim()) return
    setLoading(true)
    try {
      await updateDoc(
        doc(db, 'locations', submission.locationId, 'submissions', submission.id),
        {
          status: 'rejected',
          rejectionReason: reason.trim(),
          rejectedAt: serverTimestamp(),
        }
      )
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="text-brand-crimson" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Reject Submission</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-700">"{submission.title}"</span> — provide a rejection reason.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="e.g. Listing violates community guidelines — prohibited item."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson mb-4 resize-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={loading || !reason.trim()}
            className="flex-1 bg-brand-crimson text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={14} />}
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
