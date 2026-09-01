import { Link, NavLink } from 'react-router-dom'
import { Grid2X2, MapPin, Send } from 'lucide-react'

export function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-emerald text-white'
        : 'text-gray-700 hover:bg-emerald-50 hover:text-brand-emerald'
    }`

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-brand-emerald font-bold text-lg tracking-tight">
              Pa~<span className="text-brand-gold">Zim</span>Connect
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/directory" className={navLinkClass}>
              <Grid2X2 size={15} />
              Directory
            </NavLink>
            <NavLink to="/civic" className={navLinkClass}>
              <MapPin size={15} />
              Civic
            </NavLink>
            <NavLink to="/submit" className={navLinkClass}>
              <Send size={15} />
              Submit
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
