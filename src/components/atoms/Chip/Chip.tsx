import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type ChipProps = Omit<ComponentProps<'button'>, 'aria-pressed'> & {
  /** Estado del filtro. Etiqueta fija + aria-pressed (la etiqueta no cambia con el estado). */
  pressed: boolean
}

export function Chip({ pressed, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={cn(
        'min-h-11 cursor-pointer rounded-full border px-4.5 font-sans text-sm font-semibold leading-none transition-colors duration-base',
        pressed
          ? 'border-action bg-action text-text-inverse'
          : 'border-border-ui bg-transparent text-text hover:bg-surface-alt',
        className,
      )}
      {...props}
    />
  )
}
