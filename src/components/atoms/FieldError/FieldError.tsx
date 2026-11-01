import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/atoms/Icon'

/** Mensaje de error en texto (nunca solo color). Requiere id para aria-describedby. */
export function FieldError({ className, children, ...props }: ComponentProps<'p'> & { id: string }) {
  return (
    <p className={cn('m-0 flex gap-1.5 font-sans text-sm font-medium text-error', className)} {...props}>
      <Icon name="alert-circle" size={16} className="mt-0.5 flex-none" />
      {children}
    </p>
  )
}
