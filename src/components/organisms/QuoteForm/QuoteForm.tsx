import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'
import { EVENT_TYPES, landing } from '@/content/landing'
import { todayIso } from '@/lib/formatDate'
import { submitQuote } from '@/lib/submitQuote'
import {
  GUESTS,
  QUOTE_FIELDS,
  quoteFieldId,
  validateField,
  validateQuote,
  type QuoteErrors,
  type QuoteField,
  type QuoteValues,
} from '@/lib/validation'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Textarea } from '@/components/atoms/Textarea'
import { Button } from '@/components/atoms/Button'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Notice } from '@/components/atoms/Notice'
import { TextLink } from '@/components/atoms/TextLink'
import { FormField } from '@/components/molecules/FormField'
import { ErrorSummary } from '@/components/molecules/ErrorSummary'

type QuoteFormProps = {
  /** id del h2 de la sección: nombra al <form> (landmark "formulario"). */
  labelledBy: string
  values: QuoteValues
  onValuesChange: (values: QuoteValues) => void
  prefillNote: string
  onReset: () => void
}

type Status = 'idle' | 'loading' | 'success'

/**
 * Formulario de cotización. Cumple CLAUDE.md §6: label visible, autocomplete, errores por campo con
 * aria-describedby + aria-invalid, resumen de errores con foco al enviar y aviso de éxito con foco.
 * El aviso de precarga vive en una región role="status" que existe desde el primer render.
 */
export function QuoteForm({ labelledBy, values, onValuesChange, prefillNote, onReset }: QuoteFormProps) {
  const { quoteForm: copy } = landing
  const [errors, setErrors] = useState<QuoteErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  /** Cada envío fallido incrementa la llave: el efecto mueve el foco al resumen aunque ya existiera. */
  const [summaryFocusKey, setSummaryFocusKey] = useState(0)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (summaryFocusKey > 0) summaryRef.current?.focus()
  }, [summaryFocusKey])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const field = event.target.name as keyof QuoteValues
    const value = event.target.value
    onValuesChange({ ...values, [field]: value })
    if (field !== 'idea' && errors[field]) setErrors({ ...errors, [field]: validateField(field, value) })
  }

  const onBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = event.target.name as QuoteField
    const value = event.target.value
    if (value || submitted) setErrors((current) => ({ ...current, [field]: validateField(field, value) }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'loading') return
    const nextErrors = validateQuote(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitted(true)
      setSummaryFocusKey((key) => key + 1)
      return
    }
    setErrors({})
    setSubmitted(false)
    setStatus('loading')
    await submitQuote(values)
    setStatus('success')
  }

  const reset = () => {
    setStatus('idle')
    setErrors({})
    setSubmitted(false)
    onReset()
  }

  if (status === 'success') {
    const firstName = values.name.trim().split(/\s+/)[0] ?? ''
    return (
      <div className="flex flex-col items-start gap-5 py-6">
        <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full border border-success text-success">
          <Icon name="check" size={28} />
        </span>
        <Heading as="h3" size="h3-card" ref={successRef} tabIndex={-1}>
          {copy.success.title(firstName)}
        </Heading>
        <p className="m-0 max-w-measure font-sans text-body-lg text-text-muted">{copy.success.body}</p>
        <button
          type="button"
          onClick={reset}
          className="min-h-11 cursor-pointer border-0 bg-transparent p-0 font-sans text-ui font-semibold text-accent underline underline-offset-4"
        >
          {copy.success.reset}
        </button>
      </div>
    )
  }

  const summary = submitted
    ? QUOTE_FIELDS.filter((field) => errors[field]).map((field) => ({ fieldId: quoteFieldId(field), message: errors[field] ?? '' }))
    : []

  const fieldProps = (field: QuoteField) => ({
    id: quoteFieldId(field),
    error: errors[field] || undefined,
  })

  return (
    <form noValidate aria-labelledby={labelledBy} onSubmit={onSubmit} className="flex flex-col gap-5">
      <div role="status">{prefillNote && <Notice>{prefillNote}</Notice>}</div>
      <p className="m-0 font-sans text-sm text-text-muted">{copy.instructions}</p>

      {summary.length > 0 && <ErrorSummary ref={summaryRef} title={copy.summaryTitle(summary.length)} items={summary} />}

      <div className="grid grid-fit-240 gap-5">
        <FormField label={copy.fields.name.label} {...fieldProps('name')}>
          {(f) => <Input {...f} name="name" autoComplete="name" required value={values.name} onChange={onChange} onBlur={onBlur} />}
        </FormField>
        <FormField label={copy.fields.wa.label} helper={copy.fields.wa.helper} {...fieldProps('wa')}>
          {(f) => (
            <Input {...f} name="wa" type="tel" inputMode="tel" autoComplete="tel-national" required value={values.wa} onChange={onChange} onBlur={onBlur} />
          )}
        </FormField>
        <FormField label={copy.fields.email.label} {...fieldProps('email')}>
          {(f) => <Input {...f} name="email" type="email" autoComplete="email" required value={values.email} onChange={onChange} onBlur={onBlur} />}
        </FormField>
        <FormField label={copy.fields.tipo.label} {...fieldProps('tipo')}>
          {(f) => (
            <Select {...f} name="tipo" required value={values.tipo} onChange={onChange} onBlur={onBlur}>
              <option value="">{copy.fields.tipo.placeholder}</option>
              {EVENT_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label={copy.fields.fecha.label} {...fieldProps('fecha')}>
          {(f) => (
            <Input {...f} name="fecha" type="date" min={todayIso()} required value={values.fecha} onChange={onChange} onBlur={onBlur} className="px-3" />
          )}
        </FormField>
        <FormField label={copy.fields.inv.label} helper={copy.fields.inv.helper} {...fieldProps('inv')}>
          {(f) => (
            <Input
              {...f}
              name="inv"
              type="number"
              inputMode="numeric"
              min={GUESTS.min}
              max={GUESTS.max}
              required
              value={values.inv}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </FormField>
      </div>

      <FormField label={copy.fields.idea.label} optionalText={copy.fields.idea.optional} id={quoteFieldId('idea')}>
        {(f) => <Textarea {...f} name="idea" value={values.idea} onChange={onChange} />}
      </FormField>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button type="submit" loading={status === 'loading'} className="px-8">
          {status === 'loading' ? copy.submitting : copy.submit}
        </Button>
        <p className="m-0 grow basis-65 font-sans text-xs leading-relaxed text-text-muted">
          {copy.privacyStart}
          <TextLink href={copy.privacyHref} variant="inline">
            {copy.privacyLink}
          </TextLink>
          {copy.privacyEnd}
        </p>
      </div>
    </form>
  )
}
