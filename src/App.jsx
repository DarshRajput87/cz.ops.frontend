import { Routes, Route, Navigate } from 'react-router-dom'
import { usePermission } from './context/PermissionContext'
import Login from './features/auth/Login'
import Dashboard from './features/dashboard/Dashboard'
import DashboardLayout from './layouts/DashboardLayout'
import LiveSessions from './features/sessions/LiveSessions.jsx'
import InprogressSessions from './features/sessions/InprogressSessions.jsx'
import FaultySessions from './features/sessions/FaultySessions.jsx'
import SessionDetail from './features/sessions/SessionDetail.jsx'
import TicketDashboard from './features/tickets/pages/TicketDashboard.jsx'
import TicketList from './features/tickets/pages/TicketList.jsx'
import CreateTicket from './features/tickets/pages/CreateTicket.jsx'
import TicketDetails from './features/tickets/pages/TicketDetails.jsx'
import CustomerReviews from './features/tickets/pages/CustomerReviews.jsx'
import CustomerDashboard from './features/customer/pages/CustomerDashboard.jsx'
import CustomerList from './features/customer/pages/CustomerList.jsx'
import CustomerDetails from './features/customer/pages/CustomerDetails.jsx'
import UserList from './features/users/UserList'
import AdvanceSlotBooking from './features/slot-booking/pages/AdvanceSlotBooking'
import ScheduledBookings from './features/slot-booking/pages/ScheduledBookings'
import EmptyState from './components/ui/EmptyState'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('cn_token')
  return token ? children : <Navigate to="/login" replace />
}

function NoAccess() {
  return (
    <DashboardLayout>
      <EmptyState
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        title="Access Denied"
        description="You don't have permission to view this section. Contact your administrator to request access."
      />
    </DashboardLayout>
  )
}

function PermissionRoute({ module, adminOnly, children }) {
  const { can, isAdmin } = usePermission()
  if (adminOnly && !isAdmin) return <NoAccess />
  if (module && !can(module)) return <NoAccess />
  return children
}

function PlaceholderPage({ title }) {
  return (
    <DashboardLayout>
      <EmptyState
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        }
        title={title}
        description="This section is part of the platform roadmap and is coming soon."
      />
    </DashboardLayout>
  )
}

function PR({ module, adminOnly, children }) {
  return (
    <PrivateRoute>
      <PermissionRoute module={module} adminOnly={adminOnly}>
        {children}
      </PermissionRoute>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"                      element={<Login />} />
      <Route path="/dashboard"                  element={<PR module="dashboard"><Dashboard /></PR>} />
      <Route path="/sessions"                   element={<PR module="sessions"><LiveSessions /></PR>} />
      <Route path="/sessions/inprogress"        element={<PR module="sessions"><InprogressSessions /></PR>} />
      <Route path="/sessions/faulty"            element={<PR module="sessions"><FaultySessions /></PR>} />
      <Route path="/sessions/:id"               element={<PR module="sessions"><SessionDetail /></PR>} />

      <Route path="/tickets"                    element={<PR module="tickets"><TicketDashboard /></PR>} />
      <Route path="/tickets/list"               element={<PR module="tickets"><TicketList /></PR>} />
      <Route path="/tickets/create"             element={<PR module="tickets"><CreateTicket /></PR>} />
      <Route path="/tickets/:id"                element={<PR module="tickets"><TicketDetails /></PR>} />
      <Route path="/reviews"                    element={<PR module="tickets"><CustomerReviews /></PR>} />

      <Route path="/customers"                  element={<PR module="customers"><CustomerDashboard /></PR>} />
      <Route path="/customers/list"             element={<PR module="customers"><CustomerList /></PR>} />
      <Route path="/customers/:id"              element={<PR module="customers"><CustomerDetails /></PR>} />
      <Route path="/slot-booking"               element={<PR module="bookings"><AdvanceSlotBooking /></PR>} />
      <Route path="/slot-booking/scheduled"     element={<PR module="bookings"><ScheduledBookings /></PR>} />
      <Route path="/users"                      element={<PR adminOnly><UserList /></PR>} />
      <Route path="/settings"                   element={<PR module="settings"><PlaceholderPage title="Settings" /></PR>} />
      <Route path="*"                           element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
