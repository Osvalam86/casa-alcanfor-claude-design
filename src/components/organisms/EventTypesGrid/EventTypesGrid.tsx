import { landing, type GalleryFilter } from '@/content/landing'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Divider } from '@/components/atoms/Divider'
import { EventTypeCard } from '@/components/molecules/EventTypeCard'

type EventTypesGridProps = {
  /** "Ver ideas…" filtra la galería; el enlace sigue navegando a #galeria de forma nativa. */
  onSelectFilter: (filter: GalleryFilter) => void
}

// Ancho de columna de la rejilla (grid-fill-300, gap-x-6 = 24 px) en el contenedor de página:
// 1 columna hasta 678 px, 2 hasta 1030 px y 3 desde 1031 px; el margen lateral deja de crecer en 1200 px.
const CARD_SIZES =
  '(min-width: 1280px) 379px, (min-width: 1200px) calc((100vw - 144px) / 3), (min-width: 1031px) calc((92vw - 48px) / 3), (min-width: 679px) calc(46vw - 12px), (min-width: 500px) 92vw, calc(100vw - 40px)'
/** La destacada ocupa 2 columnas desde md (768 px): todo el ancho con 2 columnas, 2/3 con 3. */
const FEATURED_SIZES =
  '(min-width: 1280px) 781px, (min-width: 1200px) calc((100vw - 144px) * 2 / 3 + 24px), (min-width: 1031px) calc((92vw - 48px) * 2 / 3 + 24px), (min-width: 768px) 92vw, (min-width: 679px) calc(46vw - 12px), (min-width: 500px) 92vw, calc(100vw - 40px)'

/** <section> nombrada por su h2, que es el destino de foco al navegar desde el menú (useAnchorFocus). */
export function EventTypesGrid({ onSelectFilter }: EventTypesGridProps) {
  const { events } = landing
  return (
    <section id="eventos" aria-labelledby="ev-h" className="bg-surface-alt py-section">
      <div className="mx-auto max-w-page px-gutter">
        <div className="mb-head flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-160 flex-col gap-3">
            <Eyebrow data-reveal="">{events.eyebrow}</Eyebrow>
            <Heading as="h2" id="ev-h" data-reveal="">
              {events.title}
            </Heading>
          </div>
          <Divider className="shrink grow-0 basis-60" />
        </div>
        <ul className="m-0 grid list-none grid-fill-300 gap-x-6 gap-y-card p-0">
          {events.items.map((item, index) => (
            <EventTypeCard
              key={item.title}
              featured={index === 0}
              photo={item.photo}
              sizes={index === 0 ? FEATURED_SIZES : CARD_SIZES}
              title={item.title}
              description={item.description}
              linkLabel={item.link}
              href="#galeria"
              onLinkClick={() => onSelectFilter(item.filter)}
              className={index === 0 ? 'md:col-span-2 md:row-span-2' : undefined}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
