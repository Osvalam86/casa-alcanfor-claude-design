import { landing } from '@/content/landing'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { TextLink } from '@/components/atoms/TextLink'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'
import { ContactItem } from '@/components/molecules/ContactItem'

/**
 * <aside> nombrado: contenido complementario al formulario. Los datos son pares término → valor (<dl>).
 * Los enlaces que abren otra ventana lo anuncian con texto oculto (WCAG 3.2.5).
 */
export function LocationBlock() {
  const { location, cta, a11y } = landing
  return (
    <aside aria-label={location.label} className="flex min-w-0 grow-2 basis-85 flex-col gap-6">
      <div className="relative aspect-map overflow-hidden rounded-arch bg-surface-placeholder">
        <iframe
          title={location.mapTitle}
          src={location.mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0 sepia-25 saturate-85"
        />
      </div>
      <dl className="m-0 flex flex-col gap-5">
        <ContactItem icon="pin" term={location.addressTerm}>
          <span>
            <address className="inline not-italic">{location.address}</address>{' '}
            <span className="text-overline">{location.addressDemo}</span>
          </span>
          <TextLink href={location.directionsHref} variant="plain" target="_blank" rel="noopener" srSuffix={a11y.newWindow} className="self-start">
            {location.directions}
          </TextLink>
        </ContactItem>
        <ContactItem icon="clock" term={location.hoursTerm}>
          {location.hours}
        </ContactItem>
      </dl>
      <div className="flex flex-col gap-3 border-t border-border pt-6">
        <p className="m-0 font-display text-title font-medium text-text">{location.talk}</p>
        <Button
          href={cta.whatsappHref}
          target="_blank"
          rel="noopener"
          variant="outline-sage"
          icon={<Icon name="whatsapp" size={20} />}
          className="self-start px-6"
        >
          {cta.whatsapp}
          <VisuallyHidden>{a11y.newWindow}</VisuallyHidden>
        </Button>
      </div>
    </aside>
  )
}
