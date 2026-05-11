import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TicketCheck, Plus, ArrowUpRight, AlertTriangle, Clock,
  CheckCircle2, TrendingUp, Zap, BarChart3, Users,
  ChevronRight, Circle, Timer, ShieldAlert, Activity,
} from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import TicketStatusBadge from '../components/TicketStatusBadge'
import TicketPriorityBadge from '../components/TicketPriorityBadge'
import { useTickets, useTicketStats } from '../hooks/useTickets'

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' } }),
}

const STATUS_META = {
  OPEN:        { color: '#3b82f6', glow: 'rgba(59,130,246,0.25)',  label: 'Open' },
  IN_PROGRESS: { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)',  label: 'In Progress' },
  ON_HOLD:     { color: '#64748b', glow: 'rgba(100,116,139,0.2)',  label: 'On Hold' },
  RESOLVED:    { color: '#10b981', glow: 'rgba(16,185,129,0.25)',  label: 'Resolved' },
  CLOSED:      { color: '#334155', glow: 'rgba(51,65,85,0.2)',     label: 'Closed' },
}

const PRIORITY_META = {
  URGENT: { color: '#ef4444', track: 'bg-red-500',    label: 'Urgent' },
  HIGH:   { color: '#f97316', track: 'bg-orange-500', label: 'High' },
  MEDIUM: { color: '#eab308', track: 'bg-yellow-500', label: 'Medium' },
  LOW:    { color: '#64748b', track: 'bg-slate-500',  label: 'Low' },
}

const KPI_CONFIG = [
  {
    key:      'open',
    label:    'Open Tickets',
    getValue: (s) => (s.byStatus?.OPEN ?? 0) + (s.byStatus?.IN_PROGRESS ?? 0),
    icon:     TicketCheck,
    gradient: 'from-blue-600/20 to-blue-500/5',
    border:   'border-blue-500/20',
    top:      'from-blue-500 to-cyan-400',
    iconBg:   'bg-blue-500/10',
    iconColor:'text-blue-400',
    glow:     'shadow-blue-500/10',
  },
  {
    key:      'urgent',
    label:    'Urgent',
    getValue: (s) => s.byPriority?.URGENT ?? 0,
    icon:     AlertTriangle,
    gradient: 'from-red-600/20 to-red-500/5',
    border:   'border-red-500/20',
    top:      'from-red-500 to-orange-400',
    iconBg:   'bg-red-500/10',
    iconColor:'text-red-400',
    glow:     'shadow-red-500/10',
  },
  {
    key:      'resolved',
    label:    'Resolved (7d)',
    getValue: (s) => s.resolvedLast7d ?? 0,
    icon:     CheckCircle2,
    gradient: 'from-emerald-600/20 to-emerald-500/5',
    border:   'border-emerald-500/20',
    top:      'from-emerald-500 to-teal-400',
    iconBg:   'bg-emerald-500/10',
    iconColor:'text-emerald-400',
    glow:     'shadow-emerald-500/10',
  },
  {
    key:      'escalated',
    label:    'Escalated',
    getValue: (s) => s.escalated ?? 0,
    icon:     ShieldAlert,
    gradient: 'from-orange-600/20 to-orange-500/5',
    border:   'border-orange-500/20',
    top:      'from-orange-500 to-amber-400',
    iconBg:   'bg-orange-500/10',
    iconColor:'text-orange-400',
    glow:     'shadow-orange-500/10',
  },
  {
    key:      'avg',
    label:    'Avg Resolution',
    getValue: (s) => s.avgResolutionHours != null ? `${s.avgResolutionHours}h` : '—',
    icon:     Timer,
    gradient: 'from-[#00AEEF]/20 to-[#00AEEF]/5',
    border:   'border-[#00AEEF]/20',
    top:      'from-[#00AEEF] to-blue-400',
    iconBg:   'bg-[#00AEEF]/10',
    iconColor:'text-[#00AEEF]',
    glow:     'shadow-[#00AEEF]/10',
  },
  {
    key:      'created',
    label:    'Created (7d)',
    getValue: (s) => s.createdLast7d ?? 0,
    icon:     Activity,
    gradient: 'from-violet-600/20 to-violet-500/5',
    border:   'border-violet-500/20',
    top:      'from-violet-500 to-purple-400',
    iconBg:   'bg-violet-500/10',
    iconColor:'text-violet-400',
    glow:     'shadow-violet-500/10',
  },
]

