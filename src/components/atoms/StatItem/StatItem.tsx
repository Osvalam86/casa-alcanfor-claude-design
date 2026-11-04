import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { SR_SPACE } from '@/lib/srText'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

type StatItemProps = {
  value: ReactNode
  label: string
  /**
   * Texto completo para lector de pantalla cuando la cifra y la etiqueta visibles no se leen bien juntas
   * (cifra repetida en la etiqueta, calificación con estrella). Con él, la parte visible va con aria-hidden.
   */
  srText?: string
  /** inline = fila de la TrustBar (dentro de una lista) · card = tarjeta flotante sobre foto */
  variant?: 'inline' | 'card'
  as?: 'li' | 'div'
  className?: string
}

export function StatItem({ value, label, srText, variant = 'inline', as: Tag = 'li', className }: StatItemProps) {
  const card = variant === 'card'
  return (
    <Tag
      className={cn(
        card ? 'flex flex-col gap-0.5 rounded-md bg-surface px-5 py-4 text-text shadow-2' : 'flex items-baseline gap-3',
        className,
      )}
    >
      <span aria-hidden={srText ? true : undefined} className={card ? 'font-display text-stat-lg font-medium' : 'font-display text-stat font-medium text-text'}>
        {value}
      </span>
      {/* Cifra y etiqueta son bloques distintos: sin este espacio NVDA leía "14años de experiencia" */}
      {!srText && <VisuallyHidden>{SR_SPACE}</VisuallyHidden>}
      <span
        aria-hidden={srText ? true : undefined}
        className={card ? 'font-sans text-sm font-medium text-text-muted' : 'font-sans text-ui font-medium leading-normal text-text-muted'}
      >
        {label}
      </span>
      {srText && <VisuallyHidden>{srText}</VisuallyHidden>}
    </Tag>
  )
}
