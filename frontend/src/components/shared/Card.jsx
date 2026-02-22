import clsx from 'clsx'

export default function Card({ children, className, hoverable = false, active = false, onClick, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-200',
        'bg-white dark:bg-surface border-gray-200 dark:border-surface-border',
        hoverable && 'hover:bg-gray-50 dark:hover:bg-surface-hover cursor-pointer',
        active && 'border-leaf-500/40 dark:border-leaf-500/40 bg-leaf-50 dark:bg-leaf-500/[0.08]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e) } } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
