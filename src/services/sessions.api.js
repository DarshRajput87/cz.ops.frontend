import axios from 'axios'

const BASE = '/api/sessions'
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('cn_token')}` })

export const sessionsApi = {
  getLive:         (params) => axios.get(`${BASE}/live`,               { params, headers: auth() }),
  getInprogress:   (params) => axios.get(`${BASE}/inprogress`,         { params, headers: auth() }),
  getFaulty:       (params) => axios.get(`${BASE}/faulty`,             { params, headers: auth() }),
  getById:         (id)     => axios.get(`${BASE}/${id}`,              { headers: auth() }),
  resolve:         (id)     => axios.post(`${BASE}/${id}/resolve`, {}, { headers: auth() }),
  generateInvoice: (id)     => axios.post(`${BASE}/${id}/resolve`, {}, { headers: auth() }),
}
