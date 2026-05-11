// Reusable enterprise table primitives. Use as composable building blocks.

export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border bg-surface-elevated ${className}`}>
      <table className="w-full text-body border-separate border-spacing-0">
        {children}
      </table>
    </div>
  )
}

export function THead({ children, sticky = false }) {
  return (
    <thead className={sticky ? 'sticky top-0 z-10' : ''}>
      <tr className="bg-white/[0.02]">{children}</tr>
    </thead>
  )
}

export function TH({ children, align = 'left', className = '' }) {
  return (
    <th
      className={`text-overline uppercase text-text-tertiary px-5 py-3.5 whitespace-nowrap font-semibold tracking-wider text-${align} border-b border-border first:rounded-tl-lg last:rounded-tr-lg ${className}`}
    >
      {children}
    </th>
  )
}

export function TBody({ children }) {
  return <tbody>{children}</tbody>
}

export function TR({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`group transition-colors ${onClick ? 'cursor-pointer hover:bg-white/[0.025]' : 'hover:bg-white/[0.015]'} ${className}`}
    >
      {children}
    </tr>
  )
}

export function TD({ children, align = 'left', className = '', ...props }) {
  return (
    <td
      className={`px-5 py-3.5 border-b border-border/60 text-${align} text-text-secondary whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}
