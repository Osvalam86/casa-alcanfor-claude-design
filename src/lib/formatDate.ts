/** Fecha local de hoy en formato yyyy-mm-dd (el que usan los input type="date"). */
export function todayIso() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

/** "2027-11-14" → "14 de noviembre de 2027". */
export function formatDateLong(iso: string) {
  const date = new Date(`${iso}T12:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}
