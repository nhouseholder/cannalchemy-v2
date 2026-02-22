import clsx from 'clsx'

const variants = {
  primary: 'bg-gradient-to-br from-leaf-500 to-leaf-600 text-leaf-900 dark:text-leaf-900 shadow-lg shadow-leaf-500/30 hover:shadow-leaf-500/40 font-semibold',
  secondary: 'bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-[#b0c4b4] border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/[0.1]',
  ghost: 'text-gray-600 dark:text-[#8a9a8e] hover:bg-gray-100 dark:hover:bg-white/[0.06]',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  full: 'w-full px-6 py-3 text-sm rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-leaf-900',
        variants[variant],
        sizes[size],
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
