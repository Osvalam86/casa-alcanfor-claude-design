import type { ComponentProps } from 'react'

/** Texto solo para tecnología asistiva (se oculta visualmente, no del árbol de accesibilidad). */
export function VisuallyHidden(props: ComponentProps<'span'>) {
  return <span className="sr-only" {...props} />
}
