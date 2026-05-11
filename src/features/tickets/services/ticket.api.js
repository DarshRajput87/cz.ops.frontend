import http from '../../../services/http'

const BASE         = '/tickets'
const REVIEWS_BASE = '/reviews'

const api = {
  list: (params) =>
    http.get(`${BASE}/list`, { params }),

  agents: () =>
    http.get(`${BASE}/agents`),

  get: (id) =>
    http.get(`${BASE}/${id}`),

  create: (data) =>
    http.post(`${BASE}/create`, data),

  updateStatus: (id, status, note) =>
    http.patch(`${BASE}/${id}/status`, { status, note }),

  assign: (id, assigned_to) =>
    http.patch(`${BASE}/${id}/assign`, { assigned_to }),

  resolve: (id, resolution_note) =>
    http.post(`${BASE}/${id}/resolve`, { resolution_note }),

  stats: () =>
    http.get(`${BASE}/dashboard/stats`),

  analyze: (raw_feedback, autoCreate = false) =>
    http.post(`${BASE}/analyze`, { raw_feedback, autoCreate }),

  uploadFiles: (formData, onProgress) =>
    http.post(`${BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
    }),

  reviews: {
    list:    (params) => http.get(REVIEWS_BASE,            { params }),
    stats:   ()       => http.get(`${REVIEWS_BASE}/stats`),
    process: ()       => http.post(`${REVIEWS_BASE}/process`, {}),
  },
}

export default api
