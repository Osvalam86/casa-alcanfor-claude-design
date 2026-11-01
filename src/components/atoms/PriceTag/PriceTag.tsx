import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type PriceTagProps = Omit<ComponentProps<'p'>, 'children'> & {
  prefix: string
  amount: string
  suffix: string
  tone?: 'default' | 'inverse'
  emphasis?: boolean
  align?: 'start' | 'center'
}

/** Un solo <p>: "Desde $950 por invitado" se lee como una frase continua. */
export function PriceTag({ prefix, amount, suffix, tone = 'default', emphasis = false, align = 'start', className, ...props }: PriceTagProps) {
  const inverse = tone === 'inverse'
  return (
    <p className={cn('m-0 flex flex-col gap-1', align === 'center' && 'items-center', className)} {...props}>
      <span className={cn('font-sans text-overline font-semibold uppercase', inverse ? 'text-text-inverse-muted' : 'text-text-muted')}>
        {prefix}{' '}
      </span>
      <span
        className={cn(
          'font-display font-medium',
          emphasis ? 'text-price-xl' : 'text-price',
          inverse ? 'text-accent-inverse' : 'text-text',
        )}
      >
        {amount}
      </span>
      <span className={cn('font-sans text-sm font-medium', inverse ? 'text-text-inverse-muted' : 'text-text-muted')}>
        {' '}{suffix}
      </span>
    </p>
  )
}
