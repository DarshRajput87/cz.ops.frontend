import { motion } from 'framer-motion'
import { Users, UserCheck, UserX, Wallet, Coins, Zap } from 'lucide-react'

const CARDS = [
  {
    key:      'total_customers',
    label:    'Total Customers',
    icon:     Users,
    gradient: 'from-cyan-600/20 to-cyan-500/5',
    border:   'border-cyan-500/20',
    top:      'from-cyan-500 to-blue-400',
    iconBg:   'bg-cyan-500/10',
    iconColor:'text-cyan-400',
    fmt:      (v) => v.toLocaleString(),
  },
  {
    key:      'active_customers',
    label:    'Active',
    icon:     UserCheck,
    gradient: 'from-emerald-600/20 to-emerald-500/5',
    border:   'border-emerald-500/20',
    top:      'from-emerald-500 to-teal-400',
    iconBg:   'bg-emerald-500/10',
    iconColor:'text-emerald-400',
    fmt:      (v) => v.toLocaleString(),
  },
  {
    key:      'deleted_customers',
    label:    'Deleted',
    icon:     UserX,
    gradient: 'from-red-600/20 to-red-500/5',
    border:   'border-red-500/20',
    top:      'from-red-500 to-orange-400',
    iconBg:   'bg-red-500/10',
    iconColor:'text-red-400',
    fmt:      (v) => v.toLocaleString(),
  },
  {
    key:      'total_wallet_balance',
    label:    'Wallet Balance',
    icon:     Wallet,
    gradient: 'from-violet-600/20 to-violet-500/5',
    border:   'border-violet-500/20',
    top:      'from-violet-500 to-purple-400',
    iconBg:   'bg-violet-500/10',
    iconColor:'text-violet-400',
    fmt:      (v) => `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
  },
  {
    key:      'total_chargecoins',
    label:    'ChargeCoins',
    icon:     Coins,
    gradient: 'from-amber-600/20 to-amber-500/5',
    border:   'border-amber-500/20',
    top:      'from-amber-500 to-yellow-400',
    iconBg:   'bg-amber-500/10',
    iconColor:'text-amber-400',
    fmt:      (v) => v.toLocaleString(),
  },
  {
    key:      'total_kwh',
    label:    'Total kWh',
    icon:     Zap,
    gradient: 'from-blue-600/20 to-blue-500/5',
    border:   'border-blue-500/20',
    top:      'from-blue-500 to-cyan-400',
    iconBg:   'bg-blue-500/10',
    iconColor:'text-blue-400',
    fmt:      (v) => `${v.toLocaleString('en-IN', { minimumFractionDigits: 1 })} kWh`,
  },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.38, delay: i * 0.06, ease: 'easeOut' } }),
}

export default function CustomerStatsCards({ kpis, loading }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
      {CARDS.map((card, i) => {
        const Icon  = card.icon
        const value = kpis?.[card.key] ?? 0

        return (
          <motion.div
            key={card.key}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.border} p-5`}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.top}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">{card.label}</p>
                {loading ? (
                  <div className="h-7 w-24 rounded-lg bg-slate-700/60 animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {card.fmt(value)}
                  </p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
