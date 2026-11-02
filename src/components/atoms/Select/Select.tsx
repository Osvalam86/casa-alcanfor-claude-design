import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { fieldVariants, type FieldVariants } from '@/components/atoms/Input'
import { Icon } from '@/components/atoms/Icon'

type SelectProps = Omit<ComponentProps<'select'>, 'aria-invalid'> &
  Omit<FieldVariants, 'invalid'> & {
    invalid?: boolean
  }

/**
 * <select> nativo: teclado y lector de pantalla resueltos por el navegador. Solo se reemplaza
 * la flecha (appearance-none) por el chevron del set de íconos; es decorativo y no recibe clics.
 */
export function Select({ tone, invalid = false, className, ...props }: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        aria-invalid={invalid || undefined}
        className={cn(fieldVariants({ tone, invalid }), 'peer min-h-12 cursor-pointer appearance-none pr-10 pl-3', className)}
        {...props}
      />
      <Icon
        name="chevron-down"
        size={16}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-text peer-disabled:text-disabled-text"
      />
    </div>
  )
}
