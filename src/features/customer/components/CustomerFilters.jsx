import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function CustomerFilters({ filters, onApply, onReset }) {
  const [open,   setOpen]   = useState(false)
  const [local,  setLocal]  = useState(filters)
  const [search, setSearch] = useState(filters.search || '')

  function handleSearch(e) {
    const v = e.target.value
    setSearch(v)
    onApply({ search: v })
  }

  function handleFilter(key, val) {
    setLocal((prev) => ({ ...prev, [key]: val }))
  }

  function apply() {
    onApply(local)
    setOpen(false)
  }

  function reset() {
    setLocal({ is_active: '', is_deleted: '', kyc_status: '', search: '' })
    setSearch('')
    onReset()
    setOpen(false)
  }

  const hasActive = local.is_active !== '' || local.is_deleted !== '' || local.kyc_status !== ''

  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Name, mobile, email or vehicle no…"
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800/60 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent/60"
        />
        {search && (
          <button onClick={() => { setSearch(''); onApply({ search: '' }) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <div className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors
            ${hasActive
              ? 'bg-brand-accent/10 border-brand-accent/40 text-brand-accent'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />}
        </button>

        {open && (
          <div
            className="absolute right-0 top-10 z-20 w-64 rounded-xl border border-slate-700/60 bg-slate-900/95 backdrop-blur-sm p-4 shadow-2xl"
          >
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Filters</p>

            <label className="block mb-3">
              <span className="text-xs text-slate-500 mb-1 block">Status</span>
              <select
                value={local.is_active}
                onChange={(e) => handleFilter('is_active', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>

            <label className="block mb-3">
              <span className="text-xs text-slate-500 mb-1 block">Deleted</span>
              <select
                value={local.is_deleted}
                onChange={(e) => handleFilter('is_deleted', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
              >
                <option value="">All</option>
                <option value="false">Not Deleted</option>
                <option value="true">Deleted</option>
              </select>
            </label>

            <label className="block mb-4">
              <span className="text-xs text-slate-500 mb-1 block">KYC Status</span>
              <select
                value={local.kyc_status}
                onChange={(e) => handleFilter('kyc_status', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none"
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </label>

            <div className="flex gap-2">
              <button
                onClick={reset}
                className="flex-1 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                Reset
              </button>
              <button
                onClick={apply}
                className="flex-1 py-1.5 text-xs rounded-lg bg-brand-accent text-slate-950 font-semibold hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
