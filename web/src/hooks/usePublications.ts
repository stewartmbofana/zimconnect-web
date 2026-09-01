import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import type { Publication } from '../data/types'
import type { CategoryId } from '../data/constants'

interface UsePublicationsOptions {
  locationId: string
  category?: CategoryId
  searchTerm?: string
}

interface UsePublicationsResult {
  publications: Publication[]
  loading: boolean
  error: Error | null
}

/**
 * Real-time hook that subscribes to active publications for a given location.
 * Optionally filters by category. Client-side filters by searchTerm.
 */
export function usePublications({
  locationId,
  category,
  searchTerm,
}: UsePublicationsOptions): UsePublicationsResult {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!locationId) return

    const constraints: QueryConstraint[] = [
      where('status', '==', 'active'),
      where('locationId', '==', locationId),
      orderBy('publishedAt', 'desc'),
    ]

    if (category && category !== 'all') {
      constraints.push(where('category', '==', category))
    }

    const q = query(
      collection(db, 'publications'),
      ...constraints
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Publication[]
        setPublications(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [locationId, category])

  // Client-side search filter (no extra Firestore index needed)
  const filtered = searchTerm
    ? publications.filter((p) => {
        const term = searchTerm.toLowerCase()
        return (
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
        )
      })
    : publications

  return { publications: filtered, loading, error }
}
