import { Phone, MessageCircle, MapPin, Tag } from 'lucide-react'
import { buildWhatsAppLink } from '../utils/phone'
import type { Publication } from '../data/types'

interface Props {
  publication: Publication
}

export function PublicationCard({ publication: pub }: Props) {
  const whatsappHref = buildWhatsAppLink(
    pub.sellerPhone,
    `Hi, I saw your listing "${pub.title}" on Pa~ZimConnect`
  )

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Photo */}
      {pub.photoUrls.length > 0 ? (
        <img
          src={pub.photoUrls[0]}
          alt={pub.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
          <Tag className="text-gray-300" size={32} />
        </div>
      )}

      <div className="p-4">
        {/* Category + Featured badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
            {pub.category}
          </span>
          {pub.featured && (
            <span className="text-xs font-medium text-brand-gold bg-yellow-50 px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {pub.title}
        </h3>

        {/* Pricing */}
        <div className="flex gap-3 mb-2 text-sm">
          {pub.priceUSD != null && (
            <span className="font-bold text-gray-900">\${pub.priceUSD} USD</span>
          )}
          {pub.priceZIG != null && (
            <span className="text-gray-500">ZiG {pub.priceZIG}</span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <MapPin size={11} />
          <span className="capitalize">{pub.locationId.replace('-', ' ')}</span>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 rounded-lg transition-colors"
          >
            <MessageCircle size={13} />
            WhatsApp
          </a>
          <a
            href={`tel:${pub.sellerPhone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium py-2 rounded-lg transition-colors"
          >
            <Phone size={13} />
            Call
          </a>
        </div>
      </div>
    </article>
  )
}
