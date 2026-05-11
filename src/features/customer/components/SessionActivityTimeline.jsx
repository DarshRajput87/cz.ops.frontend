import { motion } from 'framer-motion'
import { Loader2, Zap, Play, Square, Pause, AlertTriangle, CheckCircle2, Circle } from 'lucide-react'

const EVENT_META = {
  SESSION_STARTED:  { icon: Play,          color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  SESSION_STOPPED:  { icon: Square,         color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/30'     },
  CHARGING:         { icon: Zap,            color: 'text-brand-accent', bg: 'bg-cyan-400/10',   border: 'border-cyan-400/30'    },
  PAUSED:           { icon: Pause,          color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30'   },
  COMPLETED:        { icon: CheckCircle2,   color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  ERROR:            { icon: AlertTriangle,  color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/30'     },
}

function getEventMeta(type) {
  return EVENT_META[type] ?? { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-700/30', border: 'border-slate-700' }
}

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function TimelineItem({ event, index }) {
  const meta  = getEventMeta(event.event_type)
  const Icon  = meta.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index, 15) * 0.04, duration: 0.3 }}
      className="flex gap-4 group"
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${meta.bg} ${meta.border}`}>
          <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
        </div>
        <div className="w-px flex-1 bg-slate-700/40 mt-1" />
      </div>

      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-xs font-semibold ${meta.color}`}>{event.event_type || 'EVENT'}</p>
            {event.session_id && (
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Session: {event.session_id}</p>
            )}
            {event.metadata && Object.keys(event.metadata).length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-2">
                {Object.entries(event.metadata).slice(0, 4).map(([k, v]) => (
                  <span key={k} className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md font-mono">
                    {k}: {String(v)}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500 whitespace-nowrap">{fmt(event.timestamp || event.createdAt)}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function SessionActivityTimeline({ rows, loading, hasMore, onLoadMore, total }) {
  return (
    <div>
      <div className="space-y-0">
        {loading && !rows.length && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
            <p className="text-sm text-slate-500">Loading activity…</p>
          </div>
        )}
        {rows.map((event, i) => (
          <TimelineItem key={event._id || i} event={event} index={i} />
        ))}
        {!loading && !rows.length && (
          <div className="py-12 text-center">
            <p className="text-slate-500 text-sm">No session activity found</p>
          </div>
        )}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="mt-2 flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Load more events ({rows.length} / {total})
        </button>
      )}
    </div>
  )
}
