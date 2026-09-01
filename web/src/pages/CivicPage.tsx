import { useState } from 'react'
import { ZIM_CITIES, type CityId } from '../data/constants'
import { CommodityPriceTable } from '../components/civic/CommodityPriceTable'
import { EmergencyContacts } from '../components/civic/EmergencyContacts'
import { KombiTransitGuide } from '../components/civic/KombiTransitGuide'
import { CivicBulletin } from '../components/civic/CivicBulletin'

type Tab = 'prices' | 'contacts' | 'transit' | 'bulletins'

const TABS: { id: Tab; label: string }[] = [
  { id: 'prices',   label: 'Commodity Prices' },
  { id: 'contacts', label: 'Emergency Contacts' },
  { id: 'transit',  label: 'Kombi Transit' },
  { id: 'bulletins', label: 'Civic Bulletins' },
]

export function CivicPage() {
  const [locationId, setLocationId] = useState<CityId>('harare')
  const [tab, setTab] = useState<Tab>('bulletins')

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Civic Information</h1>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value as CityId)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
          aria-label="Select city"
        >
          {ZIM_CITIES.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-brand-emerald text-brand-emerald'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'prices'   && <CommodityPriceTable locationId={locationId} />}
      {tab === 'contacts' && <EmergencyContacts locationId={locationId} />}
      {tab === 'transit'  && <KombiTransitGuide locationId={locationId} />}
      {tab === 'bulletins' && <CivicBulletin locationId={locationId} />}
    </main>
  )
}
