import { landing } from '@/content/landing'
import { todayIso } from '@/lib/formatDate'

export const GUESTS = { min: 10, max: 450, step: 10 } as const

export type QuoteValues = {
  name: string
  wa: string
  email: string
  tipo: string
  fecha: string
  inv: string
  idea: string
}

export type QuoteField = Exclude<keyof QuoteValues, 'idea'>
export type QuoteErrors = Partial<Record<QuoteField, string>>

export const QUOTE_FIELDS: QuoteField[] = ['name', 'wa', 'email', 'tipo', 'fecha', 'inv']

/** ids de los campos del formulario de cotización; la página enfoca #quote-name tras precargar. */
export const quoteFieldId = (field: keyof QuoteValues) => `quote-${field}`

export const emptyQuote: QuoteValues = { name: '', wa: '', email: '', tipo: '', fecha: '', inv: '', idea: '' }

export function isValidGuests(value: string | number) {
  const n = typeof value === 'number' ? value : parseInt(value, 10)
  return Number.isFinite(n) && n >= GUESTS.min && n <= GUESTS.max
}

/** Reglas copiadas del diseño. Devuelve el mensaje de error o '' si el valor es válido. */
export function validateField(field: QuoteField, raw: string) {
  const value = raw.trim()
  const messages = landing.quoteForm.errors
  switch (field) {
    case 'name':
      return value.length < 3 ? messages.name : ''
    case 'wa':
      return value.replace(/\D/g, '').length !== 10 ? messages.wa : ''
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? '' : messages.email
    case 'tipo':
      return value ? '' : messages.tipo
    case 'fecha':
      return !value || value < todayIso() ? messages.fecha : ''
    case 'inv':
      return isValidGuests(value) ? '' : messages.inv
  }
}

export function validateQuote(values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {}
  for (const field of QUOTE_FIELDS) {
    const message = validateField(field, values[field])
    if (message) errors[field] = message
  }
  return errors
}
