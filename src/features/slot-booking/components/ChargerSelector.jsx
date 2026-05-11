import { motion } from 'framer-motion'
import { Spinner, Badge } from '../../../components/ui'

const STATUS_VARIANT = {
  available:   'success',
  charging:    'warning',
  faulted:     'danger',
  unavailable: 'danger',
  offline:     'neutral',
}

export default function ChargerSelector({ chargers, selected, onSelect, loading }) {
  if (loading) return (
    <div className="flex items-center gap-2 text-body text-text-tertiary py-4">
      <Spinner size="sm" className="text-primary" /> Loading chargers…
    </div>
  )

  if (!chargers.length) return (
    <p className="text-body text-text-tertiary py-2">No chargers found for this station.</p>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {chargers.map((c, i) => {
        const isSelected = selected?._id === c._id
        const statusKey  = (c.status || '').toLowerCase()
        return (
          <motion.button
            key={c._id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(c)}
            className={`text-left rounded-lg p-3.5 border transition-colors ${
              isSelected
                ? 'bg-primary/10 border-primary/50'
                : 'bg-surface-sunken border-border hover:border-border-strong'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={`text-body font-semibold truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                  {c.charger_code || '—'}
                </p>
                <div className="flex items-center gap-2 mt-1 text-caption text-text-tertiary">
                  {c.charger_type && <span>{c.charger_type}</span>}
                  {c.power_kw && <span>· {c.power_kw} kW</span>}
                </div>
                {c.make && <p className="text-[11px] text-text-tertiary/70 mt-0.5">{c.make} {c.model || ''}</p>}
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                )}
                <Badge variant={STATUS_VARIANT[statusKey] || 'neutral'} size="sm" withDot>
                  {c.status || 'unknown'}
                </Badge>
              </div>
            </div>
            {c.connectors?.length > 0 && (
              <div className="mt-2 flex gap-1.5">
                {c.connectors.map((conn, idx) => (
                  <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-tertiary">
                    {conn.type || conn.connector_id}
                  </span>
                ))}
              </div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
