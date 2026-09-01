import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Save, Loader2 } from 'lucide-react'
import { db } from '../../firebase'
import { ZIM_CITIES, type CityId } from '../../data/constants'
import type { CommodityPrice } from '../../data/types'

export function CommodityPriceManager() {
  const [locationId, setLocationId] = useState<CityId>('harare')
  const [prices, setPrices] = useState<CommodityPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, Partial<CommodityPrice>>>({})

  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, 'commodityPrices'), where('locationId', '==', locationId))
    return onSnapshot(q, (snap) => {
      setPrices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommodityPrice)))
      setEdits({})
      setLoading(false)
    })
  }, [locationId])

  function handleEdit(id: string, field: keyof CommodityPrice, value: string) {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: parseFloat(value) || 0 },
    }))
  }

  async function handleSave(price: CommodityPrice) {
    setSaving(price.id)
    try {
      const updated = { ...price, ...edits[price.id], verifiedAt: serverTimestamp() }
      await setDoc(doc(db, 'commodityPrices', price.id), updated)
      setEdits((prev) => { const copy = { ...prev }; delete copy[price.id]; return copy })
    } finally {
      setSaving(null)
    }
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Commodity Price Index</h2>
      <div className="flex items-center gap-3 mb-4">
        <select
          value={locationId}
          onChange={(e) => { setLocationId(e.target.value as CityId) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
        >
          {ZIM_CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading && <Loader2 className="animate-spin text-brand-emerald" size={24} />}
      {!loading && prices.length === 0 && (
        <p className="text-sm text-gray-500">No price entries for this city. Add them via Firestore.</p>
      )}
      {!loading && prices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl border border-gray-100 overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Item', 'Unit', 'Min USD', 'Max USD', 'Min ZiG', 'Max ZiG', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => {
                const edit = edits[p.id] ?? {}
                const isDirty = Object.keys(edit).length > 0
                return (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                    {(['minUSD', 'maxUSD', 'minZIG', 'maxZIG'] as const).map((field) => (
                      <td key={field} className="px-4 py-3">
                        <input
                          type="number"
                          defaultValue={p[field]}
                          onChange={(e) => handleEdit(p.id, field, e.target.value)}
                          className="w-24 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSave(p)}
                        disabled={!isDirty || saving === p.id}
                        className="flex items-center gap-1 bg-brand-emerald text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                      >
                        {saving === p.id ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} />}
                        Save
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
