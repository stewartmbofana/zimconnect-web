import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useAuth } from '../../auth/AuthProvider'
import { ModeratorQueuePage } from './ModeratorQueuePage'
import { CivicBulletinComposer } from './CivicBulletinComposer'
import { CommodityPriceManager } from './CommodityPriceManager'
import { ContactsTransitManager } from './ContactsTransitManager'
import { PublicationsManager } from './PublicationsManager'
import { Inbox, Newspaper, DollarSign, MapPin, List, LogOut } from 'lucide-react'

type AdminTab = 'queue' | 'bulletins' | 'prices' | 'contacts' | 'publications'

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'queue',        label: 'Review Queue',   icon: <Inbox size={16} /> },
  { id: 'bulletins',   label: 'Bulletins',       icon: <Newspaper size={16} /> },
  { id: 'prices',      label: 'Commodity Prices', icon: <DollarSign size={16} /> },
  { id: 'contacts',    label: 'Contacts & Transit', icon: <MapPin size={16} /> },
  { id: 'publications', label: 'Publications',   icon: <List size={16} /> },
]

export function AdminShell() {
  const { user, claims } = useAuth()
  const [tab, setTab] = useState<AdminTab>('queue')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin header */}
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-brand-emerald">Pa~ZimConnect</span>
          <span className="text-gray-400 text-sm">·</span>
          <span className="text-gray-300 text-sm capitalize">{claims.role} Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{user?.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar nav */}
        <nav className="w-52 bg-white border-r border-gray-100 py-4 shrink-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
                tab === t.id
                  ? 'bg-emerald-50 text-brand-emerald border-r-2 border-brand-emerald'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          {tab === 'queue'        && <ModeratorQueuePage />}
          {tab === 'bulletins'    && <CivicBulletinComposer />}
          {tab === 'prices'       && <CommodityPriceManager />}
          {tab === 'contacts'     && <ContactsTransitManager />}
          {tab === 'publications' && <PublicationsManager />}
        </main>
      </div>
    </div>
  )
}
