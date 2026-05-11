import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import DashboardLayout from '../../layouts/DashboardLayout'
import logo from '../../assets/Logo.png'

const API = import.meta.env.VITE_API_URL || '/api'

const STATS_CONFIG = [
  {
    key: 'activeChargers',
    label: 'Active Chargers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'text-brand-accent',
    bg: 'bg-brand-accent/10',
    suffix: '',
  },
  {
    key: 'bookingsToday',
    label: 'Bookings Today',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    suffix: '',
  },
  {
    key: 'energyDelivered',
    label: 'Energy Delivered',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    suffix: ' kWh',
  },
  {
    key: 'networkUptime',
    label: 'Network Uptime',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    suffix: '%',
  },
]

function WelcomeOverlay({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1400)
    const t2 = setTimeout(() => onDone(), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-3 z-50 transition-opacity duration-500"
      style={{
        background: 'linear-gradient(135deg, #050a1a 0%, #0c1222 100%)',
        opacity: fading ? 0 : 1,
      }}
    >
      <img src={logo} alt="ChargeZone Operations" className="h-28 w-auto object-contain mb-2 animate-fade-in" />
      <h1
        className="text-3xl sm:text-4xl font-bold text-white tracking-tight opacity-0 animate-fade-up"
        style={{ animationFillMode: 'forwards' }}
      >
        Welcome to ChargeZone Operations ⚡
      </h1>
      <p
        className="text-slate-400 text-base opacity-0 animate-fade-up-d"
        style={{ animationFillMode: 'forwards' }}
      >
        Your EV network is ready
      </p>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-900 border border-surface-700 p-3 rounded-xl shadow-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}% Uptime</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(() => {
    const shouldShow = sessionStorage.getItem('cn_show_welcome') === '1'
    console.log('[Dashboard] cn_show_welcome =', sessionStorage.getItem('cn_show_welcome'), '| showWelcome =', shouldShow)
    if (shouldShow) sessionStorage.removeItem('cn_show_welcome')
    return shouldShow
  })

  const [stats, setStats] = useState({
    activeChargers: 0,
    bookingsToday: 0,
    energyDelivered: 0,
    networkUptime: 0,
    recentBookings: [],
    uptimeHistory: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await axios.get(`${API}/dashboard/stats`)
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const chartData = stats.uptimeHistory.map(d => ({
    name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    uptime: d.uptimePercentage,
  }))

  const relevantBookings = (stats.recentBookings || [])
    .filter(b => ['active', 'completed'].includes(b.status))
    .sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1
      if (a.status !== 'active' && b.status === 'active') return 1
      return new Date(b.booking_start) - new Date(a.booking_start)
    })

  return (
    <>
      {showWelcome && <WelcomeOverlay onDone={() => setShowWelcome(false)} />}

      <DashboardLayout>
        {/* Header row */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {STATS_CONFIG.map(s => (
            <div key={s.label} className="bg-surface-900 border border-surface-800 rounded-2xl p-6 hover:border-surface-700 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {s.icon}
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
              </div>
              <p className="text-3xl font-black text-white tracking-tight">
                {loading ? '—' : (stats[s.key]?.toLocaleString() || '0') + s.suffix}
              </p>
              <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Content panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-900 border border-surface-800 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white">Network Activity</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">System uptime over the last 7 days</p>
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-surface-800 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-surface-700">Real-time</span>
            </div>
            
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-surface-800 rounded-3xl">
                   <div className="animate-pulse flex flex-col items-center">
                     <div className="w-12 h-12 bg-surface-800 rounded-full mb-3"></div>
                     <div className="h-4 w-32 bg-surface-800 rounded"></div>
                   </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                      domain={[90, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="uptime" 
                      stroke="#00AEEF" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorUptime)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <button 
                onClick={() => navigate('/sessions')}
                className="text-xs font-black text-brand-accent hover:brightness-110 uppercase tracking-widest"
              >
                View all
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-800 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-surface-800 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-surface-800 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : relevantBookings.length > 0 ? (
                <div className="space-y-6">
                  {relevantBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center gap-4 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        booking.status === 'active'
                          ? 'bg-brand-accent/10 text-brand-accent animate-pulse'
                          : 'bg-surface-800 text-slate-400'
                      }`}>
                        {booking.status === 'active' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-white truncate group-hover:text-brand-accent transition-colors">
                            {booking.charger_id?.charger_code || 'Unknown Charger'}
                          </p>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                            booking.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {booking.status === 'active' ? 'Active' : 'Completed'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {booking.status === 'active'
                            ? `Charging • ${booking.estimated_units} kWh`
                            : `${booking.estimated_units} kWh • ${booking.booking_stop ? new Date(booking.booking_stop).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                   <div className="w-16 h-16 rounded-3xl bg-surface-800 text-slate-600 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-white mb-2">No activity records</p>
                  <p className="text-sm text-slate-500 font-medium">Charging sessions will appear here soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}


