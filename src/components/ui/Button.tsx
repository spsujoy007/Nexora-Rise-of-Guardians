import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'neon' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-guardian-blue text-white hover:bg-guardian-blue/90 glow-blue',
  neon: 'bg-neon text-[#03170D] font-semibold hover:bg-neon/90 glow-neon',
  ghost: 'bg-transparent text-ice hover:bg-black/5',
  outline: 'bg-transparent border border-line text-ice hover:border-guardian-blue/60',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-wide transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}
