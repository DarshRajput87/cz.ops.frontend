import http from '../../services/http'

const BASE = '/users'

const api = {
  list:          ()           => http.get(BASE),
  create:        (data)       => http.post(BASE, data),
  update:        (id, data)   => http.patch(`${BASE}/${id}`, data),
  resetPassword: (id, data)   => http.patch(`${BASE}/${id}/password`, data),
  deactivate:    (id)         => http.delete(`${BASE}/${id}`),
}

export default api
