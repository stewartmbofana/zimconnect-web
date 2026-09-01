import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { ZIM_CITIES, CATEGORIES, type CityId, type CategoryId } from '../data/constants'
import { usePublications } from '../hooks/usePublications'
import { PublicationCard } from '../components/PublicationCard'

export function DirectoryPage() {
  const [locationId, setLocationId] = useState<CityId>('harare')
  const [category, setCategory] = useState<CategoryId>('all')
  const [search, setSearch] = useState('')

  const { publications, loading, error } = usePublications({
    locationId,
    category,
    searchTerm: search,
  })

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Directory</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Location switcher */}
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value as CityId)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
          aria-label="Select city"
        >
          {ZIM_CITIES.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings…"
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat.id
                ? 'bg-brand-emerald text-white border-brand-emerald'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-emerald hover:text-brand-emerald'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-brand-emerald" size={32} />
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-600">
          <p>Failed to load listings. Please try again.</p>
        </div>
      )}

      {!loading && !error && publications.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p>No listings found for this location and category.</p>
        </div>
      )}

      {!loading && !error && publications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {publications.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>
      )}
    </main>
  )
}
