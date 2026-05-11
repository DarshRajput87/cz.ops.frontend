import DashboardLayout from '../../../layouts/DashboardLayout'
import { useScheduledBookings } from '../hooks/useScheduledBookings'
import ScheduledBookingTable from '../components/ScheduledBookingTable'
import { PageHeader, Button, Card, Input, Select, Alert } from '../../../components/ui'

const STATUSES = [
  { value: '',            label: 'All Status' },
  { value: 'scheduled',   label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
  { value: 'no_show',     label: 'No Show' },
]

const RefreshIcon = ({ spinning }) => (
  <svg className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
  </svg>
)
const SearchIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
  </svg>
)

export default function ScheduledBookings() {
  const {
    bookings, total, totalPages, loading, error, cancellingId,
    filters, handleFilterChange, handleCancel, refresh,
  } = useScheduledBookings()

  return (
    <DashboardLayout>
      <PageHeader
        breadcrumbs={[{ label: 'Slot Booking' }, { label: 'Scheduled' }]}
        title="Scheduled Bookings"
        description={`${total} support-scheduled booking${total !== 1 ? 's' : ''}.`}
        actions={
          <Button variant="secondary" size="sm" onClick={refresh} iconLeft={<RefreshIcon spinning={loading} />}>
            Refresh
          </Button>
        }
      />

      <div className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <Card padding="sm">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[220px]">
              <Input
                type="search"
                placeholder="Search booking ID, customer, vehicle, charger…"
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                iconLeft={SearchIcon}
              />
            </div>
            <Select
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
              options={STATUSES}
              containerClassName="w-44"
            />
            <Input
              type="date" value={filters.startDate}
              onChange={e => handleFilterChange('startDate', e.target.value)}
              className="[color-scheme:dark]" containerClassName="w-40"
            />
            <Input
              type="date" value={filters.endDate}
              onChange={e => handleFilterChange('endDate', e.target.value)}
              className="[color-scheme:dark]" containerClassName="w-40"
            />
          </div>
        </Card>

        <ScheduledBookingTable
          bookings={bookings}
          loading={loading}
          cancellingId={cancellingId}
          onCancel={handleCancel}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-caption text-text-tertiary">
              Page {filters.page} of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={filters.page <= 1}
                onClick={() => handleFilterChange('page', filters.page - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={filters.page >= totalPages}
                onClick={() => handleFilterChange('page', filters.page + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
