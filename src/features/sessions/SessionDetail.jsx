import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import SessionStatusBadge from '../../components/session/SessionStatusBadge.jsx'
import { useSessionDetail } from '../../hooks/useSessions.js'

function InfoGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
          <p className="text-sm font-semibold text-white mt-0.5 break-all">{value ?? '—'}</p>
        </div>
      ))}
    </div>
  )
}

function Card({ title, children, accent }) {
  return (
    <div className={`bg-surface-900 border rounded-2xl p-6 ${accent ? 'border-brand-accent/30' : 'border-surface-800'}`}>
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-5">{title}</h3>
      {children}
    </div>
  )
}

function TimelineEntry({ entry }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-accent mt-1 shrink-0" />
        <div className="w-px flex-1 bg-surface-800 mt-1" />
      </div>
      <div className="pb-5">
        <p className="text-sm font-black text-white">{entry.action}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}
          {entry.actor ? ` · ${entry.actor}` : ''}
        </p>
        {entry.metadata && (
          <pre className="mt-2 text-[10px] text-slate-500 bg-surface-800 rounded-lg px-3 py-2 overflow-x-auto">
            {JSON.stringify(entry.metadata, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-surface-900 border border-surface-800 rounded-2xl p-6 h-40" />
        ))}
      </div>
    </DashboardLayout>
  )
}

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: session, loading, error } = useSessionDetail(id)

  if (loading) return <Skeleton />

  if (error || !session) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white font-black">{error || 'Session not found'}</p>
          <button onClick={() => navigate(-1)} className="text-brand-accent text-sm font-semibold hover:underline">
            ← Go back
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const fmt = (d) => d ? new Date(d).toLocaleString() : '—'
  const money = (n) => n != null ? `₹${Number(n).toFixed(2)}` : '—'

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-white text-xs font-semibold mb-2 flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-2xl font-black text-white tracking-tight">Session Detail</h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{session.session_id}</p>
        </div>
        <div className="flex items-center gap-2">
          <SessionStatusBadge value={session.session_status} />
          <SessionStatusBadge value={session.booking?.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Session Info" accent>
            <InfoGrid items={[
              { label: 'Session ID', value: session.session_id },
              { label: 'Booking ID', value: session.booking_id },
              { label: 'Charger ID', value: session.charger_id },
              { label: 'Station ID', value: session.station_id },
              { label: 'Vehicle No.', value: session.vehicle_no },
              { label: 'Type', value: session.type?.toUpperCase() },
              { label: 'Started', value: fmt(session.started_at) },
              { label: 'Ended', value: fmt(session.ended_at) },
              { label: 'Energy (kWh)', value: session.kwh },
              { label: 'Total Cost', value: money(session.total_cost) },
            ]} />
            {session.faulty_reason?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-surface-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fault Reasons</p>
                <div className="flex flex-wrap gap-1.5">
                  {session.faulty_reason.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-xs rounded-md border border-rose-400/20">{r}</span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Booking */}
          {session.booking && (
            <Card title="Booking">
              <InfoGrid items={Object.entries(session.booking)
                .filter(([k]) => !k.startsWith('_') && k !== '__v')
                .map(([k, v]) => ({ label: k, value: typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—') }))
              } />
            </Card>
          )}

          {/* CDR */}
          {session.cdr && (
            <Card title="Charge Detail Record">
              <InfoGrid items={[
                { label: 'CDR ID', value: session.cdr.cdr_id },
                { label: 'kWh', value: session.cdr.kwh },
                { label: 'Total Cost', value: money(session.cdr.total_cost) },
                { label: 'Generated', value: fmt(session.cdr.generated_at) },
                { label: 'Started', value: fmt(session.cdr.started_at) },
                { label: 'Ended', value: fmt(session.cdr.ended_at) },
              ]} />
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer */}
          {session.customer && (
            <Card title="Customer">
              <InfoGrid items={[
                { label: 'Name', value: session.customer.name },
                { label: 'Email', value: session.customer.email },
                { label: 'Phone', value: session.customer.phone },
              ]} />
            </Card>
          )}

          {/* Party & Tenant */}
          {session.party && (
            <Card title="Party">
              <InfoGrid items={[
                { label: 'Name', value: session.party.name },
                { label: 'Country', value: session.party.country },
                { label: 'Party ID', value: session.party.party_id },
                { label: 'Role', value: session.party.role },
              ]} />
            </Card>
          )}
          {session.tenant && (
            <Card title="Tenant">
              <InfoGrid items={[
                { label: 'Name', value: session.tenant.name },
                { label: 'Domain', value: session.tenant.domain },
              ]} />
            </Card>
          )}

          {/* Invoice */}
          {session.invoice && (
            <Card title="Invoice">
              <InfoGrid items={[
                { label: 'Invoice No.', value: session.invoice.invoice_number },
                { label: 'Amount', value: money(session.invoice.amount) },
                { label: 'kWh', value: session.invoice.kwh },
                { label: 'Status', value: session.invoice.status },
                { label: 'Generated', value: fmt(session.invoice.generated_at) },
              ]} />
            </Card>
          )}

          {/* Timeline */}
          {session.history?.length > 0 && (
            <Card title="History">
              <div>
                {[...session.history]
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((entry, i) => (
                    <TimelineEntry key={i} entry={entry} />
                  ))
                }
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
