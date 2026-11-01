import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type LogoProps = Omit<ComponentProps<'span'>, 'children'> & {
  name: string
  monogram: string
  tagline?: string
  tone?: 'light' | 'dark'
  size?: 'md' | 'lg'
}

/**
 * Solo contenido visual (spans). Si el logo enlaza, el consumidor lo envuelve en <a>
 * y le da el nombre accesible ("Casa Alcanfor, inicio"). El monograma es decorativo.
 */
export function Logo({ name, monogram, tagline, tone = 'light', size = 'md', className, ...props }: LogoProps) {
  const dark = tone === 'dark'
  return (
    <span className={cn('flex items-center gap-3', className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(
          'flex items-end justify-center rounded-arch-sm border-stroke font-display font-semibold tracking-logo',
          dark ? 'border-accent-inverse text-accent-inverse' : 'border-accent text-accent',
          size === 'md' ? 'h-9.5 w-7.5 pb-1.25 text-xs leading-none' : 'h-10.5 w-8.5 pb-1.5 text-sm leading-none',
        )}
      >
        {monogram}
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display font-semibold',
            dark ? 'text-text-inverse' : 'text-text',
            size === 'md' ? 'text-title leading-none' : 'text-title-lg leading-none',
          )}
        >
          {name}
        </span>
        {tagline && (
          <span className="mt-1.25 font-sans text-micro font-semibold uppercase text-text-muted">{tagline}</span>
        )}
      </span>
    </span>
  )
}
