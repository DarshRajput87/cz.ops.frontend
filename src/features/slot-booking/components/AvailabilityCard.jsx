import { motion } from 'framer-motion'
import { Button, Badge } from '../../../components/ui'

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
}

const CheckIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
)

export default function AvailabilityCard({ availability, loading, onCheck }) {
  return (
    <div className="space-y-3">
      <Button variant="secondary" size="md" onClick={onCheck} loading={loading} iconLeft={!loading && CheckIcon}>
        {loading ? 'Checking availability…' : 'Check Availability'}
      </Button>

      {availability && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-4"
          style={availability.available
            ? { backgroundColor: 'rgba(47,163,107,0.07)', borderColor: 'rgba(47,163,107,0.30)' }
            : { backgroundColor: 'rgba(214,69,69,0.07)',  borderColor: 'rgba(214,69,69,0.30)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            {availability.available ? (
              <>
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-body font-semibold text-success">Slot Available</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-body font-semibold text-danger">Slot Not Available</span>
              </>
            )}
          </div>

          {availability.available && (
            <p className="text-caption text-success/80">
              This time slot is free — no conflicting bookings or active sessions found on this connector.
            </p>
          )}

          {!availability.available && availability.conflicts?.length > 0 && (
            <div className="space-y-2 mt-3">
              <p className="text-overline uppercase text-text-tertiary">Conflicting Bookings</p>
              {availability.conflicts.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-caption bg-surface-sunken rounded-md px-3 py-2 border border-border">
                  <span className="text-text-secondary font-medium font-mono">{c.booking_id}</span>
                  <span className="text-text-tertiary">{fmt(c.scheduled_start_time)} – {fmt(c.scheduled_end_time)}</span>
                  <Badge status={c.status} size="sm" />
                </div>
              ))}
            </div>
          )}

          {!availability.available && availability.activeSessions?.length > 0 && (
            <div className="mt-2">
              <p className="text-overline uppercase text-text-tertiary">Active Sessions on Connector</p>
              {availability.activeSessions.map((s, i) => (
                <p key={i} className="text-caption text-danger mt-1">{s.session_id} · {s.status}</p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
