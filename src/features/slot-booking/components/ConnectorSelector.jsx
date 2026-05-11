import { motion } from 'framer-motion'

const GUN_LABELS = ['Gun A', 'Gun B', 'Gun C', 'Gun D']

function connectorWithLabel(connectors) {
  return (connectors || []).map((c, idx) => ({ ...c, label: GUN_LABELS[idx] || `Connector ${idx + 1}` }))
}

export default function ConnectorSelector({ charger, selected, onSelect }) {
  if (!charger) return null
  const connectors = connectorWithLabel(charger.connectors)

  if (!connectors.length) return (
    <p className="text-body text-text-tertiary">No connectors found on this charger.</p>
  )

  return (
    <div className="flex flex-wrap gap-3">
      {connectors.map((conn, i) => {
        const isSelected = selected?.connector_id === conn.connector_id
        const isAvailable = (conn.status || '').toLowerCase() === 'available'
        return (
          <motion.button
            key={conn.connector_id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect({ ...conn, label: conn.label })}
            className={`relative flex flex-col items-center justify-center gap-1.5 w-28 h-28 rounded-lg border transition-colors ${
              isSelected
                ? 'bg-primary/12 border-primary'
                : 'bg-surface-sunken border-border hover:border-border-strong'
            }`}
          >
            <svg className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-text-tertiary'}`}
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span className={`text-body font-semibold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
              {conn.label}
            </span>
            {conn.type && <span className="text-[10px] text-text-tertiary text-center leading-tight px-1">{conn.type}</span>}
            {conn.power_kw && <span className="text-[10px] text-text-tertiary">{conn.power_kw} kW</span>}
            <span
              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isAvailable ? '#2FA36B' : 'rgba(255,255,255,0.20)' }}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
