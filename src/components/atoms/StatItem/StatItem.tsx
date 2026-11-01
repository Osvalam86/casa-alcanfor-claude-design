import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type StatItemProps = {
  value: ReactNode
  label: string
  /** inline = fila de la TrustBar (dentro de una lista) · card = tarjeta flotante sobre foto */
  variant?: 'inline' | 'card'
  as?: 'li' | 'div'
  className?: string
}

export function StatItem({ value, label, variant = 'inline', as: Tag = 'li', className }: StatItemProps) {
  if (variant === 'card') {
    return (
      <Tag className={cn('flex flex-col gap-0.5 rounded-md bg-surface px-5 py-4 text-text shadow-2', className)}>
        <span className="font-display text-stat-lg font-medium">{value}</span>
        <span className="font-sans text-sm font-medium text-text-muted">{label}</span>
      </Tag>
    )
  }
  return (
    <Tag className={cn('flex items-baseline gap-3', className)}>
      <span className="font-display text-stat font-medium text-text">{value}</span>
      <span className="font-sans text-ui font-medium leading-normal text-text-muted">{label}</span>
    </Tag>
  )
}
