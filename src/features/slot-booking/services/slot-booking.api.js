import http from '../../../services/http'

const BASE = '/slot-booking'

export const searchCustomer    = (mobile)        => http.post(`${BASE}/search-customer`, { mobile })
export const getStations       = ()              => http.get(`${BASE}/stations`)
export const getChargers       = (stationId)     => http.get(`${BASE}/chargers`, { params: { station_id: stationId } })
export const checkAvailability = (data)          => http.post(`${BASE}/check-availability`, data)
export const createBooking     = (data)          => http.post(`${BASE}/create`, data)
export const getBookings       = (params)        => http.get(`${BASE}/list`, { params })
export const cancelBooking     = (id)            => http.patch(`${BASE}/${id}/cancel`)
