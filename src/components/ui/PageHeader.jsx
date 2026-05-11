export default function PageHeader({ title, description, actions, breadcrumbs, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumbs && (
        <nav className="flex items-center gap-1.5 text-caption text-text-tertiary mb-2">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3 h-3 text-text-tertiary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              )}
              {b.href ? (
                <a href={b.href} className="hover:text-text-secondary transition">{b.label}</a>
              ) : (
                <span className={i === breadcrumbs.length - 1 ? 'text-text-secondary' : ''}>{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-display text-text-primary">{title}</h1>
          {description && (
            <p className="text-body text-text-tertiary mt-1.5">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
