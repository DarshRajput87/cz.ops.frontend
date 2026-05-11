const PRIORITY = {
  URGENT: { label: 'Urgent', dot: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.22)',   text: '#fca5a5' },
  HIGH:   { label: 'High',   dot: '#f97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.22)',  text: '#fdba74' },
  MEDIUM: { label: 'Medium', dot: '#eab308', bg: 'rgba(234,179,8,0.08)',   border: 'rgba(234,179,8,0.22)',   text: '#fde047' },
  LOW:    { label: 'Low',    dot: '#64748b', bg: 'rgba(100,116,139,0.07)', border: 'rgba(100,116,139,0.18)', text: '#94a3b8' },
}

export default function TicketPriorityBadge({ priority, size = 'sm' }) {
  const p  = PRIORITY[priority] ?? { label: priority, dot: '#64748b', bg: 'rgba(100,116,139,0.07)', border: 'rgba(100,116,139,0.18)', text: '#94a3b8' }
  const px = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${px}`}
      style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: p.dot, boxShadow: `0 0 5px ${p.dot}88` }}
      />
      {p.label}
    </span>
  )
}
