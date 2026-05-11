const STATUS = {
  OPEN:        { label: 'Open',        dot: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  text: '#93c5fd' },
  IN_PROGRESS: { label: 'In Progress', dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',  text: '#fcd34d' },
  ON_HOLD:     { label: 'On Hold',     dot: '#64748b', bg: 'rgba(100,116,139,0.08)',border: 'rgba(100,116,139,0.2)', text: '#94a3b8' },
  RESOLVED:    { label: 'Resolved',    dot: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',  text: '#6ee7b7' },
  CLOSED:      { label: 'Closed',      dot: '#475569', bg: 'rgba(71,85,105,0.06)',  border: 'rgba(71,85,105,0.15)', text: '#64748b' },
}

export default function TicketStatusBadge({ status, size = 'sm' }) {
  const s  = STATUS[status] ?? { label: status, dot: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)', text: '#94a3b8' }
  const px = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${px}`}
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: s.dot, boxShadow: `0 0 5px ${s.dot}99` }}
      />
      {s.label}
    </span>
  )
}
