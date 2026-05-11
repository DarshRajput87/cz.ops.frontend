import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, List } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import CustomerStatsCards from '../components/CustomerStatsCards'
import CustomerTimelineChart from '../components/CustomerTimelineChart'
import { useCustomerDashboard } from '../hooks/useCustomers'

const DAYS_OPTIONS = [7, 14, 30, 60, 90]

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [days, setDays] = useState(30)
  const { data, loading, error } = useCustomerDashboard(days)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-white">Customers</h1>
            <p className="text-sm text-slate-400 mt-0.5">Platform-wide customer analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-slate-700/60 bg-slate-800/60 p-1">
              {DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors
                    ${days === d
                      ? 'bg-brand-accent text-white'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/customers/list')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-brand-accent text-white hover:opacity-90 transition-opacity"
            >
              <List className="w-4 h-4" />
              All Customers
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <CustomerStatsCards kpis={data?.kpis} loading={loading} />

        {/* Timeline Chart */}
        <CustomerTimelineChart timeline={data?.timeline} loading={loading} />
      </div>
    </DashboardLayout>
  )
}
