import { useId, useState, type FormEvent } from 'react'
import { EVENT_TYPES, landing } from '@/content/landing'
import { todayIso } from '@/lib/formatDate'
import { GUESTS, isValidGuests } from '@/lib/validation'
import { Select } from '@/components/atoms/Select'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { FieldError } from '@/components/atoms/FieldError'
import { FormField } from '@/components/molecules/FormField'
import { NumberStepper } from '@/components/molecules/NumberStepper'

export type QuickCheckValues = { tipo: string; fecha: string; invitados: number }

type Field = 'tipo' | 'fecha' | 'inv'

type AvailabilityQuickCheckProps = {
  onSubmit: (values: QuickCheckValues) => void
}

/**
 * <form> con nombre (aria-labelledby al título visible) → landmark "form" localizable.
 * El error es un solo mensaje bajo los campos, en una región viva que existe desde el inicio;
 * los campos culpables llevan aria-invalid y aria-describedby a ese mensaje.
 */
export function AvailabilityQuickCheck({ onSubmit }: AvailabilityQuickCheckProps) {
  const { quickCheck: copy } = landing
  const id = useId()
  const titleId = `${id}-title`
  const errorId = `${id}-error`

  const [tipo, setTipo] = useState('')
  const [fecha, setFecha] = useState('')
  const [invitados, setInvitados] = useState(String(copy.invitados.initial))
  const [error, setError] = useState<{ message: string; fields: Field[] } | null>(null)

  const clearError = () => setError(null)
  const step = (delta: number) => {
    const current = parseInt(invitados, 10) || GUESTS.min
    setInvitados(String(Math.min(GUESTS.max, Math.max(GUESTS.min, current + delta))))
    clearError()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!tipo || !fecha) {
      const fields: Field[] = [...(!tipo ? (['tipo'] as const) : []), ...(!fecha ? (['fecha'] as const) : [])]
      setError({ message: copy.errors.missing, fields })
      return
    }
    if (fecha < todayIso()) {
      setError({ message: copy.errors.pastDate, fields: ['fecha'] })
      return
    }
    if (!isValidGuests(invitados)) {
      setError({ message: copy.errors.guests, fields: ['inv'] })
      return
    }
    onSubmit({ tipo, fecha, invitados: parseInt(invitados, 10) })
  }

  const errorWiring = (field: Field) =>
    error?.fields.includes(field) ? { invalid: true, 'aria-describedby': errorId } : { invalid: false }

  return (
    <form
      noValidate
      aria-labelledby={titleId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3.5 rounded-md bg-surface-alt p-5 shadow-1"
    >
      <p id={titleId} className="m-0 font-sans text-overline font-semibold uppercase text-text-muted">
        {copy.title}
      </p>
      <div className="grid grid-fit-150 items-end gap-3">
        <FormField label={copy.tipo.label} labelSize="sm">
          {(field) => (
            <Select
              {...field}
              {...errorWiring('tipo')}
              name="tipo"
              tone="quiet"
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value)
                clearError()
              }}
            >
              <option value="">{copy.tipo.placeholder}</option>
              {EVENT_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label={copy.fecha.label} labelSize="sm">
          {(field) => (
            <Input
              {...field}
              {...errorWiring('fecha')}
              name="fecha"
              type="date"
              tone="quiet"
              min={todayIso()}
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value)
                clearError()
              }}
              className="px-2.5"
            />
          )}
        </FormField>
        <FormField label={copy.invitados.label} labelSize="sm">
          {(field) => (
            <NumberStepper
              {...field}
              {...errorWiring('inv')}
              name="invitados"
              min={GUESTS.min}
              max={GUESTS.max}
              step={GUESTS.step}
              value={invitados}
              onChange={(e) => {
                setInvitados(e.target.value)
                clearError()
              }}
              decrementLabel={copy.invitados.decrement}
              incrementLabel={copy.invitados.increment}
              onDecrement={() => step(-GUESTS.step)}
              onIncrement={() => step(GUESTS.step)}
            />
          )}
        </FormField>
        <Button type="submit" size="md" className="min-h-12 text-ui">
          {copy.submit}
        </Button>
      </div>
      <div aria-live="polite">{error && <FieldError id={errorId}>{error.message}</FieldError>}</div>
      <p className="m-0 font-sans text-sm leading-relaxed text-text-muted">{copy.note}</p>
    </form>
  )
}
