import { landing } from '@/content/landing'

/**
 * Aviso de proyecto conceptual, antes del header. No es fijo: se va con el scroll y nunca tapa el foco
 * (WCAG 2.4.11). <aside> con nombre → landmark complementary, para que todo el contenido viva en landmarks.
 */
export function ProjectNotice() {
  const { label, text } = landing.projectNotice
  return (
    <aside aria-label={label} className="border-b border-border bg-surface-alt">
      <p className="mx-auto max-w-page px-gutter py-2 text-center text-xs text-text-muted">{text}</p>
    </aside>
  )
}
