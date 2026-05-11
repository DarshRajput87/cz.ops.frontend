import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
if (!apiUrl) console.error('[http] VITE_API_URL is not set — API calls will fail in production')

const http = axios.create({
  baseURL: apiUrl || '',
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('cn_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default http
