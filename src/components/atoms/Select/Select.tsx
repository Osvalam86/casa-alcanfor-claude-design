import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { fieldVariants, type FieldVariants } from '@/components/atoms/Input'

type SelectProps = Omit<ComponentProps<'select'>, 'aria-invalid'> &
  Omit<FieldVariants, 'invalid'> & {
    invalid?: boolean
  }

/** <select> nativo: teclado y lector de pantalla resueltos por el navegador. */
export function Select({ tone, invalid = false, className, ...props }: SelectProps) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(fieldVariants({ tone, invalid }), 'min-h-12 px-3', className)}
      {...props}
    />
  )
}
