import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { SR_SPACE } from '@/lib/srText'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

type RatingStarsProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** Texto para lector de pantalla, p. ej. "5 de 5 estrellas". Si se omite, las estrellas son decorativas. */
  label?: string
  count?: number
  tone?: 'accent' | 'inverse'
}

export function RatingStars({ label, count = 5, tone = 'accent', className, ...props }: RatingStarsProps) {
  return (
    <span className={cn(tone === 'accent' ? 'text-accent' : 'text-accent-inverse', className)} {...props}>
      <span aria-hidden="true" className="tracking-stars">
        {'★'.repeat(count)}
      </span>
      {/* Espacios de no separación a los lados: el texto oculto no se pega a lo que lo rodea */}
      {label && <VisuallyHidden>{`${SR_SPACE}${label}${SR_SPACE}`}</VisuallyHidden>}
    </span>
  )
}
