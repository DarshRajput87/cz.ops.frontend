import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, Sparkles, Star, TicketCheck, AlertCircle } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import api from '../services/ticket.api'

const STATUS_META = {
  pending:        { label: 'Pending',        color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/20' },
  processing:     { label: 'Processing',     color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  analyzed:       { label: 'Analyzed',       color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
  ticket_created: { label: 'Ticket Created', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ignored:        { label: 'Ignored',        color: 'text-slate-500',   bg: 'bg-slate-700/20',   border: 'border-slate-700/30' },
  failed:         { label: 'Failed',         color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
}

const PRIORITY_COLOR = {
  URGENT: 'text-red-400',
  HIGH:   'text-orange-400',
  MEDIUM: 'text-yellow-400',
  LOW:    'text-slate-400',
}

const SOURCE_LABELS = { APP: 'App', PLAYSTORE: 'Play Store', APPSTORE: 'App Store', EMAIL: 'Email' }

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold
                      border ${m.color} ${m.bg} ${m.border}`}>
      {m.label}
    </span>
  )
}

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={11}
          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700 fill-slate-700'} />
      ))}
    </div>
  )
}

function StatCard({ label, value, color = 'text-white' }) {
  return (
    <div className="bg-surface-900/80 border border-surface-700/60 rounded-2xl px-5 py-4">
      <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? 0}</p>
    </div>
  )
}

const STATUS_FILTERS = ['all', 'pending', 'analyzed', 'ticket_created', 'failed']

export default function CustomerReviews() {
  const [reviews,    setReviews]    = useState([])
  const [stats,      setStats]      = useState({})
  const [loading,    setLoading]    = useState(true)
  const [processing, setProcessing] = useState(false)
  const [processResult, setProcessResult] = useState(null)
  const [filter,     setFilter]     = useState('all')
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [rRes, sRes] = await Promise.all([
        api.reviews.list({ status: filter === 'all' ? undefined : filter, page, limit: 20 }),
        api.reviews.stats(),
      ])
      setReviews(rRes.data.data ?? [])
      setTotalPages(rRes.data.totalPages ?? 1)
      setStats(sRes.data.data ?? {})
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [filter, page])

  useEffect(() => { load() }, [load])

  const handleProcess = async () => {
    setProcessing(true)
    setProcessResult(null)
    try {
      const res = await api.reviews.process()
      setProcessResult(res.data.data)
      await load()
    } catch {
      setProcessResult({ error: 'Processing failed' })
    } finally {
      setProcessing(false)
    }
  }

  const total = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">Customer Reviews</h1>
            <p className="text-[11px] text-slate-500 mt-0.5">AI-powered analysis — reviews become tickets automatically</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={loading}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-surface-700/60
                               text-slate-500 hover:text-white hover:border-surface-600 hover:bg-surface-800 transition-all disabled:opacity-40">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={handleProcess} disabled={processing || loading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                               bg-brand-accent text-white hover:opacity-90 transition-all
                               disabled:opacity-40 disabled:cursor-not-allowed">
              {processing
                ? <Loader2 size={14} className="animate-spin" />
                : <Sparkles size={14} />
              }
              {processing ? 'Processing…' : 'Process Pending'}
            </button>
          </div>
        </motion.div>

        {/* Process result banner */}
        {processResult && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-medium
                                  ${processResult.error
                                    ? 'bg-red-500/8 border-red-500/20 text-red-400'
                                    : 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'}`}>
            {processResult.error
              ? <><AlertCircle size={13} /> {processResult.error}</>
              : <><TicketCheck size={13} /> Processed {processResult.processed} reviews — {processResult.ticketsCreated} tickets created</>
            }
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total"          value={total}                        color="text-white" />
          <StatCard label="Pending"        value={stats.pending}                color="text-slate-400" />
          <StatCard label="Ticket Created" value={stats.ticket_created}         color="text-emerald-400" />
          <StatCard label="Failed"         value={stats.failed}                 color="text-red-400" />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button key={s} onClick={() => { setFilter(s); setPage(1) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                      ${filter === s
                        ? 'bg-[#00AEEF]/10 border-[#00AEEF]/30 text-[#00AEEF]'
                        : 'bg-surface-800/40 border-surface-700/40 text-slate-500 hover:text-slate-300 hover:border-surface-600'
                      }`}>
              {s === 'all' ? 'All' : STATUS_META[s]?.label ?? s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface-900/80 border border-surface-700/60 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-600">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-600">
              <Star size={24} className="opacity-30" />
              <p className="text-sm">No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-surface-700/50">
                    {['Source', 'Title', 'Rating', 'Type', 'Sentiment', 'Priority', 'Status', 'Ticket'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/60">
                  {reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-surface-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{SOURCE_LABELS[r.source] ?? r.source}</td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="text-slate-300 truncate font-medium">{r.review_title}</p>
                        <p className="text-slate-600 truncate mt-0.5">{r.review_message}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><RatingStars rating={r.rating} /></td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.review_type}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-medium capitalize
                          ${r.ai_analysis?.sentiment === 'negative' ? 'text-red-400'
                          : r.ai_analysis?.sentiment === 'positive' ? 'text-emerald-400'
                          : 'text-slate-400'}`}>
                          {r.ai_analysis?.sentiment ?? r.sentiment ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`font-semibold ${PRIORITY_COLOR[r.ai_analysis?.priority] ?? 'text-slate-500'}`}>
                          {r.ai_analysis?.priority ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.related_ticket_id
                          ? <span className="text-[#00AEEF] font-mono text-[10px]">Linked</span>
                          : <span className="text-slate-700">—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 text-xs rounded-lg border border-surface-700/60 text-slate-500
                               hover:text-white hover:border-surface-600 disabled:opacity-30 transition-all">
              Prev
            </button>
            <span className="text-xs text-slate-500">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg border border-surface-700/60 text-slate-500
                               hover:text-white hover:border-surface-600 disabled:opacity-30 transition-all">
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
