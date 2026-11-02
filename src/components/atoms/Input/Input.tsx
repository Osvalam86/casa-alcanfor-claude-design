import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from '@/components/atoms/Icon'
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
  const field = (
    <input
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(fieldVariants({ tone, invalid }), 'min-h-12 px-3.5', className, type === 'date' && 'peer relative pr-10')}
      {...props}
    />
  )

  if (type !== 'date') return field

  // Fecha: el selector nativo sigue activo pero transparente sobre el ícono (ver index.css),
  // así el clic en el ícono abre el calendario del navegador. El ícono es decorativo.
  return (
    <div className="relative w-full">
      {field}
      <Icon
        name="calendar"
        size={18}
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-text peer-disabled:text-disabled-text"
      />
    </div>
  )
}
