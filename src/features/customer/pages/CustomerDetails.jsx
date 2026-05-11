import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Wallet, Coins, Zap, Receipt, Car,
  Activity, Clock, User, Shield, CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import BookingsTable from '../components/BookingsTable'
import VehicleTable from '../components/VehicleTable'
import WalletTransactionsTable from '../components/WalletTransactionsTable'
import ChargeCoinsTable from '../components/ChargeCoinsTable'
import SessionActivityTimeline from '../components/SessionActivityTimeline'
import {
  useCustomerDetail,
  useCustomerBookings,
  useCustomerVehicles,
  useCustomerWalletTransactions,
  useCustomerChargeCoins,
  useCustomerSessionHistory,
} from '../hooks/useCustomerDetails'

// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_COLOR = {
  BRONZE:   { text: 'text-amber-700',    bg: 'bg-amber-700/10',   border: 'border-amber-700/30'   },
  SILVER:   { text: 'text-slate-300',    bg: 'bg-slate-300/10',   border: 'border-slate-300/20'   },
  GOLD:     { text: 'text-yellow-400',   bg: 'bg-yellow-400/10',  border: 'border-yellow-400/30'  },
  PLATINUM: { text: 'text-cyan-300',     bg: 'bg-cyan-300/10',    border: 'border-cyan-300/30'    },
}

const KYC_META = {
  VERIFIED: { icon: CheckCircle2, color: 'text-emerald-400' },
  PENDING:  { icon: AlertCircle,  color: 'text-amber-400'   },
  REJECTED: { icon: XCircle,      color: 'text-red-400'     },
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ icon: Icon, label, value, color = 'text-white' }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'vehicles',    label: 'Vehicles',    icon: Car      },
  { key: 'bookings',    label: 'Bookings',    icon: Receipt  },
  { key: 'wallet',      label: 'Wallet',      icon: Wallet   },
  { key: 'chargecoins', label: 'ChargeCoins', icon: Coins    },
  { key: 'activity',   label: 'Activity',    icon: Activity },
]

// ─── Tab content ──────────────────────────────────────────────────────────────

function TabContent({ activeTab, id }) {
  const bookings   = useCustomerBookings(id)
  const vehicles   = useCustomerVehicles(id)
  const wallet     = useCustomerWalletTransactions(id)
  const coins      = useCustomerChargeCoins(id)
  const history    = useCustomerSessionHistory(id)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'vehicles' && (
          <VehicleTable
            rows={vehicles.rows} loading={vehicles.loading}
            hasMore={vehicles.hasMore} onLoadMore={vehicles.loadMore} total={vehicles.total}
          />
        )}
        {activeTab === 'bookings' && (
          <BookingsTable
            rows={bookings.rows} loading={bookings.loading}
            hasMore={bookings.hasMore} onLoadMore={bookings.loadMore} total={bookings.total}
          />
        )}
        {activeTab === 'wallet' && (
          <WalletTransactionsTable
            rows={wallet.rows} loading={wallet.loading}
            hasMore={wallet.hasMore} onLoadMore={wallet.loadMore} total={wallet.total}
          />
        )}
        {activeTab === 'chargecoins' && (
          <ChargeCoinsTable
            rows={coins.rows} loading={coins.loading}
            hasMore={coins.hasMore} onLoadMore={coins.loadMore} total={coins.total}
          />
        )}
        {activeTab === 'activity' && (
          <SessionActivityTimeline
            rows={history.rows} loading={history.loading}
            hasMore={history.hasMore} onLoadMore={history.loadMore} total={history.total}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomerDetails() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [tab, setTab] = useState('vehicles')

  const { data: customer, loading, error } = useCustomerDetail(id)

  const tier    = customer?.tier ?? 'BRONZE'
  const tierCfg = TIER_COLOR[tier] ?? TIER_COLOR.BRONZE
  const kycMeta = KYC_META[customer?.kyc_status] ?? KYC_META.PENDING
  const KycIcon = kycMeta.icon

  return (
    <DashboardLayout>
      <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/customers/list')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Customers
          </button>
          <span className="text-slate-700">/</span>
          <span className="text-white font-medium">{customer?.customer_name || id}</span>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Profile header */}
        {loading ? (
          <div className="h-24 rounded-2xl bg-slate-800/40 animate-pulse" />
        ) : customer ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-5"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent text-xl font-bold flex-shrink-0">
                {(customer.customer_name || customer.email || '?')[0].toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold text-white">{customer.customer_name || '—'}</h2>
                  {/* Tier badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tierCfg.text} ${tierCfg.bg} ${tierCfg.border}`}>
                    {tier}
                  </span>
                  {/* KYC */}
                  <span className={`flex items-center gap-1 text-xs font-medium ${kycMeta.color}`}>
                    <KycIcon className="w-3.5 h-3.5" />
                    {customer.kyc_status}
                  </span>
                  {/* Status */}
                  <span className={`text-xs font-medium ${customer.is_deleted ? 'text-red-400' : customer.is_active ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {customer.is_deleted ? '● Deleted' : customer.is_active ? '● Active' : '● Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                  {customer.mobile && <span className="font-mono">{customer.mobile}</span>}
                  {customer.email  && <span>{customer.email}</span>}
                  {customer.preferred_connector && (
                    <span className="text-brand-accent">{customer.preferred_connector}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Summary cards */}
        {customer && (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            <SummaryCard icon={Wallet} label="Wallet"   value={`₹${(customer.wallet_balance ?? 0).toFixed(2)}`}   color="text-violet-400" />
            <SummaryCard icon={Coins}  label="Coins"    value={(customer.chargecoins ?? 0).toLocaleString()}        color="text-amber-400"  />
            <SummaryCard icon={Activity} label="Sessions" value={(customer.total_sessions ?? 0).toLocaleString()}   color="text-cyan-400"   />
            <SummaryCard icon={Zap}    label="kWh"      value={`${(customer.total_kwh_consumed ?? 0).toFixed(1)}`} color="text-blue-400"   />
            <SummaryCard icon={Receipt} label="Spent"   value={`₹${(customer.total_spent ?? 0).toFixed(2)}`}       color="text-emerald-400"/>
            <SummaryCard icon={User}   label="Tier"     value={customer.tier ?? 'BRONZE'}                           color={tierCfg.text}   />
          </div>
        )}

        {/* Tabs */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-700/50 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${tab === key
                    ? 'border-brand-accent text-brand-accent bg-brand-accent/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5">
            {customer && <TabContent activeTab={tab} id={id} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
