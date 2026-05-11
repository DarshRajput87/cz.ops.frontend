import { forwardRef } from 'react'

// ─── Variants ──────────────────────────────────────────────────────────────
const VARIANTS = {
  primary:   'bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed shadow-card',
  secondary: 'bg-surface-hover text-text-primary border border-border hover:border-border-strong hover:bg-[#2d4051]',
  ghost:    'bg-transparent text-text-secondary hover:bg-white/[0.04] hover:text-text-primary',
  outline:  'bg-transparent text-text-primary border border-border hover:border-border-strong hover:bg-white/[0.03]',
  danger:   'bg-danger text-white hover:bg-danger-hover shadow-card',
  success:  'bg-success text-white hover:bg-success-hover',
}

const SIZES = {
  xs: 'h-8  px-3   text-caption rounded',
  sm: 'h-9  px-3.5 text-body    rounded-md',
  md: 'h-10 px-4   text-body    rounded-md',
  lg: 'h-11 px-5   text-bodyL   rounded-md',
  xl: 'h-12 px-6   text-bodyL   rounded-md',
}

const Spinner = ({ className = '' }) => (
  <svg className={`animate-spin-slow w-4 h-4 flex-shrink-0 ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const Button = forwardRef(function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled,
  iconLeft,
  iconRight,
  className = '',
  fullWidth = false,
  children,
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      disabled={loading || disabled}
      className={`ui-btn ${SIZES[size]} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  )
})

export default Button
