import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/customer.api'

function useFetch(apiFn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await apiFn()
      setData(r.data.data ?? r.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refresh: fetch }
}

export function useCustomerDetail(id) {
  return useFetch(() => api.get(id), [id])
}

function usePaginatedSection(apiFn, id) {
  const [rows,    setRows]    = useState([])
  const [total,   setTotal]   = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const pageRef = useRef(1)

  const fetchPage = useCallback(async (page, reset = false) => {
    setLoading(true)
    setError(null)
    try {
      const r = await apiFn(id, { page, limit: 20 })
      const { data, hasMore: hm, total: t } = r.data
      setRows((prev) => (reset ? data : [...prev, ...data]))
      setTotal(t)
      setHasMore(hm)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }, [apiFn, id])

  useEffect(() => {
    if (!id) return
    pageRef.current = 1
    fetchPage(1, true)
  }, [id, fetchPage])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    pageRef.current += 1
    fetchPage(pageRef.current)
  }, [loading, hasMore, fetchPage])

  return { rows, total, hasMore, loading, error, loadMore }
}

export function useCustomerBookings(id) {
  return usePaginatedSection(api.bookings, id)
}

export function useCustomerVehicles(id) {
  return usePaginatedSection(api.vehicles, id)
}

export function useCustomerWalletTransactions(id) {
  return usePaginatedSection(api.walletTransactions, id)
}

export function useCustomerChargeCoins(id) {
  return usePaginatedSection(api.chargecoins, id)
}

export function useCustomerSessionHistory(id) {
  return usePaginatedSection(api.sessionHistory, id)
}
