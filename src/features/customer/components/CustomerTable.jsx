import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Loader2 } from 'lucide-react'

const KYC_COLOR = {
  VERIFIED: 'text-emerald-400 bg-emerald-400/10',
  PENDING:  'text-amber-400  bg-amber-400/10',
  REJECTED: 'text-red-400    bg-red-400/10',
}

function Skeleton() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded bg-slate-700/60 animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  )
}

export default function CustomerTable({ customers, loading, hasMore, onLoadMore, total }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/60">
              {['Customer', 'Mobile', 'Email', 'Wallet', 'KYC', 'Vehicle'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading && customers.length === 0 && (
              [...Array(8)].map((_, i) => <Skeleton key={i} />)
            )}
            {customers.map((c, i) => (
              <motion.tr
                key={c._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i, 10) * 0.03 }}
                onClick={() => navigate(`/customers/${c._id}`)}
                className="cursor-pointer hover:bg-slate-800/50 transition-colors group"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-xs font-bold flex-shrink-0">
                      {(c.customer_name || c.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{c.customer_name || '—'}</p>
                      <p className="text-[10px] text-slate-500">
                        {c.is_deleted
                          ? <span className="text-red-400">Deleted</span>
                          : c.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-300 font-mono text-xs">{c.mobile || '—'}</td>
                <td className="px-4 py-3.5 text-slate-400 text-xs">{c.email || '—'}</td>
                <td className="px-4 py-3.5 text-white font-semibold">
                  ₹{(c.wallet_balance ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${KYC_COLOR[c.kyc_status] ?? 'text-slate-400 bg-slate-700/50'}`}>
                    {c.kyc_status || '—'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-xs font-mono">
                  {c.vehicle?.vehicle_no || '—'}
                </td>
                <td className="px-4 py-3.5">
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-accent transition-colors" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-xs text-slate-500">
          Showing <span className="text-white">{customers.length}</span> of <span className="text-white">{total}</span> customers
        </p>
        {hasMore && (
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Load more
          </button>
        )}
      </div>
    </div>
  )
}
