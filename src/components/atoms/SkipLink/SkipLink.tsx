import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Primer elemento enfocable de la página. Fuera de pantalla hasta recibir foco. */
export function SkipLink({ className, children, ...props }: ComponentProps<'a'> & { href: string }) {
  return (
    <a
      className={cn(
        'fixed -top-20 left-4 z-200 rounded-xs bg-surface-deep px-5 py-3 font-sans text-sm font-semibold text-text-inverse no-underline transition-all duration-fast focus:top-4 hover:text-text-inverse',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
