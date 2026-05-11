import { Loader2 } from 'lucide-react'

const STATUS_COLOR = {
  PENDING:     'text-amber-400  bg-amber-400/10',
  CONFIRMED:   'text-blue-400   bg-blue-400/10',
  IN_PROGRESS: 'text-cyan-400   bg-cyan-400/10',
  COMPLETED:   'text-emerald-400 bg-emerald-400/10',
  CANCELLED:   'text-red-400    bg-red-400/10',
}

const PAY_COLOR = {
  PAID:     'text-emerald-400 bg-emerald-400/10',
  PENDING:  'text-amber-400  bg-amber-400/10',
  FAILED:   'text-red-400    bg-red-400/10',
  REFUNDED: 'text-violet-400 bg-violet-400/10',
}

function Badge({ label, colorClass }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${colorClass ?? 'text-slate-400 bg-slate-700/40'}`}>
      {label || '—'}
    </span>
  )
}

function Skeleton() {
  return (
    <tr>
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded bg-slate-700/60 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function BookingsTable({ rows, loading, hasMore, onLoadMore, total }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 border-b border-slate-700/50">
              {['Booking ID', 'Vehicle No', 'Charger', 'Station', 'Amount', 'Units', 'Status', 'Payment'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading && !rows.length && [...Array(5)].map((_, i) => <Skeleton key={i} />)}
            {rows.map((b) => (
              <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-brand-accent">{b.booking_id || '—'}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{b.vehicle_no || '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{b.charger_name || b.charger_id || '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{b.station_name || '—'}</td>
                <td className="px-4 py-3 text-white font-semibold">₹{(b.amount ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-300">{(b.units ?? 0).toFixed(2)} kWh</td>
                <td className="px-4 py-3"><Badge label={b.status} colorClass={STATUS_COLOR[b.status]} /></td>
                <td className="px-4 py-3"><Badge label={b.payment_status} colorClass={PAY_COLOR[b.payment_status]} /></td>
              </tr>
            ))}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-xs text-slate-500">
          Showing <span className="text-white">{rows.length}</span> of <span className="text-white">{total}</span>
        </p>
        {hasMore && (
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Load more
          </button>
        )}
      </div>
    </div>
  )
}
