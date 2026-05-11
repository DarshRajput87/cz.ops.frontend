import axios from 'axios'

const api = axios.create({ baseURL: '/api/slot-booking' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('cn_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const searchCustomer    = (mobile)        => api.post('/search-customer', { mobile })
export const getStations       = ()              => api.get('/stations')
export const getChargers       = (stationId)     => api.get('/chargers', { params: { station_id: stationId } })
export const checkAvailability = (data)          => api.post('/check-availability', data)
export const createBooking     = (data)          => api.post('/create', data)
export const getBookings       = (params)        => api.get('/list', { params })
export const cancelBooking     = (id)            => api.patch(`/${id}/cancel`)
