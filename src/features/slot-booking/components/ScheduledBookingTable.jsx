import { motion, AnimatePresence } from 'framer-motion'
import { Table, THead, TBody, TR, TH, TD, Badge, Button, EmptyState, Spinner } from '../../../components/ui'

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
}

export default function ScheduledBookingTable({ bookings, loading, cancellingId, onCancel }) {
  if (loading && !bookings.length) return (
    <div className="rounded-lg border border-border bg-surface-elevated">
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner size="lg" className="text-primary" />
        <p className="text-body text-text-tertiary">Loading bookings…</p>
      </div>
    </div>
  )

  if (!bookings.length) return (
    <div className="rounded-lg border border-border bg-surface-elevated">
      <EmptyState
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        }
        title="No scheduled bookings"
        description="Bookings created from the Advance Slot Booking flow will appear here."
      />
    </div>
  )

  return (
    <Table>
      <THead sticky>
        {['Booking ID', 'Customer', 'Vehicle', 'Station', 'Charger', 'Connector', 'Start', 'End', 'Status', 'Payment', ''].map((h, i) => (
          <TH key={i} className="bg-surface-elevated">{h}</TH>
        ))}
      </THead>
      <TBody>
        <AnimatePresence initial={false}>
          {bookings.map((b, i) => (
            <motion.tr
              key={b._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.02 }}
              className="group transition-colors hover:bg-white/[0.02]"
            >
              <TD className="font-mono text-caption text-primary">{b.booking_id}</TD>
              <TD>
                <p className="text-text-primary text-caption font-medium">{b.customer_name || '—'}</p>
                <p className="text-text-tertiary text-[10px]">{b.customer_mobile || ''}</p>
              </TD>
              <TD className="text-caption">{b.vehicle_no || '—'}</TD>
              <TD className="text-caption max-w-[140px] truncate">{b.station_name || '—'}</TD>
              <TD className="text-caption font-mono">{b.charger_code || '—'}</TD>
              <TD className="text-caption">{b.connector_label || b.connector_id || '—'}</TD>
              <TD className="text-caption">{fmt(b.scheduled_start_time)}</TD>
              <TD className="text-caption">{fmt(b.scheduled_end_time)}</TD>
              <TD><Badge status={b.status} size="sm" /></TD>
              <TD><Badge status={b.payment_status || 'pending'} size="sm" /></TD>
              <TD align="right">
                {b.status === 'scheduled' ? (
                  <Button
                    variant="ghost" size="xs"
                    onClick={() => onCancel(b._id)}
                    loading={cancellingId === b._id}
                    className="text-danger hover:bg-danger/10"
                  >
                    Cancel
                  </Button>
                ) : (
                  <span className="text-text-tertiary text-caption">—</span>
                )}
              </TD>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TBody>
    </Table>
  )
}
