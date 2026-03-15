import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'default' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center font-ui font-bold tracking-wide transition-colors duration-200 rounded-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary: 'bg-ember text-ivory hover:bg-ember-light active:bg-ember-dark',
  secondary:
    'bg-transparent border border-ivory text-ivory hover:bg-ivory hover:text-charcoal',
  ghost: 'bg-transparent text-sage hover:text-ivory',
}

const sizes: Record<Size, string> = {
  default: 'px-6 py-3 text-sm',
  sm: 'px-4 py-2 text-xs',
}

export default function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
