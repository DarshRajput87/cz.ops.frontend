const VARIANTS = {
  info:    { bg: 'rgba(80,130,255,0.08)',  border: 'rgba(80,130,255,0.28)', fg: '#7AA1FF' },
  success: { bg: 'rgba(47,163,107,0.10)',  border: 'rgba(47,163,107,0.30)', fg: '#47C089' },
  warning: { bg: 'rgba(217,164,65,0.10)',  border: 'rgba(217,164,65,0.30)', fg: '#E5B25A' },
  danger:  { bg: 'rgba(214,69,69,0.10)',   border: 'rgba(214,69,69,0.30)',  fg: '#E25858' },
}

const ICONS = {
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01M5 19h14a2 2 0 001.84-2.75L13.74 4a2 2 0 00-3.48 0l-7.1 12.25A2 2 0 005 19z',
  danger:  'M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z',
}

export default function Alert({ variant = 'info', title, children, onClose, className = '' }) {
  const v = VARIANTS[variant]
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-body ${className}`}
      style={{ backgroundColor: v.bg, borderColor: v.border, color: v.fg }}
    >
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[variant]}/>
      </svg>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? 'text-text-secondary mt-0.5' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 transition flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  )
}
