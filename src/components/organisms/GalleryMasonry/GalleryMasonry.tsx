import { GALLERY_FILTERS, landing, type GalleryFilter, type GalleryPhoto } from '@/content/landing'
import { cn } from '@/lib/cn'
import { safeCrop } from '@/lib/unsplash'
import { pageContent, sizesFromWidths } from '@/lib/responsiveSizes'
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

// ── Tamaño de cada mosaico, con las mismas reglas que el CSS de abajo ──────────────
// gap-5 (20 px) · 2 columnas y filas de 150 px por debajo de sm (600 px) · 3 columnas y filas
// clamp(180px, 18vw, 260px) desde sm · contenedor --container-page (1280 px) con --spacing-gutter
// clamp(20px, 4vw, 48px) a cada lado · vertical = 2 filas · ancho = 2 columnas en móvil.
// Si cambian esas clases o tokens, hay que cambiar esto (lo vigila e2e/images.spec.ts).
const GAP = 20
const tileBox = (vw: number, ratio: GalleryPhoto['ratio']) => {
  const cols = vw < 600 ? 2 : 3
  const span = ratio === 'wide' && vw < 600 ? 2 : 1
  const col = (pageContent(vw) - GAP * (cols - 1)) / cols
  const row = vw < 600 ? 150 : Math.min(260, Math.max(180, vw * 0.18))
  return { w: col * span + GAP * (span - 1), h: ratio === 'portrait' ? 2 * row + GAP : row }
}

/** Rango de proporciones de la caja de cada tipo de mosaico entre 320 y 1445 px: define el recorte seguro. */
const boxRange = (ratio: GalleryPhoto['ratio']) => {
  const aspects = Array.from({ length: 1445 - 320 + 1 }, (_, i) => {
    const { w, h } = tileBox(320 + i, ratio)
    return w / h
  })
  return [Math.min(...aspects), Math.max(...aspects)] as const
}
const BOX_RANGE = { portrait: boxRange('portrait'), photo: boxRange('photo'), wide: boxRange('wide') }

/**
 * sizes del mosaico: con object-cover, la imagen se pinta a max(ancho de la caja, alto × proporción de
 * la imagen servida). El "33vw/50vw" anterior medía solo el ancho y pedía imágenes cortas (borrosas).
 */
const sizesCache = new Map<string, string>()
function tileSizes(ratio: GalleryPhoto['ratio'], aspect: number) {
  const key = `${ratio}:${aspect}`
  let sizes = sizesCache.get(key)
  if (!sizes) {
    sizes = sizesFromWidths((vw) => {
      const { w, h } = tileBox(vw, ratio)
      return Math.max(w, h * aspect)
    })
    sizesCache.set(key, sizes)
  }
  return sizes
}

/**
 * Filtros: grupo nombrado de botones toggle (aria-pressed). El conteo vive en una región
 * aria-live que existe desde el inicio. Sin grid-auto-flow: dense, el orden visual sigue al DOM (A11y #8).
 */
export function GalleryMasonry({ filter, photos, onFilter, onOpen }: GalleryMasonryProps) {
  const { gallery } = landing
  return (
    <section id="galeria" aria-labelledby="ga-h" className="bg-surface-alt py-section">
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
              <Chip key={option.value} pressed={option.value === filter} onClick={() => onFilter(option.value)}>
                {option.label}
              </Chip>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="mt-0 mb-5 font-sans text-sm text-text-muted">
          {gallery.count(photos.length, filter)}
        </p>

        <ul className="m-0 grid list-none auto-rows-gallery-sm grid-cols-2 gap-5 p-0 sm:auto-rows-gallery sm:grid-cols-3">
          {photos.map((photo, index) => {
            const crop = safeCrop(photo, BOX_RANGE[photo.ratio])
            return (
              <li
                key={photo.id}
                className={cn('min-h-0', photo.ratio === 'portrait' && 'row-span-2', photo.ratio === 'wide' && 'max-sm:col-span-2')}
              >
                <GalleryItem
                  photo={photo}
                  crop={crop}
                  sizes={tileSizes(photo.ratio, crop ?? photo.sourceAspect ?? photo.width / photo.height)}
                  label={gallery.openLabel(photo.alt)}
                  shape={shapeFor(photo, index)}
                  onOpen={() => onOpen(index)}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
