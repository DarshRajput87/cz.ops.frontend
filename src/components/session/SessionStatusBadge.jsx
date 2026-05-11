const MAP = {
  in_progress:     { label: 'In Progress',     cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  completed:       { label: 'Completed',       cls: 'bg-slate-700/50 text-slate-300 border-slate-600/20'      },
  cancelled:       { label: 'Cancelled',       cls: 'bg-red-400/10 text-red-400 border-red-400/20'            },
  failed:          { label: 'Failed',          cls: 'bg-red-500/10 text-red-500 border-red-500/20'            },
  paid:            { label: 'Paid',            cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  pending:         { label: 'Pending',         cls: 'bg-amber-400/10 text-amber-400 border-amber-400/20'      },
  done:            { label: 'Paid',            cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  action_required: { label: 'Action Required', cls: 'bg-rose-500/10 text-rose-400 border-rose-400/20'         },
  active:          { label: 'Active',          cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  high:            { label: 'High',            cls: 'bg-rose-500/10 text-rose-400 border-rose-400/20'         },
  medium:          { label: 'Medium',          cls: 'bg-amber-400/10 text-amber-400 border-amber-400/20'      },
  low:             { label: 'Low',             cls: 'bg-blue-400/10 text-blue-400 border-blue-400/20'         },
  true:            { label: 'Generated',       cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  false:           { label: 'Pending',         cls: 'bg-amber-400/10 text-amber-400 border-amber-400/20'      },
  ACTIVE:          { label: 'Active',          cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  COMPLETED:       { label: 'Completed',       cls: 'bg-slate-700/50 text-slate-300 border-slate-600/20'      },
  CANCELLED:       { label: 'Cancelled',       cls: 'bg-red-400/10 text-red-400 border-red-400/20'            },
  FAILED:          { label: 'Failed',          cls: 'bg-red-500/10 text-red-500 border-red-500/20'            },
}

export default function SessionStatusBadge({ value }) {
  const cfg = MAP[String(value)] ?? { label: String(value ?? '—'), cls: 'bg-slate-700/50 text-slate-400 border-slate-600/20' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}
