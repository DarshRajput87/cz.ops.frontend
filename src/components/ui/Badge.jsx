import { STATUS_PALETTE } from '../../theme/tokens'

const VARIANT_STYLES = {
  neutral: { bg: 'rgba(255,255,255,0.06)', fg: 'rgba(255,255,255,0.72)', border: 'rgba(255,255,255,0.10)' },
  primary: { bg: 'rgba(158,37,50,0.12)',   fg: '#E26A77',                  border: 'rgba(158,37,50,0.32)' },
  success: { bg: 'rgba(47,163,107,0.12)',  fg: '#47C089',                  border: 'rgba(47,163,107,0.30)' },
  warning: { bg: 'rgba(217,164,65,0.12)',  fg: '#E5B25A',                  border: 'rgba(217,164,65,0.30)' },
  danger:  { bg: 'rgba(214,69,69,0.12)',   fg: '#E25858',                  border: 'rgba(214,69,69,0.30)' },
  info:    { bg: 'rgba(80,130,255,0.10)',  fg: '#7AA1FF',                  border: 'rgba(80,130,255,0.28)' },
}

const SIZES = {
  sm: 'h-6  px-2   text-caption',
  md: 'h-7  px-2.5 text-caption',
  lg: 'h-8  px-3   text-body',
}

export default function Badge({
  children,
  variant     = 'neutral',
  size        = 'md',
  status,
  withDot     = false,
  className   = '',
}) {
  // Status takes precedence — looks up palette
  const palette = status
    ? (STATUS_PALETTE[status] ?? VARIANT_STYLES[variant])
    : VARIANT_STYLES[variant]

  const label = status ? (STATUS_PALETTE[status]?.label ?? children) : children

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-semibold whitespace-nowrap border ${SIZES[size]} ${className}`}
      style={{
        backgroundColor: palette.bg,
        color:           palette.fg,
        borderColor:     palette.border,
      }}
    >
      {withDot && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.fg }} />
      )}
      {label}
    </span>
  )
}
