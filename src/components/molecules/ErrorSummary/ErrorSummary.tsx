import { useId, type MouseEvent, type Ref } from 'react'
import { cn } from '@/lib/cn'

export type ErrorSummaryItem = {
  /** id del campo con error; el enlace apunta a #fieldId. */
  fieldId: string
  message: string
}

type ErrorSummaryProps = {
  title: string
  items: readonly ErrorSummaryItem[]
  /** El formulario mueve el foco aquí al enviar con errores (tabIndex=-1). */
  ref?: Ref<HTMLDivElement>
  className?: string
}

/**
 * Resumen tras enviar: role="alert" con nombre tomado del título visible y enlaces
 * a cada campo. Al activar un enlace, el foco va directo al control.
 */
export function ErrorSummary({ title, items, ref, className }: ErrorSummaryProps) {
  const titleId = useId()

  const focusField = (event: MouseEvent<HTMLAnchorElement>, fieldId: string) => {
    const field = document.getElementById(fieldId)
    if (!field) return
    event.preventDefault()
    field.focus()
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby={titleId}
      className={cn('rounded-xs border border-error bg-error-surface px-5 py-4', className)}
    >
      <p id={titleId} className="m-0 mb-2 font-sans text-ui font-bold leading-normal text-error">
        {title}
      </p>
      <ul className="m-0 flex flex-col gap-1 pl-5">
        {items.map((item) => (
          <li key={item.fieldId} className="font-sans text-sm leading-relaxed text-error">
            <a
              href={`#${item.fieldId}`}
              onClick={(event) => focusField(event, item.fieldId)}
              className="text-error underline-offset-3 hover:text-error"
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
