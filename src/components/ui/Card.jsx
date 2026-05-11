import { forwardRef } from 'react'

// Base surface card
const Card = forwardRef(function Card({
  children,
  className   = '',
  padding     = 'md',     // 'none' | 'sm' | 'md' | 'lg'
  hoverable   = false,
  interactive = false,
  as: Tag     = 'div',
  ...props
}, ref) {
  const padCls = {
    none: '',
    sm:   'p-5',
    md:   'p-6',
    lg:   'p-8',
  }[padding]

  return (
    <Tag
      ref={ref}
      className={`
        bg-surface-elevated border border-border rounded-lg shadow-card
        ${padCls}
        ${hoverable ? 'ui-hoverable' : ''}
        ${interactive ? 'cursor-pointer ui-hoverable' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  )
})

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {title && <h3 className="text-h2 text-text-primary truncate">{title}</h3>}
        {subtitle && <p className="text-caption text-text-tertiary mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

export function CardDivider({ className = '' }) {
  return <div className={`h-px bg-border my-4 ${className}`} />
}

export default Card
