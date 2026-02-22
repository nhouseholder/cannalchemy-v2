import { useState } from 'react'
import {
  Store,
  MapPin,
  Star,
  Truck,
  Clock,
  Phone,
  ExternalLink,
  Navigation,
} from 'lucide-react'
import Card from '../shared/Card'
import Button from '../shared/Button'
import { SaleBadge } from '../shared/Badge'

export default function DispensaryCard({ dispensary }) {
  const [expanded, setExpanded] = useState(false)

  const {
    name,
    address,
    distance,
    rating,
    delivery,
    deliveryFee,
    deliveryEta,
    matchedStrains = [],
    alternativeStrains = [],
    deals = [],
    hours,
    phone,
    menuUrl,
  } = dispensary

  const directionsUrl = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : null

  return (
    <Card className="p-5 space-y-4 animate-fade-in-fast">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-leaf-500/10 flex items-center justify-center">
          <Store className="w-5 h-5 text-leaf-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          {address && (
            <p className="text-xs text-gray-500 dark:text-[#8a9a8e] mt-0.5 truncate">
              <MapPin className="w-3 h-3 inline mr-1 -mt-0.5" />
              {address}
            </p>
          )}
        </div>
      </div>

      {/* Distance + Rating row */}
      <div className="flex items-center gap-3 flex-wrap">
        {distance && (
          <span className="text-xs text-gray-500 dark:text-[#8a9a8e]">
            {distance}
          </span>
        )}

        {rating && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {rating}
          </span>
        )}

        {/* Delivery badge */}
        {delivery && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-leaf-500/10 text-leaf-400 border border-leaf-500/20">
            <Truck className="w-3 h-3" />
            Delivery
            {deliveryFee && ` (${deliveryFee})`}
            {deliveryEta && ` - ${deliveryEta}`}
          </span>
        )}

        {/* Sale badges */}
        {deals.length > 0 && <SaleBadge />}
      </div>

      {/* Matched strains */}
      {matchedStrains.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#5a6a5e] mb-1.5 font-semibold">
            Exact Matches
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchedStrains.map((strain) => (
              <span
                key={strain}
                className="inline-flex px-2 py-0.5 rounded-lg text-[11px] font-medium bg-leaf-500/10 text-leaf-400 border border-leaf-500/20"
              >
                {strain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Alternative strains */}
      {alternativeStrains.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#5a6a5e] mb-1.5 font-semibold">
            Similar Strains
          </p>
          <div className="flex flex-wrap gap-1.5">
            {alternativeStrains.map((strain) => (
              <span
                key={strain}
                className="inline-flex px-2 py-0.5 rounded-lg text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
              >
                {strain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deals */}
      {deals.length > 0 && (
        <div className="space-y-1">
          {deals.map((deal, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-amber-400"
            >
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 border border-amber-500/25">
                SALE
              </span>
              <span className="text-gray-600 dark:text-[#b0c4b4]">{deal}</span>
            </div>
          ))}
        </div>
      )}

      {/* Expandable details */}
      {(hours || phone) && (
        <div>
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-xs text-leaf-400 hover:text-leaf-300 transition-colors"
            >
              Show details
            </button>
          ) : (
            <div className="space-y-1.5 animate-fade-in-fast text-xs text-gray-500 dark:text-[#8a9a8e]">
              {hours && (
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {hours}
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <a
                    href={`tel:${phone}`}
                    className="text-leaf-400 hover:underline"
                  >
                    {phone}
                  </a>
                </p>
              )}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-xs text-[#6a7a6e] hover:text-[#8a9a8e] transition-colors"
              >
                Hide details
              </button>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="primary" size="sm" className="w-full justify-center">
              <Navigation className="w-3.5 h-3.5" />
              Get Directions
            </Button>
          </a>
        )}

        {menuUrl && (
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" size="sm" className="w-full justify-center">
              <ExternalLink className="w-3.5 h-3.5" />
              View Menu
            </Button>
          </a>
        )}
      </div>
    </Card>
  )
}
