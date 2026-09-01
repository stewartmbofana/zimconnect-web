import { useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { X, Edit3, Loader2 } from 'lucide-react'
import { db } from '../../../firebase'
import type { Submission } from '../../../data/types'

interface Props {
  submission: Submission
  onClose: () => void
}

export function RevisionModal({ submission, onClose }: Props) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRequestRevision() {
    if (!note.trim()) return
    setLoading(true)
    try {
      await updateDoc(
        doc(db, 'locations', submission.locationId, 'submissions', submission.id),
        {
          status: 'needs-revision',
          moderatorNote: note.trim(),
          revisionRequestedAt: serverTimestamp(),
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
          <Edit3 className="text-brand-gold" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Request Revision</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-700">"{submission.title}"</span> — add feedback for the submitter.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="e.g. Please add a clearer photo and confirm the price in USD."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold mb-4 resize-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleRequestRevision}
            disabled={loading || !note.trim()}
            className="flex-1 bg-brand-gold text-white py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={14} />}
            Request Revision
          </button>
        </div>
      </div>
    </div>
  )
}
