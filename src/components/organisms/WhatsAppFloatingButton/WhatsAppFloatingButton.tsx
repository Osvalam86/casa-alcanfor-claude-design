import { landing } from '@/content/landing'
import { IconButton } from '@/components/atoms/IconButton'

/** Enlace flotante (desde md). Solo ícono: el nombre accesible dice destino y que abre otra ventana. */
export function WhatsAppFloatingButton() {
  const { cta, a11y } = landing
  return (
    <IconButton
      href={cta.whatsappHref}
      target="_blank"
      rel="noopener"
      icon="whatsapp"
      iconSize={26}
      variant="solid"
      size="xl"
      label={`${cta.whatsapp}${a11y.newWindow}`}
      className="fixed right-6 bottom-6 z-40 hidden md:inline-flex"
    />
  )
}
