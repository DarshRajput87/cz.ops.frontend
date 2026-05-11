import http from './http'

const BASE = '/sessions'

export const sessionsApi = {
  getLive:         (params) => http.get(`${BASE}/live`,               { params }),
  getInprogress:   (params) => http.get(`${BASE}/inprogress`,         { params }),
  getFaulty:       (params) => http.get(`${BASE}/faulty`,             { params }),
  getById:         (id)     => http.get(`${BASE}/${id}`),
  resolve:         (id)     => http.post(`${BASE}/${id}/resolve`, {}),
  generateInvoice: (id)     => http.post(`${BASE}/${id}/resolve`, {}),
}
