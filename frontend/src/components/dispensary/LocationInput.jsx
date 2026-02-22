import { useState } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'
import Button from '../shared/Button'
import Card from '../shared/Card'

export default function LocationInput({ onLocationSet, loading = false }) {
  const [manualInput, setManualInput] = useState('')
  const [geoStatus, setGeoStatus] = useState(null) // 'requesting' | 'success' | 'error'
  const [geoError, setGeoError] = useState(null)
  const [resolvedCoords, setResolvedCoords] = useState(null)

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      setGeoError('Geolocation is not supported by your browser')
      return
    }

    setGeoStatus('requesting')
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setResolvedCoords(coords)
        setGeoStatus('success')
        onLocationSet?.({ type: 'coords', ...coords })
      },
      (err) => {
        setGeoStatus('error')
        setGeoError(err.message || 'Failed to get your location')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const trimmed = manualInput.trim()
    if (!trimmed) return
    onLocationSet?.({ type: 'manual', query: trimmed })
  }

  return (
    <Card className="p-6 space-y-5">
      {/* Geolocation button */}
      <div className="text-center space-y-3">
        <Button
          size="full"
          onClick={handleUseMyLocation}
          disabled={loading || geoStatus === 'requesting'}
          className="justify-center"
        >
          {geoStatus === 'requesting' ? (
            <Loader2 className="w-5 h-5 animate-spin-slow" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
          {geoStatus === 'requesting' ? 'Getting Location...' : 'Use My Location'}
        </Button>

        {/* Geolocation success */}
        {geoStatus === 'success' && resolvedCoords && (
          <p className="text-xs text-leaf-400 animate-fade-in-fast">
            Location found: {resolvedCoords.lat.toFixed(4)}, {resolvedCoords.lng.toFixed(4)}
          </p>
        )}

        {/* Geolocation error */}
        {geoStatus === 'error' && geoError && (
          <p className="text-xs text-red-400 animate-fade-in-fast">
            {geoError}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        <span className="text-xs text-gray-400 dark:text-[#6a7a6e] uppercase tracking-wider">
          or enter your location
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
      </div>

      {/* Manual input */}
      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#6a7a6e] pointer-events-none" />
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Zip code or city name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
              bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10
              text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#5a6a5e]
              focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent
              transition-all duration-200"
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="md"
          disabled={loading || !manualInput.trim()}
        >
          Search
        </Button>
      </form>
    </Card>
  )
}
