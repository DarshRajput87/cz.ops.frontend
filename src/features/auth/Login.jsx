import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import http from '../../services/http'
import AuthLayout from '../../layouts/AuthLayout'
import { Input, Button, Alert } from '../../components/ui'
import logo from '../../assets/Logo.png'
import { usePermission } from '../../context/PermissionContext'


export default function Login() {
  const navigate = useNavigate()
  const { refreshUser } = usePermission()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
    if (apiError) setApiError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      const { data } = await http.post('/auth/login', form)
      localStorage.setItem('cn_token', data.token)
      localStorage.setItem('cn_user', JSON.stringify(data.user))
      sessionStorage.setItem('cn_show_welcome', '1')
      refreshUser()
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="bg-surface-elevated border border-border rounded-xl shadow-elevated p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <img src={logo} alt="ChargeZone Operations" className="h-20 w-auto object-contain mb-5" />
            <h1 className="text-display text-text-primary">Sign in to your account</h1>
            <p className="text-body text-text-tertiary mt-1.5">
              Enter your credentials to access the platform
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            {apiError && (
              <Alert variant="danger">{apiError}</Alert>
            )}

            <Button type="submit" size="lg" loading={loading} fullWidth>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-caption text-text-tertiary mt-7 pt-5 border-t border-border">
            &copy; {new Date().getFullYear()} ChargeZone Operations &middot; Enterprise EV Platform
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
