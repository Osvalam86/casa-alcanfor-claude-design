import { useEffect, useState } from 'react'
import { landing } from '@/content/landing'
import { cn } from '@/lib/cn'
import { Button } from '@/components/atoms/Button'
import { IconButton } from '@/components/atoms/IconButton'

type MobileStickyCTAProps = {
  /** id del botón principal del hero: cuando sale de pantalla aparece la barra. */
  triggerId: string
  /** id de la sección de destino (cotización): mientras se ve, la barra vuelve al estado inicial. */
  destinationId: string
}

/** Las dos piezas que aparecen juntas: mismo movimiento y la misma duración. */
const reveal = 'transition duration-base ease-out-expo'
const hiddenPiece = 'pointer-events-none translate-y-4 opacity-0'

/**
 * Barra fija inferior solo en móvil (< md). Va al final del <footer> (slot fixedActions): queda dentro
 * de un landmark y no interrumpe el orden de lectura.
 * Dos estados: al cargar solo se ve WhatsApp flotando; cuando el botón principal del hero sale de pantalla
 * aparecen juntos el fondo y «Consulta disponibilidad», y desaparecen mientras se ve la cotización.
 * WhatsApp no cambia de lugar ni de tamaño: el botón oculto conserva su espacio en la fila.
 * Oculto, el botón es inert (sin foco ni lectura). data-sticky-cta ajusta la reserva de scroll-padding
 * (theme.css) a lo que se ve en cada estado, para que no tape el foco (WCAG 2.4.11).
 */
export function MobileStickyCTA({ triggerId, destinationId }: MobileStickyCTAProps) {
  const { cta, a11y } = landing
  const [triggerVisible, setTriggerVisible] = useState(true)
  const [destinationVisible, setDestinationVisible] = useState(false)
  const shown = !triggerVisible && !destinationVisible

  useEffect(() => {
    const trigger = document.getElementById(triggerId)
    const destination = document.getElementById(destinationId)
    if (!trigger || !destination) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === trigger) setTriggerVisible(entry.isIntersecting)
        else setDestinationVisible(entry.isIntersecting)
      }
    })
    observer.observe(trigger)
    observer.observe(destination)
    return () => observer.disconnect()
  }, [triggerId, destinationId])

  return (
    <div data-sticky-cta={shown ? 'shown' : 'hidden'} className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 border-t border-border bg-surface shadow-up', reveal, shown ? 'pointer-events-auto' : hiddenPiece)}
      />
      <div className="relative flex gap-2.5 px-4 pt-2.5 pb-safe">
        <Button
          href={cta.contactHref}
          size="lg"
          inert={!shown}
          className={cn('min-h-12 flex-1', reveal, shown ? 'pointer-events-auto' : hiddenPiece)}
        >
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
          // Sobre la barra no lleva sombra (como antes); flotando sola conserva la del botón flotante
          className={cn('pointer-events-auto', shown && 'shadow-none')}
        />
      </div>
    </div>
  )
}
