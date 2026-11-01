import { GALLERY_FILTERS, landing, type GalleryFilter, type GalleryPhoto } from '@/content/landing'
import { cn } from '@/lib/cn'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Chip } from '@/components/atoms/Chip'
import { GalleryItem } from '@/components/molecules/GalleryItem'

type GalleryMasonryProps = {
  filter: GalleryFilter
  photos: readonly GalleryPhoto[]
  onFilter: (filter: GalleryFilter) => void
  onOpen: (index: number) => void
}

function shapeFor(photo: GalleryPhoto, index: number) {
  if (photo.ratio === 'portrait') return index % 2 ? 'rounded' : 'arch'
  return index % 2 ? 'corner' : 'rounded'
}

/**
 * Filtros: grupo nombrado de botones toggle (aria-pressed). El conteo vive en una región
 * aria-live que existe desde el inicio. Sin grid-auto-flow: dense, el orden visual sigue al DOM (A11y #8).
 */
export function GalleryMasonry({ filter, photos, onFilter, onOpen }: GalleryMasonryProps) {
  const { gallery } = landing
  return (
    <section id="galeria" tabIndex={-1} aria-labelledby="ga-h" className="bg-surface-alt py-section">
      <div className="mx-auto max-w-page px-gutter">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <Eyebrow data-reveal="">{gallery.eyebrow}</Eyebrow>
            <Heading as="h2" id="ga-h" data-reveal="">
              {gallery.title}
            </Heading>
          </div>
          <div role="group" aria-label={gallery.filtersLabel} className="flex flex-wrap gap-2">
            {GALLERY_FILTERS.map((option) => (
              <Chip key={option} pressed={option === filter} onClick={() => onFilter(option)}>
                {option}
              </Chip>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="mt-0 mb-5 font-sans text-sm text-text-muted">
          {gallery.count(photos.length, filter)}
        </p>

        <ul className="m-0 grid list-none auto-rows-gallery-sm grid-cols-2 gap-5 p-0 sm:auto-rows-gallery sm:grid-cols-3">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className={cn('min-h-0', photo.ratio === 'portrait' && 'row-span-2', photo.ratio === 'wide' && 'max-sm:col-span-2')}
            >
              <GalleryItem
                photo={photo}
                label={gallery.openLabel(photo.alt)}
                shape={shapeFor(photo, index)}
                onOpen={() => onOpen(index)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
