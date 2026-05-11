import { Loader2 } from 'lucide-react'

const TYPE_COLOR  = { CREDIT: 'text-emerald-400', DEBIT: 'text-red-400' }
const STATUS_COLOR = {
  SUCCESS: 'text-emerald-400 bg-emerald-400/10',
  PENDING: 'text-amber-400  bg-amber-400/10',
  FAILED:  'text-red-400    bg-red-400/10',
}

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
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

export default function WalletTransactionsTable({ rows, loading, hasMore, onLoadMore, total }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 border-b border-slate-700/50">
              {['Type', 'Source', 'Amount', 'Before', 'After', 'Mode', 'Status', 'Date'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading && !rows.length && [...Array(5)].map((_, i) => <Skeleton key={i} />)}
            {rows.map((t) => (
              <tr key={t._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <span className={`font-semibold text-xs ${TYPE_COLOR[t.type] ?? 'text-slate-400'}`}>
                    {t.type === 'CREDIT' ? '+' : '−'} {t.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{t.source || '—'}</td>
                <td className={`px-4 py-3 font-bold ${TYPE_COLOR[t.type] ?? 'text-white'}`}>
                  ₹{(t.amount ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">₹{(t.balance_before ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-300 text-xs">₹{(t.balance_after ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{t.payment_mode || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[t.status] ?? 'text-slate-400 bg-slate-700/40'}`}>
                    {t.status || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{fmt(t.createdAt)}</td>
              </tr>
            ))}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">No transactions found</td>
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
