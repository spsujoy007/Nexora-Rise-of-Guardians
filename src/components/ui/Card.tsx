import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, strong, ...props }: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        strong ? 'glass-strong' : 'glass',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between px-5 pt-5', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-sm tracking-wide text-ice/90 uppercase', className)} {...props} />
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}
