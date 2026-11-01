import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Label } from '@/components/atoms/Label'
import { HelperText } from '@/components/atoms/HelperText'
import { FieldError } from '@/components/atoms/FieldError'

export type FieldControlProps = {
  id: string
  'aria-describedby'?: string
  invalid: boolean
}

type FormFieldProps = {
  label: string
  optionalText?: string
  helper?: string
  error?: string
  /** id del control; si no se pasa se genera con useId() para garantizar unicidad. */
  id?: string
  labelSize?: 'md' | 'sm'
  className?: string
  /** Recibe el cableado accesible listo para esparcir en Input/Select/Textarea/NumberStepper. */
  children: (control: FieldControlProps) => ReactNode
}

/**
 * Une label, control, ayuda y error. Orden de aria-describedby: ayuda y luego error,
 * así el lector anuncia el formato antes que el problema.
 */
export function FormField({ label, optionalText, helper, error, id, labelSize = 'md', className, children }: FormFieldProps) {
  const generated = useId()
  const controlId = id ?? generated
  const helperId = `${controlId}-help`
  const errorId = `${controlId}-err`
  const describedBy = [helper && helperId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={controlId} size={labelSize} optionalText={optionalText}>
        {label}
      </Label>
      {children({ id: controlId, 'aria-describedby': describedBy, invalid: Boolean(error) })}
      {helper && <HelperText id={helperId}>{helper}</HelperText>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  )
}
