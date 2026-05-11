import axios from 'axios'

const BASE = '/api/customers'

function auth() {
  return { Authorization: `Bearer ${localStorage.getItem('cn_token')}` }
}

const api = {
  dashboard:          (params)      => axios.get(`${BASE}/dashboard`,               { params, headers: auth() }),
  list:               (params)      => axios.get(`${BASE}/list`,                    { params, headers: auth() }),
  get:                (id)          => axios.get(`${BASE}/${id}`,                   { headers: auth() }),
  bookings:           (id, params)  => axios.get(`${BASE}/${id}/bookings`,          { params, headers: auth() }),
  vehicles:           (id, params)  => axios.get(`${BASE}/${id}/vehicles`,          { params, headers: auth() }),
  walletTransactions: (id, params)  => axios.get(`${BASE}/${id}/wallet-transactions`,{ params, headers: auth() }),
  chargecoins:        (id, params)  => axios.get(`${BASE}/${id}/chargecoins`,       { params, headers: auth() }),
  sessionHistory:     (id, params)  => axios.get(`${BASE}/${id}/session-history`,   { params, headers: auth() }),
}

export default api
