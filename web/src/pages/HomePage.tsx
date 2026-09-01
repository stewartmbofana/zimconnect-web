import { Link } from 'react-router-dom'
import { Grid2X2, MapPin, Send, Zap } from 'lucide-react'

export function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Pa~<span className="text-brand-emerald">Zim</span>
          <span className="text-brand-gold">Connect</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Zimbabwe's community platform — local listings, civic information,
          emergency contacts, and more. Built for low-bandwidth connectivity.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 bg-brand-emerald text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            <Grid2X2 size={18} />
            Browse Directory
          </Link>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 border-2 border-brand-emerald text-brand-emerald px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
          >
            <Send size={18} />
            Submit a Listing
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            icon: <Grid2X2 className="text-brand-emerald" size={28} />,
            title: 'Community Directory',
            desc: 'Browse active listings across 11 categories in Harare, Bulawayo, Mutare and more.',
            href: '/directory',
          },
          {
            icon: <MapPin className="text-brand-gold" size={28} />,
            title: 'Civic Information',
            desc: 'Prices, emergency contacts, kombi routes and civic bulletins for your city.',
            href: '/civic',
          },
          {
            icon: <Zap className="text-brand-crimson" size={28} />,
            title: 'Urgent Notices',
            desc: 'Real-time load shedding, water and council alerts for your neighbourhood.',
            href: '/civic',
          },
        ].map((f) => (
          <Link
            key={f.title}
            to={f.href}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
