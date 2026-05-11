import { useState, useEffect, useCallback } from 'react'
import api from './user.api'

export function useUsers() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await api.list()
      setUsers(r.data.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { users, loading, error, refresh: fetch }
}

export function useUserMutations(onSuccess) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function run(fn) {
    setLoading(true)
    setError(null)
    try {
      const r = await fn()
      onSuccess?.(r.data.data)
      return r.data.data
    } catch (e) {
      const msg = e.response?.data?.message || 'Operation failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createUser:    (data)       => run(() => api.create(data)),
    updateUser:    (id, data)   => run(() => api.update(id, data)),
    resetPassword: (id, data)   => run(() => api.resetPassword(id, data)),
    deactivate:    (id)         => run(() => api.deactivate(id)),
  }
}
