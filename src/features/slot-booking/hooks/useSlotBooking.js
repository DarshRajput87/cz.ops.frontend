import { useState, useCallback } from 'react'
import * as api from '../services/slot-booking.api'

const INIT = {
  customer:        null,
  mobileInput:     '',
  station:         null,
  charger:         null,
  connector:       null,
  date:            '',
  startTime:       '',
  endTime:         '',
  vehicle:         null,
  notes:           '',
  estimatedAmount: '',
  availability:    null,
}

export function useSlotBooking() {
  const [form,    setForm]    = useState(INIT)
  const [loading, setLoading] = useState({ search: false, stations: false, chargers: false, avail: false, submit: false })
  const [error,   setError]   = useState(null)
  const [stations,  setStations]  = useState([])
  const [chargers,  setChargers]  = useState([])
  const [success,   setSuccess]   = useState(null)

  const patch = useCallback(updates => setForm(f => ({ ...f, ...updates })), [])
  const clearError = useCallback(() => setError(null), [])

  const handleSearchCustomer = useCallback(async () => {
    if (!form.mobileInput.trim()) return
    setLoading(l => ({ ...l, search: true }))
    setError(null)
    patch({ customer: null, availability: null })
    try {
      const res = await api.searchCustomer(form.mobileInput.trim())
      patch({ customer: res.data.data, vehicle: res.data.data.vehicles?.[0] ?? null })
    } catch (e) {
      setError(e.response?.data?.message || 'Customer not found')
    } finally {
      setLoading(l => ({ ...l, search: false }))
    }
  }, [form.mobileInput, patch])

  const loadStations = useCallback(async () => {
    setLoading(l => ({ ...l, stations: true }))
    try {
      const res = await api.getStations()
      setStations(res.data.data || [])
    } catch {
      setError('Failed to load stations')
    } finally {
      setLoading(l => ({ ...l, stations: false }))
    }
  }, [])

  const handleSelectStation = useCallback(async (station) => {
    patch({ station, charger: null, connector: null, availability: null })
    setLoading(l => ({ ...l, chargers: true }))
    try {
      const res = await api.getChargers(station._id)
      setChargers(res.data.data || [])
    } catch {
      setError('Failed to load chargers')
    } finally {
      setLoading(l => ({ ...l, chargers: false }))
    }
  }, [patch])

  const handleCheckAvailability = useCallback(async () => {
    const { charger, connector, date, startTime, endTime } = form
    if (!charger || !connector || !date || !startTime || !endTime) {
      setError('Select charger, connector, date and time slot first')
      return
    }
    const start = new Date(`${date}T${startTime}:00`)
    const end   = new Date(`${date}T${endTime}:00`)
    setLoading(l => ({ ...l, avail: true }))
    setError(null)
    patch({ availability: null })
    try {
      const res = await api.checkAvailability({
        chargerId:   charger._id,
        connectorId: connector.connector_id,
        startTime:   start.toISOString(),
        endTime:     end.toISOString(),
      })
      patch({ availability: res.data.data })
    } catch (e) {
      setError(e.response?.data?.message || 'Availability check failed')
    } finally {
      setLoading(l => ({ ...l, avail: false }))
    }
  }, [form, patch])

  const handleSubmit = useCallback(async () => {
    const { customer, station, charger, connector, date, startTime, endTime, vehicle, notes, estimatedAmount } = form
    if (!customer || !station || !charger || !connector || !date || !startTime || !endTime) {
      setError('Please complete all required fields')
      return
    }
    if (!form.availability?.available) {
      setError('Slot is not available. Please check availability first.')
      return
    }
    setLoading(l => ({ ...l, submit: true }))
    setError(null)
    try {
      const res = await api.createBooking({
        customerId:          customer._id,
        chargerId:           charger._id,
        connectorId:         connector.connector_id,
        connectorLabel:      connector.label,
        stationId:           station._id,
        vehicleNo:           vehicle?.vehicle_no || '',
        vehicleId:           vehicle?._id || null,
        scheduledStartTime:  new Date(`${date}T${startTime}:00`).toISOString(),
        scheduledEndTime:    new Date(`${date}T${endTime}:00`).toISOString(),
        notes,
        stationName:         station.name || station.station_code || '',
        chargerCode:         charger.charger_code || '',
        customerName:        customer.customer_name || '',
        customerMobile:      customer.mobile || '',
        estimatedAmount:     Number(estimatedAmount) || 0,
      })
      setSuccess(res.data.data)
      setForm(INIT)
      setChargers([])
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(l => ({ ...l, submit: false }))
    }
  }, [form])

  const resetSuccess = useCallback(() => setSuccess(null), [])

  return {
    form, patch, loading, error, clearError,
    stations, chargers,
    success, resetSuccess,
    handleSearchCustomer,
    loadStations,
    handleSelectStation,
    handleCheckAvailability,
    handleSubmit,
  }
}
