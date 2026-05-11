import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import SessionStatusBadge from '../../components/session/SessionStatusBadge.jsx'
import ResolveSessionModal from '../../components/session/ResolveSessionModal.jsx'
import { useInprogressSessions } from '../../hooks/useSessions.js'

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-surface-700 rounded animate-pulse w-24" />
        </td>
      ))}
    </tr>
  )
}

export default function InprogressSessions() {
  const { data, meta, loading, error, filters, setFilters, refetch } = useInprogressSessions()
  const [resolveTarget, setResolveTarget] = useState(null)

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight">In-Progress Sessions</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Active sessions currently being processed</p>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-4 mb-4 flex items-center justify-between gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search session, charger, vehicle..."
          value={filters.search || ''}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
          className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-colors min-w-[240px]"
        />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{meta.total} Active</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>
      )}

      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-900 sticky top-0">
              <tr>
                {['Session ID', 'Customer', 'Party', 'Charger', 'kWh', 'Cost', 'Payment', 'Started', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : data.length === 0
                  ? <tr><td colSpan={9} className="px-4 py-14 text-center text-slate-500">No in-progress sessions</td></tr>
                  : data.map(row => (
                    <tr key={row._id} className="bg-surface-950 hover:bg-surface-900/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-brand-accent">{row.session_id || '—'}</td>
                      <td className="px-4 py-3 text-white">{row.customer_name}</td>
                      <td className="px-4 py-3 text-slate-400">{row.party_name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{row.charger_id || '—'}</td>
                      <td className="px-4 py-3 text-white font-semibold">{row.kwh != null ? `${row.kwh}` : '—'}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{row.total_cost != null ? `₹${Number(row.total_cost).toFixed(2)}` : '—'}</td>
                      <td className="px-4 py-3"><SessionStatusBadge value={row.payment_status} /></td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {row.started_at ? new Date(row.started_at).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setResolveTarget(row)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-surface-800 hover:bg-brand-accent hover:text-surface-950 rounded-lg border border-surface-700 transition-colors"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={refetch}
                            className="px-3 py-1 text-xs font-semibold text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 rounded-lg transition-colors"
                          >
                            Force
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {meta.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-800">
            <p className="text-xs text-slate-500">{meta.total} sessions</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                disabled={meta.page <= 1}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-surface-800 hover:bg-surface-700 rounded-lg border border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-xs text-slate-400">Page {meta.page} / {meta.pages}</span>
              <button
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                disabled={meta.page >= meta.pages}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-surface-800 hover:bg-surface-700 rounded-lg border border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {resolveTarget && (
        <ResolveSessionModal
          session={resolveTarget}
          onClose={() => setResolveTarget(null)}
          onResolved={() => { refetch(); setResolveTarget(null) }}
        />
      )}
    </DashboardLayout>
  )
}
