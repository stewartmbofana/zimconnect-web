import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import type { CommodityPrice } from '../../data/types'

interface Props { locationId: string }

export function CommodityPriceTable({ locationId }: Props) {
  const [prices, setPrices] = useState<CommodityPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'commodityPrices'),
      where('locationId', '==', locationId),
      orderBy('name')
    )
    return onSnapshot(q, (snap) => {
      setPrices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommodityPrice)))
      setLoading(false)
    })
  }, [locationId])

  if (loading) return <p className="text-sm text-gray-400">Loading prices…</p>
  if (prices.length === 0) return <p className="text-sm text-gray-500">No price data available for this city.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 pr-4 font-semibold text-gray-700">Item</th>
            <th className="text-left py-2 pr-4 font-semibold text-gray-700">Unit</th>
            <th className="text-right py-2 pr-4 font-semibold text-gray-700">USD Range</th>
            <th className="text-right py-2 font-semibold text-gray-700">ZiG Range</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p) => (
            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-2 pr-4 font-medium text-gray-900">{p.name}</td>
              <td className="py-2 pr-4 text-gray-500">{p.unit}</td>
              <td className="py-2 pr-4 text-right text-gray-900">
                \${p.minUSD} – \${p.maxUSD}
              </td>
              <td className="py-2 text-right text-gray-600">
                {p.minZIG} – {p.maxZIG}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">
        Verified prices — updated regularly by city administrators.
      </p>
    </div>
  )
}
