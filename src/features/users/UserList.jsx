import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, X, Shield, Check, Eye, EyeOff,
  UserCheck, UserX, KeyRound, Pencil, Loader2,
} from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { MODULES } from '../../context/PermissionContext'
import { useUsers, useUserMutations } from './useUsers'

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = ['admin', 'operator', 'agent', 'customer_team', 'viewer']

const ROLE_COLOR = {
  admin:         'text-red-400    bg-red-400/10    border-red-400/20',
  operator:      'text-blue-400   bg-blue-400/10   border-blue-400/20',
  agent:         'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  customer_team: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  viewer:        'text-slate-400  bg-slate-400/10  border-slate-400/20',
}

// ─── Permission grid ──────────────────────────────────────────────────────────

function PermissionGrid({ selected, onChange, disabled }) {
  function toggle(key) {
    if (disabled) return
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key]
    )
  }

  function selectAll()  { if (!disabled) onChange(MODULES.map((m) => m.key)) }
  function clearAll()   { if (!disabled) onChange([]) }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Module Access</p>
        {!disabled && (
          <div className="flex gap-2">
            <button onClick={selectAll} className="text-[10px] text-brand-accent hover:underline">All</button>
            <button onClick={clearAll}  className="text-[10px] text-slate-500 hover:underline">None</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {MODULES.map(({ key, label }) => {
          const on = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              disabled={disabled}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all
                ${on
                  ? 'bg-brand-accent/10 border-brand-accent/40 text-brand-accent'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-slate-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors
                ${on ? 'bg-brand-accent border-brand-accent' : 'border-slate-600'}`}
              >
                {on && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </span>
              {label}
            </button>
          )
        })}
      </div>
      {disabled && (
        <p className="mt-2 text-[10px] text-amber-400/70">Admin role has full access to all modules — no restrictions apply.</p>
      )}
    </div>
  )
}

// ─── User Form Modal ──────────────────────────────────────────────────────────

function UserModal({ mode, user, onClose, onSave }) {
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({
    name:        user?.name        ?? '',
    email:       user?.email       ?? '',
    password:    '',
    role:        user?.role        ?? 'operator',
    permissions: user?.permissions ?? [],
    isActive:    user?.isActive    ?? true,
  })
  const [showPw,   setShowPw]   = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [fieldErr, setFieldErr] = useState({})

  const isAdmin = form.role === 'admin'

  function set(k, v) { setForm((p) => ({ ...p, [k]: v })) }

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name  = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!isEdit && !form.password) e.password = 'Required'
    if (!isEdit && form.password && form.password.length < 6) e.password = 'Min 6 characters'
    setFieldErr(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        name:        form.name,
        role:        form.role,
        permissions: isAdmin ? [] : form.permissions,
        isActive:    form.isActive,
      }
      if (!isEdit) {
        payload.email    = form.email
        payload.password = form.password
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      // error shown by parent hook
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-brand-accent" />
            <h2 className="text-sm font-bold text-white">
              {isEdit ? `Edit — ${user.name}` : 'New User'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-accent/60 placeholder-slate-500"
              placeholder="Jane Doe"
            />
            {fieldErr.name && <p className="text-[10px] text-red-400 mt-1">{fieldErr.name}</p>}
          </div>

          {/* Email — disabled on edit */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Email</label>
            <input
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              disabled={isEdit}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-accent/60 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="jane@example.com"
              type="email"
            />
            {fieldErr.email && <p className="text-[10px] text-red-400 mt-1">{fieldErr.email}</p>}
          </div>

          {/* Password — only on create */}
          {!isEdit && (
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Password</label>
              <div className="relative">
                <input
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  type={showPw ? 'text' : 'password'}
                  className="w-full px-3 py-2 pr-9 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-accent/60 placeholder-slate-500"
                  placeholder="Min 6 characters"
                />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErr.password && <p className="text-[10px] text-red-400 mt-1">{fieldErr.password}</p>}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Role</label>
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Active toggle (edit only) */}
          {isEdit && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('isActive', !form.isActive)}
                className={`w-9 h-5 rounded-full relative transition-colors ${form.isActive ? 'bg-brand-accent' : 'bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isActive ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">Account {form.isActive ? 'Active' : 'Inactive'}</span>
            </label>
          )}

          {/* Permission grid */}
          <PermissionGrid
            selected={form.permissions}
            onChange={(v) => set('permissions', v)}
            disabled={isAdmin}
          />
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700/50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg border border-slate-700 hover:border-slate-600">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-accent text-white hover:opacity-90 disabled:opacity-60 transition-all"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Password Reset Modal ─────────────────────────────────────────────────────

function PasswordModal({ user, onClose, onSave }) {
  const [pw,     setPw]     = useState('')
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (pw.length < 6) { setError('Min 6 characters'); return }
    setSaving(true)
    try { await onSave({ password: pw }); onClose() }
    catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-sm rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Reset Password — {user.name}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">New Password</label>
            <div className="relative">
              <input
                value={pw} onChange={(e) => { setPw(e.target.value); setError('') }}
                type={showPw ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-9 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400/60 placeholder-slate-500"
                placeholder="Min 6 characters"
              />
              <button type="button" onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:text-white">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-amber-400 text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Reset
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function UserList() {
  const { users, loading, error, refresh } = useUsers()
  const { createUser, updateUser, resetPassword, deactivate, loading: mutating, error: mutErr } = useUserMutations(refresh)

  const [modal,  setModal]  = useState(null)  // null | { type: 'create' | 'edit' | 'password', user? }

  function openCreate()     { setModal({ type: 'create' }) }
  function openEdit(u)      { setModal({ type: 'edit', user: u }) }
  function openPassword(u)  { setModal({ type: 'password', user: u }) }
  function closeModal()     { setModal(null) }

  async function handleSave(payload) {
    if (modal.type === 'create') await createUser(payload)
    else                         await updateUser(modal.user._id, payload)
  }

  async function handleDeactivate(u) {
    if (!window.confirm(`Deactivate ${u.name}?`)) return
    await deactivate(u._id)
    refresh()
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1200px] mx-auto space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-white">User Management</h1>
            <p className="text-sm text-slate-400 mt-0.5">Control who can access which modules</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-accent text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New User
          </button>
        </motion.div>

        {(error || mutErr) && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error || mutErr}
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-slate-700/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-700/50">
                {['User', 'Role', 'Module Access', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading && (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded bg-slate-700/60 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              )}
              {users.map((u) => (
                <motion.tr
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`group transition-colors ${u.isActive ? 'hover:bg-slate-800/40' : 'opacity-50 hover:bg-slate-800/20'}`}
                >
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent text-xs font-bold flex-shrink-0">
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLOR[u.role] ?? 'text-slate-400 bg-slate-700/40 border-slate-700'}`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Module access */}
                  <td className="px-5 py-4">
                    {u.role === 'admin' ? (
                      <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" /> All modules
                      </span>
                    ) : !u.permissions?.length ? (
                      <span className="text-xs text-slate-500 italic">No access</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {u.permissions.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${u.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(u)}
                        title="Edit permissions"
                        className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openPassword(u)}
                        title="Reset password"
                        className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      {u.isActive ? (
                        <button
                          onClick={() => handleDeactivate(u)}
                          title="Deactivate"
                          disabled={mutating}
                          className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUser(u._id, { isActive: true }).then(refresh)}
                          title="Activate"
                          disabled={mutating}
                          className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {(modal?.type === 'create' || modal?.type === 'edit') && (
            <UserModal
              mode={modal.type}
              user={modal.user}
              onClose={closeModal}
              onSave={handleSave}
            />
          )}
          {modal?.type === 'password' && (
            <PasswordModal
              user={modal.user}
              onClose={closeModal}
              onSave={(payload) => resetPassword(modal.user._id, payload)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
