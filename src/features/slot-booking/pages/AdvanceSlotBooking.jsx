import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { useSlotBooking } from '../hooks/useSlotBooking'
import { Card, PageHeader, Button, Alert, Input } from '../../../components/ui'
import CustomerSearchBox from '../components/CustomerSearchBox'
import StationSelector from '../components/StationSelector'
import ChargerSelector from '../components/ChargerSelector'
import ConnectorSelector from '../components/ConnectorSelector'
import SlotTimePicker from '../components/SlotTimePicker'
import AvailabilityCard from '../components/AvailabilityCard'

function Step({ n, title, hint, locked, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={locked ? 'opacity-50 pointer-events-none select-none' : ''}
    >
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-white/[0.015]">
          <span className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
            {n}
          </span>
          <div>
            <h3 className="text-h2 text-text-primary">{title}</h3>
            {hint && <p className="text-[11px] text-text-tertiary">{hint}</p>}
          </div>
        </div>
        <div className="p-5">{children}</div>
      </Card>
    </motion.div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-overline uppercase text-text-tertiary mb-0.5">{label}</p>
      <p className="text-caption text-text-primary font-medium truncate">{value}</p>
    </div>
  )
}

const BookingIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
)

export default function AdvanceSlotBooking() {
  const {
    form, patch, loading, error, clearError,
    stations, chargers,
    success, resetSuccess,
    handleSearchCustomer, loadStations, handleSelectStation,
    handleCheckAvailability, handleSubmit,
  } = useSlotBooking()

  useEffect(() => { if (form.customer) loadStations() }, [form.customer, loadStations])

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <PageHeader
          breadcrumbs={[{ label: 'Slot Booking' }, { label: 'New Booking' }]}
          title="Advance Slot Booking"
          description="Reserve a charging slot on behalf of a customer."
        />

        <div className="space-y-4">
          {error && <Alert variant="danger" onClose={clearError}>{error}</Alert>}

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
              >
                <Card padding="md" style={{ backgroundColor: 'rgba(47,163,107,0.08)', borderColor: 'rgba(47,163,107,0.30)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-body font-semibold text-success">Booking confirmed</p>
                      <p className="text-caption text-success/70">A confirmation SMS has been sent to the customer.</p>
                    </div>
                    <button onClick={resetSuccess} className="text-success/50 hover:text-success transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      ['Booking ID', success.booking_id],
                      ['Station',    success.station_name || '—'],
                      ['Charger',    success.charger_code || '—'],
                      ['Connector',  success.connector_label || success.connector_id || '—'],
                    ].map(([l, v]) => (
                      <div key={l} className="rounded-md px-3 py-2" style={{ backgroundColor: 'rgba(47,163,107,0.06)', border: '1px solid rgba(47,163,107,0.20)' }}>
                        <p className="text-overline uppercase text-success/60 mb-0.5">{l}</p>
                        <p className="text-caption font-semibold text-success truncate">{v}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Step n="1" title="Search Customer" hint="Look up the customer by registered mobile number">
            <CustomerSearchBox
              mobile={form.mobileInput}
              onChange={v => patch({ mobileInput: v })}
              onSearch={handleSearchCustomer}
              loading={loading.search}
              customer={form.customer}
              error={null}
            />
          </Step>

          <Step n="2" title="Select Station" locked={!form.customer}>
            <StationSelector
              stations={stations}
              selected={form.station}
              onSelect={handleSelectStation}
              onLoad={form.customer ? loadStations : () => {}}
              loading={loading.stations}
            />
          </Step>

          <Step n="3" title="Select Charger" locked={!form.station}>
            <ChargerSelector
              chargers={chargers}
              selected={form.charger}
              onSelect={c => patch({ charger: c, connector: null, availability: null })}
              loading={loading.chargers}
            />
          </Step>

          <Step n="4" title="Select Connector" hint="Choose the charging gun" locked={!form.charger}>
            <ConnectorSelector
              charger={form.charger}
              selected={form.connector}
              onSelect={c => patch({ connector: c, availability: null })}
            />
          </Step>

          <Step n="5" title="Select Vehicle" locked={!form.connector}>
            {form.customer?.vehicles?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.customer.vehicles.map(v => (
                  <button
                    key={v._id}
                    onClick={() => patch({ vehicle: v })}
                    className={`px-3.5 py-2 rounded-md border text-body transition-colors ${
                      form.vehicle?._id === v._id
                        ? 'bg-primary/10 border-primary/50 text-primary'
                        : 'bg-surface-sunken border-border text-text-secondary hover:border-border-strong'
                    }`}
                  >
                    <span className="font-semibold">{v.vehicle_no}</span>
                    {v.vehicle_brand && <span className="text-caption ml-1.5 opacity-70">{v.vehicle_brand}</span>}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-body text-text-tertiary">No vehicles registered for this customer.</p>
            )}
          </Step>

          <Step n="6" title="Select Date & Time" locked={!form.connector}>
            <SlotTimePicker
              date={form.date}
              startTime={form.startTime}
              endTime={form.endTime}
              onChange={(key, val) => patch({ [key]: val, availability: null })}
            />
          </Step>

          <Step n="7" title="Check Availability" locked={!form.date || !form.startTime || !form.endTime}>
            <AvailabilityCard
              availability={form.availability}
              loading={loading.avail}
              onCheck={handleCheckAvailability}
            />
          </Step>

          <Step n="8" title="Review & Confirm" locked={!form.availability?.available}>
            <div className="space-y-4">
              <div className="rounded-md bg-surface-sunken border border-border p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InfoRow label="Customer"  value={form.customer?.customer_name || '—'} />
                <InfoRow label="Station"   value={form.station?.name || form.station?.station_code || '—'} />
                <InfoRow label="Charger"   value={form.charger?.charger_code || '—'} />
                <InfoRow label="Connector" value={form.connector?.label || '—'} />
                <InfoRow label="Vehicle"   value={form.vehicle?.vehicle_no || 'Not selected'} />
                <InfoRow label="Slot"      value={form.date && form.startTime ? `${form.date} · ${form.startTime}–${form.endTime}` : '—'} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    label="Notes (optional)"
                    value={form.notes}
                    onChange={e => patch({ notes: e.target.value })}
                    placeholder="Special instructions…"
                  />
                </div>
                <Input
                  label="Estimated Amount (₹)"
                  type="number" min="0"
                  value={form.estimatedAmount}
                  onChange={e => patch({ estimatedAmount: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <Button
                size="lg" fullWidth
                onClick={handleSubmit}
                loading={loading.submit}
                iconLeft={!loading.submit && BookingIcon}
              >
                {loading.submit ? 'Confirming booking…' : 'Confirm Booking & Send SMS'}
              </Button>
            </div>
          </Step>
        </div>
      </div>
    </DashboardLayout>
  )
}
