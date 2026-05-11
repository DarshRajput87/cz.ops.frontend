import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import SessionTable from '../../components/session/SessionTable.jsx'
import SessionFilters from '../../components/session/SessionFilters.jsx'
import ResolveSessionModal from '../../components/session/ResolveSessionModal.jsx'
import { useLiveSessions } from '../../hooks/useSessions.js'

const TABS = [
  { key: 'all',  label: 'All'  },
  { key: 'cpo',  label: 'CPO'  },
  { key: 'emsp', label: 'EMSP' },
]

const STAT_ICONS = {
  total:   <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  active:  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  faulty:  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
  pending: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
  revenue: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  energy:  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />,
}

const STAT_META = [
  { key: 'total',   label: 'Total Sessions',  color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
  { key: 'active',  label: 'Active Sessions',  color: 'text-emerald-400',  bg: 'bg-emerald-400/10'  },
  { key: 'faulty',  label: 'Faulty Sessions',  color: 'text-rose-400',     bg: 'bg-rose-400/10'     },
  { key: 'pending', label: 'Pending Invoices', color: 'text-amber-400',    bg: 'bg-amber-400/10'    },
  { key: 'revenue', label: 'Total Revenue',    color: 'text-violet-400',   bg: 'bg-violet-400/10'   },
  { key: 'energy',  label: 'Total Energy',     color: 'text-cyan-400',     bg: 'bg-cyan-400/10'     },
]

export default function LiveSessions() {
  const [tab, setTab]                   = useState('all')
  const [filters, setFilters]           = useState({ type: 'all', page: 1, limit: 10 })
  const [resolveTarget, setResolveTarget] = useState(null)

  const { data, meta, loading, error, setFilters: applyFilters, refetch } = useLiveSessions()

  function handleFiltersChange(f) {
    setFilters(prev => {
      const next = { ...prev, ...f }
      applyFilters({ ...next, type: tab })
      return next
    })
  }

  function handleTab(key) {
    setTab(key)
    applyFilters({ ...filters, type: key, page: 1 })
  }

  const stats = {
    total:   meta.total,
    active:  meta.activeCount         ?? 0,
    faulty:  meta.faultyCount         ?? 0,
    pending: meta.invoiceMissingCount ?? 0,
    revenue: (meta.totalRevenue ?? 0).toFixed(2),
    energy:  (meta.totalEnergy  ?? 0).toFixed(2),
  }

  function renderStatValue(key) {
    if (key === 'revenue') return `₹${stats[key]}`
    if (key === 'energy')  return `${stats[key]} kWh`
    return stats[key]
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight">Live Sessions</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Real-time EV charging session monitoring</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {STAT_META.map(s => (
          <div key={s.key} className="bg-surface-900 border border-surface-800 rounded-2xl p-5 hover:border-surface-700 transition-all group">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {STAT_ICONS[s.key]}
              </svg>
            </div>
            <p className="text-xl font-black text-white">{renderStatValue(s.key)}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-900 rounded-xl border border-surface-800 w-fit mb-5">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTab(t.key)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === t.key ? 'bg-brand-accent text-surface-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4">
        <SessionFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>
      )}

      {/* Table */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
        <SessionTable
          data={data}
          loading={loading}
          meta={meta}
          onPageChange={p => applyFilters({ ...filters, type: tab, page: p })}
          onResolve={setResolveTarget}
          onGenerateInvoice={setResolveTarget}
        />
      </div>

      {resolveTarget && (
        <ResolveSessionModal
          session={resolveTarget}
          onClose={() => setResolveTarget(null)}
          onResolved={refetch}
        />
      )}
    </DashboardLayout>
  )
}
