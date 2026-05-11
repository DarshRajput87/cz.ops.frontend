import axios from 'axios'

const BASE         = '/api/tickets'
const REVIEWS_BASE = '/api/reviews'

function authHeaders() {
  const token = localStorage.getItem('cn_token')
  return { Authorization: `Bearer ${token}` }
}

const api = {
  list: (params) =>
    axios.get(`${BASE}/list`, { params, headers: authHeaders() }),

  agents: () =>
    axios.get(`${BASE}/agents`, { headers: authHeaders() }),

  get: (id) =>
    axios.get(`${BASE}/${id}`, { headers: authHeaders() }),

  create: (data) =>
    axios.post(`${BASE}/create`, data, { headers: authHeaders() }),

  updateStatus: (id, status, note) =>
    axios.patch(`${BASE}/${id}/status`, { status, note }, { headers: authHeaders() }),

  assign: (id, assigned_to) =>
    axios.patch(`${BASE}/${id}/assign`, { assigned_to }, { headers: authHeaders() }),

  resolve: (id, resolution_note) =>
    axios.post(`${BASE}/${id}/resolve`, { resolution_note }, { headers: authHeaders() }),

  stats: () =>
    axios.get(`${BASE}/dashboard/stats`, { headers: authHeaders() }),

  analyze: (raw_feedback, autoCreate = false) =>
    axios.post(`${BASE}/analyze`, { raw_feedback, autoCreate }, { headers: authHeaders() }),

  uploadFiles: (formData, onProgress) =>
    axios.post(`${BASE}/upload`, formData, {
      headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
    }),

  reviews: {
    list:    (params) => axios.get(REVIEWS_BASE,           { params, headers: authHeaders() }),
    stats:   ()       => axios.get(`${REVIEWS_BASE}/stats`, { headers: authHeaders() }),
    process: ()       => axios.post(`${REVIEWS_BASE}/process`, {}, { headers: authHeaders() }),
  },
}

export default api