function KpiCard({ cfg, stats, index }) {
  const Icon  = cfg.icon
  const value = stats ? cfg.getValue(stats) : null

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border ${cfg.border} bg-gradient-to-br ${cfg.gradient}
                  backdrop-blur-sm shadow-xl ${cfg.glow} cursor-default group`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.top} opacity-80`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-9 h-9 rounded-xl ${cfg.iconBg} flex items-center justify-center
                          ring-1 ring-white/5 group-hover:ring-white/10 transition-all`}>
            <Icon className={`w-4.5 h-4.5 ${cfg.iconColor}`} size={18} />
          </div>
          <TrendingUp size={12} className="text-slate-600 group-hover:text-slate-500 transition-colors mt-1" />
        </div>

        {value === null ? (
          <div className="space-y-2">
            <div className="h-7 w-16 bg-surface-700/60 rounded-lg animate-pulse" />
            <div className="h-3 w-20 bg-surface-700/40 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-white tracking-tight leading-none">{value}</p>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">{cfg.label}</p>
          </>
        )}
      </div>
    </motion.div>
  )
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#00AEEF] to-blue-600" />
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#00AEEF] transition-colors"
        >
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

function StatusDonut({ stats }) {
  if (!stats?.byStatus) return <ChartSkeleton />

  const entries = Object.entries(stats.byStatus)
  const total   = entries.reduce((s, [, v]) => s + v, 0)
  if (total === 0) return <EmptyChart label="No status data" />

  let offset = 0
  const r    = 52
  const cx   = 70
  const cy   = 70
  const circ = 2 * Math.PI * r
  const gap  = 2

  const slices = entries.map(([status, count]) => {
    const pct   = (count / total) * 100
    const arc   = ((pct / 100) * circ) - gap
    const s     = { status, count, pct, offset, arc }
    offset += (pct / 100) * circ
    return s
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="16" />
            {slices.map(({ status, arc, offset: off }) => (
              <circle
                key={status}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={STATUS_META[status]?.color ?? '#475569'}
                strokeWidth="16"
                strokeDasharray={`${arc} ${circ}`}
                strokeDashoffset={-(off)}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ filter: `drop-shadow(0 0 6px ${STATUS_META[status]?.glow ?? 'transparent'})` }}
              />
            ))}
            <text x={cx} y={cy - 6}  textAnchor="middle" fill="white"   fontSize="20" fontWeight="700" fontFamily="Inter, sans-serif">{total}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="Inter, sans-serif">total</text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {slices.map(({ status, count, pct }) => (
          <div key={status} className="flex items-center gap-2.5 group">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: STATUS_META[status]?.color, boxShadow: `0 0 6px ${STATUS_META[status]?.glow}` }}
            />
            <span className="text-xs text-slate-400 flex-1 group-hover:text-slate-300 transition-colors">
              {STATUS_META[status]?.label ?? status}
            </span>
            <span className="text-xs font-semibold text-white">{count}</span>
            <span className="text-xs text-slate-600 w-8 text-right">{Math.round(pct)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PriorityBars({ stats }) {
  if (!stats?.byPriority) return <ChartSkeleton />

  const total = Object.values(stats.byPriority).reduce((s, v) => s + v, 0)
  if (total === 0) return <EmptyChart label="No priority data" />

  return (
    <div className="flex flex-col gap-3.5">
      {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((p) => {
        const count = stats.byPriority[p] ?? 0
        const pct   = total > 0 ? (count / total) * 100 : 0
        const meta  = PRIORITY_META[p]

        return (
          <div key={p} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                <span className="text-xs font-medium text-slate-400">{meta.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{count}</span>
                <span className="text-xs text-slate-600 w-7 text-right">{Math.round(pct)}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-surface-700/80 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${meta.track}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                style={{ boxShadow: `0 0 8px ${meta.color}55` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DeptBars({ stats }) {
  if (!stats?.byDepartment) return <ChartSkeleton />

  const entries = Object.entries(stats.byDepartment).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) return <EmptyChart label="No department data" />

  const max = entries[0][1]

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([dept, count], i) => {
        const pct = max > 0 ? (count / max) * 100 : 0
        return (
          <div key={dept} className="flex items-center gap-3 group">
            <span className="text-xs text-slate-500 w-20 flex-shrink-0 truncate group-hover:text-slate-400 transition-colors">
              {dept}
            </span>
            <div className="flex-1 h-1.5 bg-surface-700/80 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00AEEF] to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 + i * 0.05 }}
                style={{ boxShadow: '0 0 8px rgba(0,174,239,0.4)' }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-300 w-5 text-right">{count}</span>
          </div>
        )
      })}
    </div>
  )
}

function ChartCard({ title, icon: Icon, children, index = 0 }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative bg-surface-900/80 backdrop-blur-sm border border-surface-700/60
                 rounded-2xl overflow-hidden shadow-xl shadow-black/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="px-5 py-4 border-b border-surface-700/60 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-[#00AEEF]/10 flex items-center justify-center">
          <Icon size={13} className="text-[#00AEEF]" />
        </div>
        <h3 className="text-xs font-semibold text-slate-300 tracking-wide">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {[80, 60, 90, 45, 70].map((w, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 bg-surface-700 rounded w-16" />
          <div className="flex-1 h-1.5 bg-surface-700 rounded-full" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  )
}

function EmptyChart({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <BarChart3 size={24} className="text-slate-700" />
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  )
}

function RecentTickets() {
  const navigate = useNavigate()
  const { tickets, loading } = useTickets({ sort_by: 'createdAt', sort_dir: 'desc' })
  const recent = tickets.slice(0, 8)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={6}
      className="relative bg-surface-900/80 backdrop-blur-sm border border-surface-700/60
                 rounded-2xl overflow-hidden shadow-xl shadow-black/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      <div className="px-6 py-4 border-b border-surface-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#00AEEF]/10 flex items-center justify-center">
            <Clock size={13} className="text-[#00AEEF]" />
          </div>
          <h3 className="text-sm font-semibold text-white">Recent Tickets</h3>
          {!loading && recent.length > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-surface-700/80 text-slate-400 font-medium">
              {recent.length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate('/tickets/list')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#00AEEF] transition-colors font-medium"
        >
          View all <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-700/40 bg-surface-900/60 sticky top-0">
              {['Ticket ID', 'Title', 'Department', 'Priority', 'Status', 'Assigned'].map((h) => (
                <th key={h} className="px-6 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-surface-700/30">
                {[28, 0, 20, 16, 20, 24].map((w, j) => (
                  <td key={j} className="px-6 py-3.5">
                    <div className={`h-3 bg-surface-700/60 rounded animate-pulse ${w ? `w-${w}` : 'flex-1'}`}
                         style={w === 0 ? { width: '60%' } : {}} />
                  </td>
                ))}
              </tr>
            ))}

            {!loading && recent.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center">
                      <TicketCheck size={20} className="text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">No tickets yet</p>
                    <p className="text-xs text-slate-700">Create your first ticket to get started</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && recent.map((t, i) => (
              <motion.tr
                key={t._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/tickets/${t._id}`)}
                className="border-b border-surface-700/30 hover:bg-white/[0.02] cursor-pointer
                           transition-all duration-150 group"
              >
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <span className="font-mono text-xs text-[#00AEEF] group-hover:text-blue-300 transition-colors">
                    {t.ticket_id}
                  </span>
                </td>
                <td className="px-6 py-3.5 max-w-[220px]">
                  <p className="text-sm text-slate-300 truncate font-medium group-hover:text-white transition-colors">
                    {t.title}
                  </p>
                  {t.customer?.name && (
                    <p className="text-xs text-slate-600 truncate mt-0.5">{t.customer.name}</p>
                  )}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <span className="text-xs text-slate-500 bg-surface-800/80 border border-surface-700/50
                                   px-2.5 py-1 rounded-lg font-medium">
                    {t.department_tag}
                  </span>
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <TicketPriorityBadge priority={t.priority} />
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <TicketStatusBadge status={t.status} />
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  {t.assigned_to?.name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#00AEEF]/15 text-[#00AEEF] text-[10px]
                                      flex items-center justify-center font-bold flex-shrink-0 ring-1 ring-[#00AEEF]/20">
                        {t.assigned_to.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-400 truncate max-w-[80px]">{t.assigned_to.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-700 italic">Unassigned</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default function TicketDashboard() {
  const navigate          = useNavigate()
  const { stats, loading } = useTicketStats()

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-surface-950">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-8">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">Live</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Ticket Overview</h1>
              <p className="text-sm text-slate-500 mt-1">Real-time support operations dashboard</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/tickets/list')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400
                           border border-surface-700/80 rounded-xl hover:border-surface-600
                           hover:text-slate-200 hover:bg-surface-800/60 transition-all"
              >
                <BarChart3 size={14} />
                All Tickets
              </button>
              <button
                onClick={() => navigate('/tickets/create')}
                className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white text-sm font-semibold
                           rounded-xl hover:opacity-90 transition-all"
              >
                <Plus size={15} strokeWidth={2.5} />
                New Ticket
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {KPI_CONFIG.map((cfg, i) => (
              <KpiCard key={cfg.key} cfg={cfg} stats={stats} index={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <ChartCard title="Status Distribution" icon={Circle} index={3}>
              <StatusDonut stats={stats} />
            </ChartCard>
            <ChartCard title="Priority Breakdown" icon={Zap} index={4}>
              <PriorityBars stats={stats} />
            </ChartCard>
            <ChartCard title="By Department" icon={Users} index={5}>
              <DeptBars stats={stats} />
            </ChartCard>
          </div>

          <RecentTickets />

        </div>
      </div>
    </DashboardLayout>
  )
}
