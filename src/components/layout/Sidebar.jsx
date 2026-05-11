import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { usePermission } from '../../context/PermissionContext'
import logo from '../../assets/Logo.png'

// ─── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, className = '' }) => (
  <svg className={`w-[18px] h-[18px] flex-shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d}/>
  </svg>
)
const Chevron = ({ open }) => (
  <svg className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
       fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
  </svg>
)

const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  bolt:      'M13 10V3L4 14h7v7l9-11h-7z',
  clock:     'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  users:     'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  customer:  'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  ticket:    'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  booking:   'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  settings:  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  logout:    'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
}

const PRIMARY_NAV = [
  { to: '/dashboard', label: 'Dashboard', module: 'dashboard', icon: ICONS.dashboard },
  { to: '/sessions',  label: 'Sessions',  module: 'sessions',  icon: ICONS.clock },
]

const CUSTOMER_SUBNAV = [
  { to: '/customers',      label: 'Overview',      end: true },
  { to: '/customers/list', label: 'All Customers', end: true },
]
const TICKET_SUBNAV = [
  { to: '/tickets',        label: 'Overview',    end: true },
  { to: '/tickets/list',   label: 'All Tickets', end: true },
  { to: '/tickets/create', label: 'New Ticket',  end: true },
  { to: '/reviews',        label: 'Reviews',     end: true },
]
const BOOKING_SUBNAV = [
  { to: '/slot-booking',           label: 'New Booking', end: true },
  { to: '/slot-booking/scheduled', label: 'Scheduled',   end: true },
]

// ─── Components ─────────────────────────────────────────────────────────────

function NavItem({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end ?? to === '/dashboard'}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-body font-medium transition-colors duration-150 ${
          isActive
            ? 'bg-primary text-white shadow-card'
            : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
        }`
      }
    >
      <Icon d={icon} />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

function NavGroup({ label, icon, items, basePath }) {
  const { pathname } = useLocation()
  const isActive = pathname.startsWith(basePath)
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button
        onClick={() => setOpen(p => !p)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-body font-medium transition-colors duration-150 ${
          isActive
            ? 'text-text-primary bg-white/[0.04]'
            : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
        }`}
      >
        <Icon d={icon} />
        <span className="flex-1 text-left truncate">{label}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="mt-1 ml-3 pl-3 border-l border-border flex flex-col gap-0.5">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-1.5 rounded-md text-caption font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-text-tertiary hover:text-text-primary hover:bg-white/[0.03]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="px-3 pt-4 pb-1.5 text-overline uppercase text-text-tertiary/70">
      {children}
    </p>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────

export default function Sidebar({ width = 240 }) {
  const navigate = useNavigate()
  const { can, isAdmin } = usePermission()

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('cn_user')) } catch { return null }
  })()

  function handleLogout() {
    localStorage.removeItem('cn_token')
    localStorage.removeItem('cn_user')
    navigate('/login')
  }

  const primaryVisible = PRIMARY_NAV.filter(item => can(item.module))

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col bg-surface-elevated border-r border-border z-30"
      style={{ width }}
    >
      {/* Logo */}
      <div className="flex items-center px-5 h-16 border-b border-border">
        <img src={logo} alt="ChargeNexus" className="h-14 w-auto object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <SectionLabel>Workspace</SectionLabel>
        {primaryVisible.map(item => <NavItem key={item.to} {...item} />)}

        {(can('customers') || can('bookings') || can('tickets')) && (
          <SectionLabel>Operations</SectionLabel>
        )}
        {can('customers') && (
          <NavGroup label="Customers" icon={ICONS.customer} items={CUSTOMER_SUBNAV} basePath="/customers" />
        )}
        {can('bookings') && (
          <NavGroup label="Slot Booking" icon={ICONS.booking} items={BOOKING_SUBNAV} basePath="/slot-booking" />
        )}
        {can('tickets') && (
          <NavGroup label="Tickets" icon={ICONS.ticket} items={TICKET_SUBNAV} basePath="/tickets" />
        )}

        {isAdmin && (
          <>
            <SectionLabel>Administration</SectionLabel>
            <NavItem to="/users" label="Users" icon={ICONS.users} />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-2.5 py-3 border-t border-border flex flex-col gap-1">
        {can('settings') && (
          <NavItem to="/settings" label="Settings" icon={ICONS.settings} />
        )}
        <div className="mt-1 flex items-center gap-3 px-3 py-3 rounded-md bg-white/[0.025] border border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-caption font-semibold flex-shrink-0">
            {(user?.name || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-caption font-semibold text-text-primary truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[10px] text-text-tertiary truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-text-tertiary hover:text-danger transition flex-shrink-0 p-1 -m-1"
          >
            <Icon d={ICONS.logout} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
