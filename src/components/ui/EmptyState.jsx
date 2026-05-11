export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-14 px-6 ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-border flex items-center justify-center mb-4 text-text-tertiary">
          {icon}
        </div>
      )}
      {title && <p className="text-h2 text-text-primary">{title}</p>}
      {description && <p className="text-caption text-text-tertiary mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
