import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState } from 'react'
import { db, storage } from '../firebase'
import type { CategoryId } from '../data/constants'
import { normalizeZimbabweanPhone } from '../utils/phone'

export interface SubmissionDraft {
  title: string
  description: string
  category: CategoryId
  locationId: string
  priceUSD?: number
  priceZIG?: number
  photos: File[]
  submitterPhone: string
  submitterName?: string
}

interface UseSubmissionResult {
  submit: (draft: SubmissionDraft) => Promise<string>
  loading: boolean
  error: Error | null
  submittedId: string | null
}

/**
 * Mutation hook: uploads photos to Storage, then writes the submission document
 * to `locations/{locationId}/submissions/{id}` with status 'pending'.
 *
 * Returns the created submission document ID on success.
 */
export function useSubmission(): UseSubmissionResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  async function submit(draft: SubmissionDraft): Promise<string> {
    setLoading(true)
    setError(null)

    try {
      // 1. Upload photos to Firebase Storage
      const photoUrls = await Promise.all(
        draft.photos.map(async (file) => {
          const storageRef = ref(
            storage,
            `submissions/${draft.locationId}/${Date.now()}-${file.name}`
          )
          const snapshot = await uploadBytes(storageRef, file)
          return getDownloadURL(snapshot.ref)
        })
      )

      // 2. Write submission document
      const docRef = await addDoc(
        collection(db, 'locations', draft.locationId, 'submissions'),
        {
          title: draft.title,
          description: draft.description,
          category: draft.category,
          locationId: draft.locationId,
          priceUSD: draft.priceUSD ?? null,
          priceZIG: draft.priceZIG ?? null,
          photoUrls,
          submitterPhone: normalizeZimbabweanPhone(draft.submitterPhone),
          submitterName: draft.submitterName ?? null,
          status: 'pending',
          submittedAt: serverTimestamp(),
        }
      )

      setSubmittedId(docRef.id)
      return docRef.id
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error, submittedId }
}
