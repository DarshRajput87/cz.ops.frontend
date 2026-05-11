import { motion } from 'framer-motion'
import { TicketCheck, AlertTriangle, CheckCircle2, ShieldAlert, Timer, Activity } from 'lucide-react'
import { useTicketStats } from '../hooks/useTickets'

const CARDS = [
  { key: 'open',     label: 'Open',          Icon: TicketCheck,   getValue: (s) => (s.byStatus?.OPEN ?? 0) + (s.byStatus?.IN_PROGRESS ?? 0), top: 'from-blue-500 to-cyan-400',    iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400',    border: 'border-blue-500/15',    grad: 'from-blue-600/15 to-transparent' },
  { key: 'urgent',   label: 'Urgent',        Icon: AlertTriangle, getValue: (s) => s.byPriority?.URGENT ?? 0,  top: 'from-red-500 to-orange-400',   iconBg: 'bg-red-500/10',     iconColor: 'text-red-400',     border: 'border-red-500/15',     grad: 'from-red-600/15 to-transparent' },
  { key: 'resolved', label: 'Resolved (7d)', Icon: CheckCircle2,  getValue: (s) => s.resolvedLast7d ?? 0,      top: 'from-emerald-500 to-teal-400', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', border: 'border-emerald-500/15', grad: 'from-emerald-600/15 to-transparent' },
  { key: 'esc',      label: 'Escalated',     Icon: ShieldAlert,   getValue: (s) => s.escalated ?? 0,           top: 'from-orange-500 to-amber-400', iconBg: 'bg-orange-500/10', iconColor: 'text-orange-400',  border: 'border-orange-500/15',  grad: 'from-orange-600/15 to-transparent' },
  { key: 'avg',      label: 'Avg Resolution',Icon: Timer,         getValue: (s) => s.avgResolutionHours != null ? `${s.avgResolutionHours}h` : '—', top: 'from-[#00AEEF] to-blue-400', iconBg: 'bg-[#00AEEF]/10', iconColor: 'text-[#00AEEF]', border: 'border-[#00AEEF]/15', grad: 'from-[#00AEEF]/15 to-transparent' },
  { key: 'created',  label: 'Created (7d)',  Icon: Activity,      getValue: (s) => s.createdLast7d ?? 0,       top: 'from-violet-500 to-purple-400',iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400',  border: 'border-violet-500/15',  grad: 'from-violet-600/15 to-transparent' },
]

function SkeletonCard() {
  return (
    <div className="relative rounded-2xl border border-surface-700/50 bg-surface-900/60 p-5 overflow-hidden animate-pulse">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-surface-700 rounded-t-2xl" />
      <div className="w-8 h-8 rounded-xl bg-surface-700/60 mb-4" />
      <div className="h-7 w-14 bg-surface-700/60 rounded-lg mb-2" />
      <div className="h-3 w-20 bg-surface-700/40 rounded" />
    </div>
  )
}

export default function TicketStatsCards() {
  const { stats, loading } = useTicketStats()

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {CARDS.map((c) => <SkeletonCard key={c.key} />)}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {CARDS.map((card, i) => {
        const { Icon } = card
        const value = card.getValue(stats)
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className={`relative rounded-2xl border ${card.border} bg-gradient-to-br ${card.grad}
                        backdrop-blur-sm overflow-hidden shadow-lg cursor-default group`}
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.top}`} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <div className="p-5">
              <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center mb-4
                              ring-1 ring-white/5 group-hover:ring-white/10 transition-all`}>
                <Icon size={16} className={card.iconColor} />
              </div>
              <p className="text-2xl font-bold text-white tracking-tight leading-none">{value}</p>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium">{card.label}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
