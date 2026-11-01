import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { fieldVariants, type FieldVariants } from './fieldStyles'

type InputProps = Omit<ComponentProps<'input'>, 'aria-invalid'> &
  Omit<FieldVariants, 'invalid'> & {
    /** Marca el campo con error: aplica aria-invalid y el borde de error. */
    invalid?: boolean
  }

/**
 * Control nativo. El id lo recibe de FormField para cablear <label for>, ayuda y error.
 * Usa siempre el type específico (email, tel, date, number) y su autocomplete.
 */
export function Input({ tone, invalid = false, type = 'text', className, ...props }: InputProps) {
  return (
    <input
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(fieldVariants({ tone, invalid }), 'min-h-12 px-3.5', className)}
      {...props}
    />
  )
}
