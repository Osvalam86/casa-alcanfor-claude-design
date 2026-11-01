import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type NumberStepperProps = Omit<ComponentProps<'input'>, 'type' | 'aria-invalid'> & {
  id: string
  decrementLabel: string
  incrementLabel: string
  onDecrement: () => void
  onIncrement: () => void
  invalid?: boolean
  tone?: 'field' | 'quiet'
}

/**
 * input type="number" nativo (conserva flechas de teclado y anuncio del valor) flanqueado por
 * dos botones con nombre propio ("Quitar 10 invitados"). El cálculo del nuevo valor es del consumidor.
 */
export function NumberStepper({
  decrementLabel,
  incrementLabel,
  onDecrement,
  onIncrement,
  invalid = false,
  tone = 'quiet',
  className,
  ...inputProps
}: NumberStepperProps) {
  const stepButton =
    'w-11 flex-none cursor-pointer border-0 bg-transparent font-sans text-h4 font-medium leading-none text-text hover:text-accent'
  return (
    <div
      className={cn(
        'flex min-h-12 items-stretch rounded-xs border',
        tone === 'quiet' ? 'bg-surface' : 'bg-surface-field',
        invalid ? 'border-error' : 'border-border-ui',
        className,
      )}
    >
      <button type="button" aria-label={decrementLabel} onClick={onDecrement} className={stepButton}>
        <span aria-hidden="true">−</span>
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-invalid={invalid || undefined}
        className="w-full min-w-0 border-0 bg-transparent text-center font-sans text-ui font-semibold text-text"
        {...inputProps}
      />
      <button type="button" aria-label={incrementLabel} onClick={onIncrement} className={stepButton}>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  )
}
