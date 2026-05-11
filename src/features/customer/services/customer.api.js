import http from '../../../services/http'

const BASE = '/customers'

const api = {
  dashboard:          (params)      => http.get(`${BASE}/dashboard`,                { params }),
  list:               (params)      => http.get(`${BASE}/list`,                     { params }),
  get:                (id)          => http.get(`${BASE}/${id}`),
  bookings:           (id, params)  => http.get(`${BASE}/${id}/bookings`,           { params }),
  vehicles:           (id, params)  => http.get(`${BASE}/${id}/vehicles`,           { params }),
  walletTransactions: (id, params)  => http.get(`${BASE}/${id}/wallet-transactions`,{ params }),
  chargecoins:        (id, params)  => http.get(`${BASE}/${id}/chargecoins`,        { params }),
  sessionHistory:     (id, params)  => http.get(`${BASE}/${id}/session-history`,    { params }),
}

export default api
