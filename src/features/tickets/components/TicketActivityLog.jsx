import { motion } from 'framer-motion'
import { CheckCircle2, UserCheck, RefreshCw, Lock, PlusCircle, AlertTriangle } from 'lucide-react'

const ACTION_META = {
  CREATED:        { label: 'Ticket created',  Icon: PlusCircle,   color: '#00AEEF', bg: 'rgba(0,174,239,0.1)',    border: 'rgba(0,174,239,0.2)' },
  ASSIGNED:       { label: 'Assigned',        Icon: UserCheck,    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.2)' },
  STATUS_CHANGED: { label: 'Status changed',  Icon: RefreshCw,    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.2)' },
  RESOLVED:       { label: 'Resolved',        Icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.2)' },
  CLOSED:         { label: 'Closed',          Icon: Lock,         color: '#64748b', bg: 'rgba(100,116,139,0.1)',  border: 'rgba(100,116,139,0.2)' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Detail({ action, metadata }) {
  if (action === 'STATUS_CHANGED' && metadata?.from && metadata?.to) {
    return (
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
        <span className="text-slate-400 font-medium">{metadata.from.replace('_', ' ')}</span>
        <span className="text-slate-600">→</span>
        <span className="text-slate-300 font-medium">{metadata.to.replace('_', ' ')}</span>
        {metadata.note && <span className="text-slate-600 italic ml-1">"{metadata.note}"</span>}
      </p>
    )
  }
  if (action === 'RESOLVED' && metadata?.resolution_note) {
    return <p className="text-xs text-slate-500 mt-1 italic line-clamp-2">"{metadata.resolution_note}"</p>
  }
  return null
}

export default function TicketActivityLog({ activities = [] }) {
  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <AlertTriangle size={20} className="text-slate-700" />
        <p className="text-xs text-slate-600">No activity recorded yet</p>
      </div>
    )
  }

  return (
    <ol className="relative flex flex-col">
      {activities.map((activity, idx) => {
        const meta   = ACTION_META[activity.action] ?? { label: activity.action, Icon: RefreshCw, color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' }
        const isLast = idx === activities.length - 1
        const { Icon } = meta

        return (
          <motion.li
            key={activity._id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="relative flex gap-3.5 pb-5 last:pb-0"
          >
            {!isLast && (
              <div className="absolute left-[14px] top-8 bottom-0 w-px bg-gradient-to-b from-surface-700 to-transparent" />
            )}

            <div
              className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center z-10 ring-1"
              style={{ background: meta.bg, borderColor: meta.border, border: `1px solid ${meta.border}` }}
            >
              <Icon size={13} style={{ color: meta.color }} />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold" style={{ color: meta.color }}>{meta.label}</p>
                <span className="text-[10px] text-slate-600 whitespace-nowrap flex-shrink-0 font-mono">
                  {timeAgo(activity.createdAt)}
                </span>
              </div>
              <Detail action={activity.action} metadata={activity.metadata} />
              {activity.performed_by?.name && (
                <p className="text-[10px] text-slate-600 mt-1">by <span className="text-slate-500">{activity.performed_by.name}</span></p>
              )}
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
