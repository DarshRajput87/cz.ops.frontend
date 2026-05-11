import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, Badge } from '../../../components/ui'
import { TIER_PALETTE } from '../../../theme/tokens'

function computeTier(kwh = 0) {
  if (kwh >= 3000) return 'PLATINUM'
  if (kwh >= 1000) return 'GOLD'
  if (kwh >= 200)  return 'SILVER'
  return 'BRONZE'
}

const SearchIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
  </svg>
)

const PhoneIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
)

export default function CustomerSearchBox({ mobile, onChange, onSearch, loading, customer, error }) {
  function handleKey(e) { if (e.key === 'Enter') onSearch() }
  const tier = customer ? computeTier(customer.total_kwh ?? 0) : null
  const tierStyle = tier ? TIER_PALETTE[tier] : null

  return (
    <div className="space-y-4">
      <div className="flex gap-2.5">
        <div className="flex-1">
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={mobile}
            onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
            onKeyDown={handleKey}
            placeholder="Enter 10-digit mobile number"
            iconLeft={PhoneIcon}
            error={error}
          />
        </div>
        <Button
          onClick={onSearch}
          loading={loading}
          disabled={mobile.length !== 10}
          iconLeft={!loading && SearchIcon}
          size="md"
        >
          Search
        </Button>
      </div>

      <AnimatePresence>
        {customer && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-surface-sunken border border-border p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold text-body flex-shrink-0">
                  {(customer.customer_name || 'C')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-body font-semibold text-text-primary truncate">{customer.customer_name || '—'}</p>
                  <p className="text-caption text-text-tertiary truncate">{customer.email || '—'}</p>
                </div>
              </div>
              {tier && (
                <span
                  className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded uppercase"
                  style={{ color: tierStyle.fg, backgroundColor: tierStyle.bg }}
                >
                  {tier}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Stat label="Wallet"      value={`₹${(customer.wallet_balance ?? 0).toFixed(2)}`} />
              <Stat label="ChargeCoins" value={customer.chargecoins_balance ?? 0} />
              <Stat label="KYC"         value={customer.kyc_status || 'PENDING'} kyc={customer.kyc_status} />
            </div>

            {customer.vehicles?.length > 0 && (
              <div>
                <p className="text-overline uppercase text-text-tertiary mb-1.5">Vehicles</p>
                <div className="flex flex-wrap gap-1.5">
                  {customer.vehicles.map(v => (
                    <Badge key={v._id} variant="neutral" size="sm">
                      {v.vehicle_no}{v.vehicle_brand ? ` · ${v.vehicle_brand}` : ''}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ label, value, kyc }) {
  const kycColor = kyc === 'VERIFIED' ? 'text-success' : kyc === 'REJECTED' ? 'text-danger' : 'text-warning'
  return (
    <div className="rounded-md bg-surface-elevated border border-border px-3 py-2">
      <p className="text-overline uppercase text-text-tertiary mb-0.5">{label}</p>
      <p className={`text-caption font-semibold truncate ${kyc ? kycColor : 'text-text-primary'}`}>{value}</p>
    </div>
  )
}
