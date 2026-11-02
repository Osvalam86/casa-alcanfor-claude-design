import { landing } from '@/content/landing'
import { Button } from '@/components/atoms/Button'
import { IconButton } from '@/components/atoms/IconButton'

/**
 * Barra fija inferior solo en móvil (< md). Va al final del <footer> (slot fixedActions): queda dentro
 * de un landmark y no interrumpe el orden de lectura.
 * El footer reserva su alto (pb-26) para que no tape contenido (WCAG 2.4.11).
 */
export function MobileStickyCTA() {
  const { cta, a11y } = landing
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-border bg-surface px-4 pt-2.5 pb-safe shadow-up md:hidden">
      <Button href={cta.contactHref} size="lg" className="min-h-12 flex-1">
        {cta.availability}
      </Button>
      <IconButton
        href={cta.whatsappHref}
        target="_blank"
        rel="noopener"
        icon="whatsapp"
        iconSize={22}
        variant="solid"
        size="lg"
        label={`${cta.whatsapp}${a11y.newWindow}`}
        className="shadow-none"
      />
    </div>
  )
}
