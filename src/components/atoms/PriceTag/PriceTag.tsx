import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { SR_SPACE } from '@/lib/srText'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

type PriceTagProps = Omit<ComponentProps<'p'>, 'children'> & {
  prefix: string
  amount: string
  suffix: string
  /**
   * Frase completa para lector de pantalla, p. ej. "Desde 690 pesos mexicanos por invitado" (NVDA lee
   * "$" como dólares). Con ella, las tres piezas visibles van con aria-hidden.
   */
  srText?: string
  tone?: 'default' | 'inverse'
  emphasis?: boolean
  align?: 'start' | 'center'
}

/**
 * Un solo <p>: "Desde $950 por invitado" se lee como una frase continua. Las piezas van en líneas
 * distintas, así que sin srText llevan entre ellas un espacio que sí llega al árbol de accesibilidad.
 */
export function PriceTag({ prefix, amount, suffix, srText, tone = 'default', emphasis = false, align = 'start', className, ...props }: PriceTagProps) {
  const inverse = tone === 'inverse'
  const hidden = srText ? true : undefined
  const gap = !srText && <VisuallyHidden>{SR_SPACE}</VisuallyHidden>
  return (
    <p className={cn('m-0 flex flex-col gap-1', align === 'center' && 'items-center', className)} {...props}>
      <span aria-hidden={hidden} className={cn('font-sans text-overline font-semibold uppercase', inverse ? 'text-text-inverse-muted' : 'text-text-muted')}>
        {prefix}
      </span>
      {gap}
      <span
        aria-hidden={hidden}
        className={cn(
          'font-display font-medium',
          emphasis ? 'text-price-xl' : 'text-price',
          inverse ? 'text-accent-inverse' : 'text-text',
        )}
      >
        {amount}
      </span>
      {gap}
      <span aria-hidden={hidden} className={cn('font-sans text-sm font-medium', inverse ? 'text-text-inverse-muted' : 'text-text-muted')}>
        {suffix}
      </span>
      {srText && <VisuallyHidden>{srText}</VisuallyHidden>}
    </p>
  )
}
