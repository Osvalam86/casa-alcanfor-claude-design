import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Decorativo: el estado de carga se comunica con el texto del control ("Enviando…"). */
export function Spinner({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-3.5 animate-spin rounded-full border-stroke border-current border-r-transparent',
        className,
      )}
      {...props}
    />
  )
}
