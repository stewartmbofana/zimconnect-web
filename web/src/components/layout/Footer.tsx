import { NationalAccentRibbon } from './NationalAccentRibbon'
import { useStealthTrigger } from '../../router/stealthTrigger.tsx'

export function Footer() {
  const { handleClick, AdminLoginModal } = useStealthTrigger()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <NationalAccentRibbon onSecretClick={handleClick} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Pa~ZimConnect. All rights reserved.</p>
          <p>Connecting Zimbabwe's communities.</p>
        </div>
      </div>
      <AdminLoginModal />
    </footer>
  )
}
