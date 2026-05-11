import { forwardRef } from 'react'

const Select = forwardRef(function Select({
  label, error, hint, options = [], className = '', containerClassName = '', children, ...props
}, ref) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-caption font-medium text-text-secondary">{label}</label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`ui-input pr-9 appearance-none [color-scheme:dark] ${error ? 'ui-input--error' : ''} ${className}`}
          {...props}
        >
          {children ?? options.map(opt => (
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      {error && <p className="text-caption text-danger">{error}</p>}
      {!error && hint && <p className="text-caption text-text-tertiary">{hint}</p>}
    </div>
  )
})
export default Select
