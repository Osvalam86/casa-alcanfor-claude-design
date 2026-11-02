import { useState, type ChangeEvent, type ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

type NumberStepperProps = Omit<ComponentProps<'input'>, 'type' | 'aria-invalid'> & {
  id: string
  decrementLabel: string
  incrementLabel: string
  onDecrement: () => void
  onIncrement: () => void
  /** Texto que se anuncia tras + y − (p. ej. "130 invitados"). Por defecto, el valor. */
  valueText?: string
  invalid?: boolean
  tone?: 'field' | 'quiet'
}

/**
 * input type="number" nativo (conserva flechas de teclado y anuncio del valor) flanqueado por
 * dos botones con nombre propio ("Quitar 10 invitados"). El cálculo del nuevo valor es del consumidor.
 * Con + y − el foco queda en el botón, así que el nuevo valor se anuncia en una región viva
 * (presente desde el primer render). Al escribir en el campo se vacía: ahí el lector ya lee el valor.
 */
export function NumberStepper({
  decrementLabel,
  incrementLabel,
  onDecrement,
  onIncrement,
  valueText,
  invalid = false,
  tone = 'quiet',
  className,
  onChange,
  ...inputProps
}: NumberStepperProps) {
  const [announce, setAnnounce] = useState(false)
  const stepButton =
    'w-11 flex-none cursor-pointer border-0 bg-transparent font-sans text-h4 font-medium leading-none text-text hover:text-accent'

  const press = (action: () => void) => () => {
    setAnnounce(true)
    action()
  }

  const change = (event: ChangeEvent<HTMLInputElement>) => {
    setAnnounce(false)
    onChange?.(event)
  }

  return (
    <div
      className={cn(
        'flex min-h-12 items-stretch rounded-xs border',
        tone === 'quiet' ? 'bg-surface' : 'bg-surface-field',
        invalid ? 'border-error' : 'border-border-ui',
        className,
      )}
    >
      <button type="button" aria-label={decrementLabel} onClick={press(onDecrement)} className={stepButton}>
        <span aria-hidden="true">−</span>
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-invalid={invalid || undefined}
        className="w-full min-w-0 border-0 bg-transparent text-center font-sans text-ui font-semibold text-text"
        onChange={change}
        {...inputProps}
      />
      <button type="button" aria-label={incrementLabel} onClick={press(onIncrement)} className={stepButton}>
        <span aria-hidden="true">+</span>
      </button>
      <VisuallyHidden aria-live="polite">{announce ? (valueText ?? String(inputProps.value ?? '')) : ''}</VisuallyHidden>
    </div>
  )
}
