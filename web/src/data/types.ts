/** Firestore document shape for an active publication */
export interface Publication {
  id: string
  title: string
  description: string
  category: string
  locationId: string
  priceUSD?: number
  priceZIG?: number
  photoUrls: string[]
  sellerPhone: string
  sellerName?: string
  featured: boolean
  expiresAt: string  // ISO date string
  publishedAt: string
  status: 'active' | 'expired' | 'retired'
}

/** Firestore document shape for a pending submission */
export interface Submission {
  id: string
  title: string
  description: string
  category: string
  locationId: string
  priceUSD?: number
  priceZIG?: number
  photoUrls: string[]
  submitterPhone: string
  submitterName?: string
  status: 'pending' | 'approved' | 'rejected' | 'needs-revision'
  rejectionReason?: string
  moderatorNote?: string
  submittedAt: string
}

/** Firestore document shape for a commodity price entry */
export interface CommodityPrice {
  id: string
  name: string
  locationId: string
  minUSD: number
  maxUSD: number
  minZIG: number
  maxZIG: number
  unit: string
  verifiedAt: string
}

/** Firestore document shape for an emergency contact */
export interface EmergencyContact {
  id: string
  name: string
  category: 'police' | 'hospital' | 'fire' | 'council' | 'other'
  phone: string
  locationId: string
}

/** Firestore document shape for a kombi route */
export interface KombiRoute {
  id: string
  name: string
  origin: string
  destination: string
  fare: number
  fareUnit: 'USD' | 'ZIG'
  rank: string
  locationId: string
}

/** Firestore document shape for a civic bulletin */
export interface CivicBulletin {
  id: string
  title: string
  body: string
  locationId: string
  source?: string
  isUrgent: boolean
  publishedAt: string
}
