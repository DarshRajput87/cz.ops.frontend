import { useState } from 'react'
import { useResolveSession } from '../../hooks/useSessions.js'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-sm font-semibold text-white text-right">{value || '—'}</span>
    </div>
  )
}

function getConfig(session) {
  if (session.session_status === 'in_progress') {
    return {
      title:      'Resolve Session',
      subtitle:   'Stop this session, generate CDR and invoice.',
      btnLabel:   'Resolve Session',
      successMsg: 'Session resolved. Invoice generated.',
      action:     'resolve',
    }
  }
  if (session.is_faulty) {
    return {
      title:      'Clear Fault',
      subtitle:   'Clear the fault record and generate invoice.',
      btnLabel:   'Clear & Resolve',
      successMsg: 'Fault cleared. Invoice generated.',
      action:     'resolve',
    }
  }
  return {
    title:      'Generate Invoice',
    subtitle:   'Payment received but no invoice exists. Generate now.',
    btnLabel:   'Generate Invoice',
    successMsg: 'Invoice generated successfully.',
    action:     'generateInvoice',
  }
}

export default function ResolveSessionModal({ session, onClose, onResolved }) {
  const [done, setDone] = useState(false)
  const { resolve, generateInvoice, loading, error } = useResolveSession(() => {
    setDone(true)
    setTimeout(() => { onResolved?.(); onClose() }, 1400)
  })

  const cfg = getConfig(session)

  function handleAction() {
    if (cfg.action === 'generateInvoice') {
      generateInvoice(session._id)
    } else {
      resolve(session._id)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-black text-base">{cfg.successMsg}</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-black text-white">{cfg.title}</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{session.session_id}</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">{cfg.subtitle}</p>

            <div className="bg-surface-800/60 border border-surface-700 rounded-xl p-4 mb-5 space-y-3">
              <Row label="Status"   value={session.session_status} />
              <Row label="Payment"  value={session.payment_status} />
              <Row label="Customer" value={session.customer_name}  />
              <Row label="kWh"      value={session.kwh != null ? `${Number(session.kwh).toFixed(2)} kWh` : null} />
              <Row label="Cost"     value={session.total_cost != null ? `₹${Number(session.total_cost).toFixed(2)}` : null} />
              {session.is_faulty && session.faulty_reason?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Fault Reasons</p>
                  <div className="flex flex-wrap gap-1">
                    {session.faulty_reason.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] rounded-md border border-rose-400/20">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-400 bg-surface-800 hover:bg-surface-700 rounded-xl border border-surface-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-black text-white bg-brand-accent hover:brightness-110 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-surface-950/30 border-t-surface-950 rounded-full animate-spin" />
                )}
                {loading ? 'Processing…' : cfg.btnLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
