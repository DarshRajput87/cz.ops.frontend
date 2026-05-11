import { Loader2, Zap } from 'lucide-react'

function Skeleton() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded bg-slate-700/60 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function VehicleTable({ rows, loading, hasMore, onLoadMore, total }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 border-b border-slate-700/50">
              {['Vehicle No', 'Brand', 'Model', 'Autocharge', 'Sessions', 'kWh'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading && !rows.length && [...Array(3)].map((_, i) => <Skeleton key={i} />)}
            {rows.map((v) => (
              <tr key={v._id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-brand-accent font-semibold">{v.vehicle_no || '—'}</span>
                </td>
                <td className="px-4 py-3 text-slate-300">{v.vehicle_brand || '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{v.vehicle_model || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 text-xs font-medium ${v.autocharge_enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {v.autocharge_enabled && <Zap className="w-3.5 h-3.5" />}
                    {v.autocharge_enabled ? 'Enabled' : 'Off'}
                  </span>
                </td>
                <td className="px-4 py-3 text-white font-semibold">{v.total_sessions ?? 0}</td>
                <td className="px-4 py-3 text-white font-semibold">
                  {(v.total_kwh ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">No vehicles found</td>
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
