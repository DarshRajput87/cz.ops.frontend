import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/customer.api'

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useCustomerDashboard(days = 30) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.dashboard({ days })
      .then((r) => { if (!cancelled) setData(r.data.data) })
      .catch((e) => { if (!cancelled) setError(e.response?.data?.message || 'Failed') })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [days])

  return { data, loading, error }
}

// ─── Infinite-scroll list ─────────────────────────────────────────────────────

const DEFAULT_FILTERS = { is_active: '', is_deleted: '', kyc_status: '', search: '' }

export function useCustomerList() {
  const [customers, setCustomers] = useState([])
  const [total,     setTotal]     = useState(0)
  const [hasMore,   setHasMore]   = useState(true)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [filters,   setFilters]   = useState(DEFAULT_FILTERS)
  const pageRef = useRef(1)

  const fetchPage = useCallback(async (page, currentFilters, reset = false) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: 20, ...currentFilters }
      Object.keys(params).forEach((k) => { if (params[k] === '') delete params[k] })
      const r = await api.list(params)
      const { data, total: t, hasMore: hm } = r.data
      setCustomers((prev) => (reset ? data : [...prev, ...data]))
      setTotal(t)
      setHasMore(hm)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    pageRef.current = 1
    fetchPage(1, filters, true)
  }, [filters, fetchPage])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    pageRef.current += 1
    fetchPage(pageRef.current, filters)
  }, [loading, hasMore, filters, fetchPage])

  const applyFilters = useCallback((next) => {
    setFilters((prev) => ({ ...prev, ...next }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const refresh = useCallback(() => {
    pageRef.current = 1
    fetchPage(1, filters, true)
  }, [filters, fetchPage])

  return {
    customers, total, hasMore, loading, error,
    filters, applyFilters, resetFilters, loadMore, refresh,
  }
}
