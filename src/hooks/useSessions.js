import { useState, useEffect, useCallback } from 'react'
import { sessionsApi } from '../services/sessions.api.js'

const defaultMeta = {
  total: 0, page: 1, limit: 10, pages: 1,
  activeCount: 0, faultyCount: 0, invoiceMissingCount: 0,
  totalEnergy: 0, totalRevenue: 0,
}

function makeHook(apiFn, initialFilters = {}) {
  return function useSessionList() {
    const [data, setData]       = useState([])
    const [meta, setMeta]       = useState(defaultMeta)
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState(null)
    const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters })

    const fetch = useCallback(async (overrides = {}) => {
      setLoading(true)
      setError(null)
      try {
        const { data: res } = await apiFn({ ...filters, ...overrides })
        setData(res.data ?? [])
        setMeta({
          total:               res.total               ?? 0,
          page:                res.page                ?? 1,
          limit:               res.limit               ?? 10,
          pages:               res.pages               ?? 1,
          activeCount:         res.activeCount         ?? 0,
          faultyCount:         res.faultyCount         ?? 0,
          invoiceMissingCount: res.invoiceMissingCount ?? 0,
          totalEnergy:         res.totalEnergy         ?? 0,
          totalRevenue:        res.totalRevenue        ?? 0,
        })
      } catch (e) {
        setError(e.response?.data?.message ?? 'Failed to load sessions')
      } finally {
        setLoading(false)
      }
    }, [filters])

    useEffect(() => { fetch() }, [filters])

    return { data, meta, loading, error, filters, setFilters, refetch: fetch }
  }
}

export const useLiveSessions       = makeHook(sessionsApi.getLive,       { type: 'all' })
export const useInprogressSessions = makeHook(sessionsApi.getInprogress, {})
export const useFaultySessions     = makeHook(sessionsApi.getFaulty,     {})

export function useSessionDetail(id) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    sessionsApi.getById(id)
      .then(res => setData(res.data.data))
      .catch(e  => setError(e.response?.data?.message ?? 'Failed to load session'))
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading, error }
}

export function useResolveSession(onSuccess) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function callApi(apiFn, id) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiFn(id)
      onSuccess?.(data)
      return data
    } catch (e) {
      const msg = e.response?.data?.message ?? 'Operation failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    resolve:         (id) => callApi(sessionsApi.resolve,         id),
    generateInvoice: (id) => callApi(sessionsApi.generateInvoice, id),
    loading,
    error,
  }
}
