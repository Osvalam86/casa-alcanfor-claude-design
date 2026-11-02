import { useMemo, useState, type MouseEvent } from 'react'
import { landing, type GalleryFilter } from '@/content/landing'
import { formatDateLong } from '@/lib/formatDate'
import { emptyQuote, quoteFieldId, type QuoteValues } from '@/lib/validation'
import { useReveal } from '@/lib/hooks/useReveal'
import { LandingTemplate, CONTACT_HEADING_ID } from '@/components/templates/LandingTemplate'
import { SiteHeader } from '@/components/organisms/SiteHeader'
import { MobileMenu } from '@/components/organisms/MobileMenu'
import { Hero } from '@/components/organisms/Hero'
import { AvailabilityQuickCheck, type QuickCheckValues } from '@/components/organisms/AvailabilityQuickCheck'
import { TrustBar } from '@/components/organisms/TrustBar'
import { EventTypesGrid } from '@/components/organisms/EventTypesGrid'
import { ValueProposition } from '@/components/organisms/ValueProposition'
import { SpacesShowcase } from '@/components/organisms/SpacesShowcase'
import { PricingPackages } from '@/components/organisms/PricingPackages'
import { ProcessTimeline } from '@/components/organisms/ProcessTimeline'
import { GalleryMasonry } from '@/components/organisms/GalleryMasonry'
import { Lightbox, type LightboxMode } from '@/components/organisms/Lightbox'
import { TestimonialsSection } from '@/components/organisms/TestimonialsSection'
import { CTABanner } from '@/components/organisms/CTABanner'
import { FAQAccordion } from '@/components/organisms/FAQAccordion'
import { QuoteForm } from '@/components/organisms/QuoteForm'
import { LocationBlock } from '@/components/organisms/LocationBlock'
import { SiteFooter } from '@/components/organisms/SiteFooter'
import { MobileStickyCTA } from '@/components/organisms/MobileStickyCTA'
import { WhatsAppFloatingButton } from '@/components/organisms/WhatsAppFloatingButton'

const MENU_ID = 'menu-movil'

/** Lleva scroll y foco a una sección (o a un campo dentro de ella) sin depender del salto nativo del ancla. */
function goTo(sectionId: string, focusId?: string) {
  const section = document.getElementById(sectionId)
  if (!section) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${sectionId}`)
  const target = (focusId && document.getElementById(focusId)) || section
  target.focus({ preventScroll: true })
}

/**
 * Estado compartido de la landing: menú, galería/lightbox, pestaña de espacios y el formulario
 * de cotización, que se precarga desde el verificador del hero, los paquetes y "Agenda tu visita".
 */
export function LandingPage() {
  useReveal()

  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<GalleryFilter>('Todos')
  const [spaceIndex, setSpaceIndex] = useState(0)
  const [lightbox, setLightbox] = useState<{ open: boolean; mode: LightboxMode; index: number }>({
    open: false,
    mode: 'gallery',
    index: 0,
  })
  const [quote, setQuote] = useState<QuoteValues>(emptyQuote)
  const [prefillNote, setPrefillNote] = useState('')
  /** Remonta el formulario al precargar: sale del estado de éxito y limpia errores viejos. */
  const [formKey, setFormKey] = useState(0)

  const galleryPhotos = useMemo(
    () => (filter === 'Todos' ? landing.gallery.photos : landing.gallery.photos.filter((p) => p.category === filter)),
    [filter],
  )
  const tourPhotos = useMemo(() => landing.spaces.items.map((space) => space.photo), [])

  const prefill = (patch: Partial<QuoteValues>, note: string) => {
    setMenuOpen(false)
    setQuote((current) => ({ ...current, ...patch }))
    setPrefillNote(note)
    setFormKey((key) => key + 1)
    window.setTimeout(() => goTo('contacto', quoteFieldId('name')), 0)
  }

  const onVisit = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    prefill({ idea: quote.idea || landing.prefill.visitIdea }, landing.prefill.visitNote)
  }

  const onQuote = (packageName: string) =>
    prefill({ idea: landing.prefill.packageIdea(packageName) }, landing.prefill.packageNote(packageName))

  const onQuickCheck = ({ tipo, fecha, invitados }: QuickCheckValues) =>
    prefill(
      { tipo, fecha, inv: String(invitados) },
      landing.prefill.quickCheckNote(tipo, formatDateLong(fecha), invitados),
    )

  const onMenuNavigate = (href: string) => {
    setMenuOpen(false)
    window.setTimeout(() => goTo(href.slice(1)), 0)
  }

  const resetQuote = () => {
    setQuote(emptyQuote)
    setPrefillNote('')
  }

  return (
    <LandingTemplate
      header={<SiteHeader menuId={MENU_ID} menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} onVisit={onVisit} />}
      mobileMenu={
        <MobileMenu id={MENU_ID} open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={onMenuNavigate} onVisit={onVisit} />
      }
      sections={
        <>
          <Hero
            onTour={() => setLightbox({ open: true, mode: 'tour', index: 0 })}
            quickCheck={<AvailabilityQuickCheck onSubmit={onQuickCheck} />}
            trustBar={<TrustBar />}
          />
          <EventTypesGrid onSelectFilter={setFilter} />
          <ValueProposition />
          <SpacesShowcase activeIndex={spaceIndex} onChange={setSpaceIndex} onVisit={onVisit} />
          <PricingPackages onQuote={onQuote} />
          <ProcessTimeline onVisit={onVisit} />
          <GalleryMasonry
            filter={filter}
            photos={galleryPhotos}
            onFilter={setFilter}
            onOpen={(index) => setLightbox({ open: true, mode: 'gallery', index })}
          />
          <TestimonialsSection />
          <CTABanner />
          <FAQAccordion />
        </>
      }
      quoteForm={
        <QuoteForm
          key={formKey}
          labelledBy={CONTACT_HEADING_ID}
          values={quote}
          onValuesChange={setQuote}
          prefillNote={prefillNote}
          onReset={resetQuote}
        />
      }
      location={<LocationBlock />}
      footer={
        <SiteFooter
          fixedActions={
            <>
              <MobileStickyCTA />
              <WhatsAppFloatingButton />
            </>
          }
        />
      }
      overlays={
        <>
          <Lightbox
            open={lightbox.open}
            mode={lightbox.mode}
            photos={lightbox.mode === 'tour' ? tourPhotos : galleryPhotos}
            index={lightbox.index}
            onIndexChange={(index) => setLightbox((current) => ({ ...current, index }))}
            onClose={() => setLightbox((current) => ({ ...current, open: false }))}
          />
        </>
      }
    />
  )
}
