import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-sm px-4 py-3 text-xs shadow-2xl">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function CustomerTimelineChart({ timeline, loading }) {
  if (loading) {
    return (
      <div className="h-[300px] rounded-2xl bg-slate-800/40 animate-pulse border border-slate-700/50" />
    )
  }

  const data = (timeline ?? []).map((d) => ({
    date:    d.date,
    Added:   d.added,
    Deleted: d.deleted,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-5"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Customer Growth</h3>
          <p className="text-xs text-slate-500 mt-0.5">Added vs deleted over time</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
            tickFormatter={(d) => d.slice(5)}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#94a3b8', paddingTop: 12 }}
          />
          <Line
            type="monotone"
            dataKey="Added"
            stroke="#00AEEF"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00AEEF' }}
          />
          <Line
            type="monotone"
            dataKey="Deleted"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
