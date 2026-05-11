const base = 'bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-colors'

export default function SessionFilters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 })

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        placeholder="Search booking ID, vehicle, customer, charger…"
        value={filters.search || ''}
        onChange={e => set('search', e.target.value)}
        className={`${base} min-w-[300px]`}
      />
      <select
        value={filters.status || ''}
        onChange={e => set('status', e.target.value)}
        className={`${base} cursor-pointer`}
      >
        <option value="">All Statuses</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  )
}
