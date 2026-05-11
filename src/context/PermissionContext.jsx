import { createContext, useContext, useState, useCallback } from 'react'

// ─── Module registry — single source of truth for every grantable module ─────

export const MODULES = [
  { key: 'dashboard',  label: 'Dashboard'      },
  { key: 'sessions',   label: 'Sessions'       },
  { key: 'chargers',   label: 'Chargers'       },
  { key: 'customers',  label: 'Customers'      },
  { key: 'tickets',    label: 'Tickets'        },
  { key: 'bookings',   label: 'Slot Bookings'  },
  { key: 'settings',   label: 'Settings'       },
]

// ─── Context ──────────────────────────────────────────────────────────────────

const PermissionContext = createContext({
  user:        null,
  isAdmin:     false,
  permissions: [],
  can:         () => false,
  refreshUser: () => {},
})

function readUser() {
  try { return JSON.parse(localStorage.getItem('cn_user')) } catch { return null }
}

export function PermissionProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const refreshUser = useCallback(() => setUser(readUser()), [])

  const isAdmin    = user?.role === 'admin'
  const permissions = user?.permissions ?? []

  function can(module) {
    if (!user) return false
    if (isAdmin) return true
    return permissions.includes(module)
  }

  return (
    <PermissionContext.Provider value={{ user, isAdmin, permissions, can, refreshUser }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermission() {
  return useContext(PermissionContext)
}

