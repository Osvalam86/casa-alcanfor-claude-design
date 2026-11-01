import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
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
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  )
}
