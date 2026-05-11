import { useNavigate } from 'react-router-dom'
import SessionStatusBadge from './SessionStatusBadge.jsx'

const COLS = [
  { key: 'session_id',        label: 'Booking ID'  },
  { key: 'customer_name',     label: 'Customer'    },
  { key: 'charger_code',      label: 'Charger'     },
  { key: 'type',              label: 'Type'        },
  { key: 'party_name',        label: 'Party'       },
  { key: 'kwh',               label: 'kWh'         },
  { key: 'total_cost',        label: 'Cost'        },
  { key: 'session_status',    label: 'Status'      },
  { key: 'payment_status',    label: 'Payment'     },
  { key: 'invoice_generated', label: 'Invoice'     },
  { key: 'actions',           label: ''            },
]

function SkeletonRow({ n }) {
  return (
    <tr>
      {Array.from({ length: n }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-surface-700 rounded animate-pulse w-24" />
        </td>
      ))}
    </tr>
  )
}

function PaginBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
        active
          ? 'bg-brand-accent text-white border-brand-accent'
          : 'text-slate-400 bg-surface-800 hover:bg-surface-700 border-surface-700'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function Pagination({ meta, onPageChange }) {
  if (!meta || meta.pages <= 1) return null
  const start = Math.max(1, Math.min(meta.page - 2, meta.pages - 4))
  const pages = Array.from({ length: Math.min(5, meta.pages) }, (_, i) => start + i)
  return (
    <div className="flex items-center justify-between px-1 mt-4">
      <p className="text-xs text-slate-500 font-medium">
        {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
      </p>
      <div className="flex items-center gap-1.5">
        <PaginBtn onClick={() => onPageChange(meta.page - 1)} disabled={meta.page <= 1}>← Prev</PaginBtn>
        {pages.map(p => (
          <PaginBtn key={p} onClick={() => onPageChange(p)} active={p === meta.page}>{p}</PaginBtn>
        ))}
        <PaginBtn onClick={() => onPageChange(meta.page + 1)} disabled={meta.page >= meta.pages}>Next →</PaginBtn>
      </div>
    </div>
  )
}

function TypeBadge({ isEmsp }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
      isEmsp
        ? 'bg-violet-400/10 text-violet-400 border-violet-400/20'
        : 'bg-blue-400/10 text-blue-400 border-blue-400/20'
    }`}>
      {isEmsp ? 'EMSP' : 'CPO'}
    </span>
  )
}

export default function SessionTable({ data = [], loading, meta, onPageChange, onResolve, onGenerateInvoice }) {
  const navigate = useNavigate()

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-900 sticky top-0 z-10">
            <tr>
              {COLS.map(c => (
                <th key={c.key} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} n={COLS.length} />)
              : data.length === 0
                ? (
                  <tr>
                    <td colSpan={COLS.length} className="px-4 py-14 text-center text-slate-500 text-sm">
                      No sessions found
                    </td>
                  </tr>
                )
                : data.map(row => {
                  const isEmsp = row.is_emsp_based_booking === true
                    && row.is_ocpi_based_booking === true
                    && row.party_handshake === true

                  const showResolve         = isEmsp && (row.session_status === 'in_progress' || row.is_faulty)
                  const showGenerateInvoice = isEmsp && row.payment_status === 'paid' && !row.invoice_id

                  return (
                    <tr key={row._id} className="bg-surface-950 hover:bg-surface-900/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-brand-accent whitespace-nowrap">
                        {row.session_id || '—'}
                      </td>
                      <td className="px-4 py-3 text-white whitespace-nowrap">
                        {row.customer_name || '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {row.charger_code || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <TypeBadge isEmsp={isEmsp} />
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {isEmsp ? (row.party_name || '—') : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">
                        {row.kwh != null ? `${Number(row.kwh).toFixed(2)} kWh` : '—'}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold whitespace-nowrap">
                        {row.total_cost != null ? `₹${Number(row.total_cost).toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SessionStatusBadge value={row.session_status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SessionStatusBadge value={row.payment_status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SessionStatusBadge value={row.invoice_generated} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/sessions/${row._id}`)}
                            className="px-3 py-1 text-xs font-semibold text-brand-accent bg-brand-accent/10 hover:bg-brand-accent/20 rounded-lg transition-colors"
                          >
                            View
                          </button>
                          {showResolve && (
                            <button
                              onClick={() => onResolve?.(row)}
                              className="px-3 py-1 text-xs font-semibold text-white bg-surface-800 hover:bg-surface-700 rounded-lg border border-surface-700 transition-colors"
                            >
                              Resolve
                            </button>
                          )}
                          {showGenerateInvoice && (
                            <button
                              onClick={() => onGenerateInvoice?.(row)}
                              className="px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg border border-amber-400/20 transition-colors"
                            >
                              Invoice
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-4">
        <Pagination meta={meta} onPageChange={onPageChange} />
      </div>
    </div>
  )
}
