import { useState, useCallback, useEffect } from 'react'
import * as api from '../services/slot-booking.api'

export function useScheduledBookings() {
  const [bookings,    setBookings]    = useState([])
  const [total,       setTotal]       = useState(0)
  const [totalPages,  setTotalPages]  = useState(1)
  const [loading,     setLoading]     = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const [error,       setError]       = useState(null)
  const [filters, setFilters] = useState({
    page: 1, limit: 20,
    search: '', status: '', startDate: '', endDate: '',
  })

  const fetchBookings = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getBookings(params)
      const { data, total, totalPages } = res.data.data
      setBookings(data || [])
      setTotal(total || 0)
      setTotalPages(totalPages || 1)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings(filters)
  }, [filters, fetchBookings])

  const handleFilterChange = useCallback((key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: key === 'page' ? value : 1 }))
  }, [])

  const handleCancel = useCallback(async (id) => {
    setCancellingId(id)
    setError(null)
    try {
      await api.cancelBooking(id)
      fetchBookings(filters)
    } catch (e) {
      setError(e.response?.data?.message || 'Cancel failed')
    } finally {
      setCancellingId(null)
    }
  }, [filters, fetchBookings])

  const refresh = useCallback(() => fetchBookings(filters), [filters, fetchBookings])

  return {
    bookings, total, totalPages, loading, error, cancellingId,
    filters, handleFilterChange, handleCancel, refresh,
  }
}
