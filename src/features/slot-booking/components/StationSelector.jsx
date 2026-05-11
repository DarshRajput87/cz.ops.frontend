import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Spinner, Badge } from '../../../components/ui'

export default function StationSelector({ stations, selected, onSelect, onLoad, loading }) {
  useEffect(() => { onLoad() }, [onLoad])

  if (loading) return (
    <div className="flex items-center gap-2 text-body text-text-tertiary py-4">
      <Spinner size="sm" className="text-primary" /> Loading stations…
    </div>
  )

  if (!stations.length) return (
    <p className="text-body text-text-tertiary py-2">No active stations found.</p>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {stations.map((s, i) => {
        const isSelected = selected?._id === s._id
        const online = ['active', 'online'].includes((s.status || '').toLowerCase())
        return (
          <motion.button
            key={s._id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelect(s)}
            className={`text-left rounded-lg p-3.5 border transition-colors ${
              isSelected
                ? 'bg-primary/10 border-primary/50'
                : 'bg-surface-sunken border-border hover:border-border-strong'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-body font-semibold truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                  {s.name || s.station_code || 'Station'}
                </p>
                {(s.city || s.state) && (
                  <p className="text-caption text-text-tertiary mt-0.5">{[s.city, s.state].filter(Boolean).join(', ')}</p>
                )}
                {s.address && <p className="text-[11px] text-text-tertiary/70 mt-0.5 line-clamp-1">{s.address}</p>}
              </div>
              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
              )}
            </div>
            {s.status && (
              <div className="mt-2">
                <Badge variant={online ? 'success' : 'neutral'} size="sm" withDot>
                  {s.status}
                </Badge>
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
