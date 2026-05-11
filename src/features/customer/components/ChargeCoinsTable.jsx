import { Loader2 } from 'lucide-react'

const TYPE_COLOR = {
  EARNED:   'text-emerald-400 bg-emerald-400/10',
  REDEEMED: 'text-violet-400  bg-violet-400/10',
  EXPIRED:  'text-slate-400   bg-slate-400/10',
}

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function Skeleton() {
  return (
    <tr>
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded bg-slate-700/60 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function ChargeCoinsTable({ rows, loading, hasMore, onLoadMore, total }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 border-b border-slate-700/50">
              {['Type', 'Source', 'Coins', 'Booking ID', 'kWh Used', 'Description', 'Date'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading && !rows.length && [...Array(5)].map((_, i) => <Skeleton key={i} />)}
            {rows.map((c) => (
              <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${TYPE_COLOR[c.type] ?? 'text-slate-400 bg-slate-700/40'}`}>
                    {c.type || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{c.source || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold text-sm ${c.type === 'EARNED' ? 'text-emerald-400' : c.type === 'REDEEMED' ? 'text-violet-400' : 'text-slate-400'}`}>
                    {c.type === 'EARNED' ? '+' : '−'}{c.coins ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-brand-accent">{c.booking_id || '—'}</td>
                <td className="px-4 py-3 text-slate-300 text-xs">{c.kwh_used != null ? `${c.kwh_used.toFixed(2)} kWh` : '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-[160px] truncate">{c.description || '—'}</td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{fmt(c.createdAt)}</td>
              </tr>
            ))}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">No ChargeCoin records found</td>
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
          <button onClick={onLoadMore} disabled={loading}
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
