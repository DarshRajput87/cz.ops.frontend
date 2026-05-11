import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const STATUSES    = ['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED']
const PRIORITIES  = ['URGENT', 'HIGH', 'MEDIUM', 'LOW']
const DEPARTMENTS = ['Operations', 'Technical', 'Finance', 'OCPI', 'Support', 'Maintenance', 'Software', 'Mobile App']

const STATUS_LABELS = { OPEN: 'Open', IN_PROGRESS: 'In Progress', ON_HOLD: 'On Hold', RESOLVED: 'Resolved', CLOSED: 'Closed' }

const selectCls = `w-full bg-surface-900/80 border border-surface-700/60 text-slate-300 text-sm rounded-xl
                   px-3 py-2.5 focus:outline-none focus:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/20
                   hover:border-surface-600 transition-all appearance-none cursor-pointer`

function FilterSelect({ label, value, onChange, options, labelMap = {} }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <label className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
          <option value="">All</option>
          {options.map((o) => <option key={o} value={o}>{labelMap[o] ?? o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>
  )
}

export default function TicketFilters({ filters, onApply, onReset }) {
  const [local, setLocal] = useState(filters)
  const [open,  setOpen]  = useState(false)

  const set = (key) => (val) => setLocal((p) => ({ ...p, [key]: val }))

  const activeCount = [filters.status, filters.priority, filters.department_tag].filter(Boolean).length

  const handleApply = () => { onApply(local); setOpen(false) }
  const handleReset = () => {
    const blank = { status: '', priority: '', department_tag: '', search: '' }
    setLocal(blank); onReset(); setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tickets, customers…"
            value={local.search}
            onChange={(e) => {
              const v = e.target.value
              setLocal((p) => ({ ...p, search: v }))
              onApply({ ...local, search: v })
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-900/80 border border-surface-700/60 rounded-xl
                       text-sm text-slate-200 placeholder-slate-600
                       focus:outline-none focus:border-[#00AEEF]/50 focus:ring-1 focus:ring-[#00AEEF]/20
                       hover:border-surface-600 transition-all"
          />
          {local.search && (
            <button
              onClick={() => { setLocal((p) => ({ ...p, search: '' })); onApply({ ...local, search: '' }) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen((p) => !p)}
          className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all
            ${open
              ? 'bg-[#00AEEF]/10 border-[#00AEEF]/30 text-[#00AEEF]'
              : 'bg-surface-900/80 border-surface-700/60 text-slate-400 hover:border-surface-600 hover:text-slate-200'
            }`}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00AEEF] text-white text-[9px]
                             font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,174,239,0.5)]">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="relative bg-surface-900/90 backdrop-blur-sm border border-surface-700/60
                            rounded-2xl p-5 flex flex-wrap gap-4 items-end
                            shadow-xl shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />

              <FilterSelect label="Status"     value={local.status}         onChange={set('status')}         options={STATUSES}    labelMap={STATUS_LABELS} />
              <FilterSelect label="Priority"   value={local.priority}       onChange={set('priority')}       options={PRIORITIES} />
              <FilterSelect label="Department" value={local.department_tag} onChange={set('department_tag')} options={DEPARTMENTS} />

              <div className="flex items-end gap-2 ml-auto">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 text-sm text-slate-500 hover:text-slate-200 border border-surface-700/60
                             hover:border-surface-600 rounded-xl transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#00AEEF] text-white rounded-xl
                             hover:bg-[#0099d6] transition-all shadow-[0_0_16px_rgba(0,174,239,0.3)]"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
