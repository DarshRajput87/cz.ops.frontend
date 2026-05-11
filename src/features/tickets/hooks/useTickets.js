import { useState, useEffect, useCallback } from 'react'
import api from '../services/ticket.api'

const DEFAULT_FILTERS = {
  status:         '',
  priority:       '',
  department_tag: '',
  search:         '',
}

// ─── List + Filters + Pagination ──────────────────────────────────────────────

export function useTickets(initialFilters = {}) {
  const [tickets,    setTickets]    = useState([])
  const [total,      setTotal]      = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page,       setPage]       = useState(1)
  const [filters,    setFilters]    = useState({ ...DEFAULT_FILTERS, ...initialFilters })
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  const fetch = useCallback(async (currentPage, currentFilters) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page: currentPage, limit: 20, ...currentFilters }
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k] })

      const res = await api.list(params)
      setTickets(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch(page, filters)
  }, [page, filters, fetch])

  const applyFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }, [])

  const refresh = useCallback(() => fetch(page, filters), [fetch, page, filters])

  return {
    tickets, total, totalPages, page, setPage,
    filters, applyFilters, resetFilters,
    loading, error, refresh,
  }
}

// ─── Single Ticket ────────────────────────────────────────────────────────────

export function useTicket(id) {
  const [ticket,  setTicket]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(id)
      setTicket(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  return { ticket, loading, error, refresh: fetch }
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export function useTicketStats() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.stats()
      .then((res) => { if (!cancelled) setStats(res.data.data) })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.message || 'Failed to load stats') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { stats, loading, error }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useTicketMutations(onSuccess) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const run = async (fn) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fn()
      onSuccess?.(res.data.data)
      return res.data.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createTicket:    (data)              => run(() => api.create(data)),
    updateStatus:    (id, status, note)  => run(() => api.updateStatus(id, status, note)),
    assignTicket:    (id, assigned_to)   => run(() => api.assign(id, assigned_to)),
    resolveTicket:   (id, note)          => run(() => api.resolve(id, note)),
    analyzeFeedback: (text, autoCreate)  => run(() => api.analyze(text, autoCreate)),
  }
}
