import { useLocation, useNavigate } from 'react-router-dom'
import { useSocket } from '../../context/SocketContext'

const PAGE_TITLES = {
  '/dashboard':                'Dashboard',
  '/chargers':                 'Chargers',
  '/sessions':                 'Live Sessions',
  '/sessions/inprogress':      'In-Progress Sessions',
  '/sessions/faulty':          'Faulty Sessions',
  '/users':                    'Users',
  '/settings':                 'Settings',
  '/tickets':                  'Ticket Overview',
  '/tickets/list':             'All Tickets',
  '/tickets/create':           'New Ticket',
  '/reviews':                  'Customer Reviews',
  '/customers':                'Customer Overview',
  '/customers/list':           'All Customers',
  '/slot-booking':             'Advance Slot Booking',
  '/slot-booking/scheduled':   'Scheduled Bookings',
}

function getTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  // Pattern match for dynamic routes
  if (pathname.startsWith('/sessions/'))   return 'Session Details'
  if (pathname.startsWith('/tickets/'))    return 'Ticket Details'
  if (pathname.startsWith('/customers/'))  return 'Customer Details'
  return 'ChargeZone Operations'
}

export default function Navbar({ height = 56, sidebarWidth = 240 }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { hasUnread, markAsRead } = useSocket()
  const title = getTitle(pathname)

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('cn_user')) } catch { return null }
  })()

  return (
    <header
      className="fixed top-0 right-0 bg-surface/85 backdrop-blur-md flex items-center justify-between px-6 z-20 border-b border-border"
      style={{ left: sidebarWidth, height }}
    >
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-h1 text-text-primary truncate">{title}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={markAsRead}
          className="relative w-10 h-10 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-white/[0.05] transition"
          title="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {hasUnread && (
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-surface" />
          )}
        </button>

        <div className="w-px h-5 bg-border mx-2" />

        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-md hover:bg-white/[0.04] transition"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-caption font-semibold flex-shrink-0">
            {(user?.name || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-caption font-semibold text-text-primary leading-tight">
              {user?.name || 'Admin'}
            </span>
            <span className="text-[10px] text-text-tertiary leading-tight capitalize">{user?.role ?? 'administrator'}</span>
          </div>
        </button>
      </div>
    </header>
  )
}
