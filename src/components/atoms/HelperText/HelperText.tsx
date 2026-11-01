import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Ayuda o formato esperado. Requiere id para que el control lo referencie con aria-describedby. */
export function HelperText({ className, ...props }: ComponentProps<'p'> & { id: string }) {
  return <p className={cn('m-0 font-sans text-xs text-text-muted', className)} {...props} />
}
