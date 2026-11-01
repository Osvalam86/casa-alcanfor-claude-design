import type { ReactNode } from 'react'
import { landing } from '@/content/landing'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { SkipLink } from '@/components/atoms/SkipLink'

/** id del h2 de contacto: nombra la sección y el <form> de cotización. */
export const CONTACT_HEADING_ID = 'ct-h'

type LandingTemplateProps = {
  header: ReactNode
  mobileMenu: ReactNode
  /** Secciones de <main> en orden, antes de contacto. */
  sections: ReactNode
  quoteForm: ReactNode
  location: ReactNode
  footer: ReactNode
  /** Elementos fijos (barra móvil, WhatsApp) y diálogos (lightbox): al final del DOM. */
  overlays: ReactNode
}

/**
 * Esqueleto de la página: skip link como primer enfocable → header (banner) → <main> único →
 * footer (contentinfo) → capas fijas. Alterna fondos claro / alterno / oscuro según el orden de secciones.
 */
export function LandingTemplate({ header, mobileMenu, sections, quoteForm, location, footer, overlays }: LandingTemplateProps) {
  const { a11y, contact } = landing
  return (
    <>
      <SkipLink href="#main">{a11y.skipLink}</SkipLink>
      {header}
      {mobileMenu}
      <main id="main" tabIndex={-1}>
        {sections}
        <section id="contacto" tabIndex={-1} aria-labelledby={CONTACT_HEADING_ID} className="bg-surface-alt py-section">
          <div className="mx-auto max-w-page px-gutter">
            <div className="mb-quote flex flex-col gap-3">
              <Eyebrow data-reveal="">{contact.eyebrow}</Eyebrow>
              <Heading as="h2" id={CONTACT_HEADING_ID} size="display-l" data-reveal="">
                {contact.title}
              </Heading>
            </div>
            <div className="flex flex-wrap items-start gap-x-quote-x gap-y-8">
              <div className="min-w-0 max-w-full grow-3 basis-130 rounded-md bg-surface p-panel shadow-1">{quoteForm}</div>
              {location}
            </div>
          </div>
        </section>
      </main>
      {footer}
      {overlays}
    </>
  )
}
