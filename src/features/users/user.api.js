import axios from 'axios'

const BASE = '/api/users'

function auth() {
  return { Authorization: `Bearer ${localStorage.getItem('cn_token')}` }
}

const api = {
  list:          ()           => axios.get(BASE,                         { headers: auth() }),
  create:        (data)       => axios.post(BASE, data,                  { headers: auth() }),
  update:        (id, data)   => axios.patch(`${BASE}/${id}`, data,      { headers: auth() }),
  resetPassword: (id, data)   => axios.patch(`${BASE}/${id}/password`, data, { headers: auth() }),
  deactivate:    (id)         => axios.delete(`${BASE}/${id}`,           { headers: auth() }),
}

export default api
