import type { KeyboardEvent } from 'react'
import { landing } from '@/content/landing'
import { photoProps, type Photo } from '@/lib/unsplash'
import { useModalDialog } from '@/lib/hooks/useModalDialog'
import { IconButton } from '@/components/atoms/IconButton'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'

export type LightboxMode = 'gallery' | 'tour'

type LightboxProps = {
  open: boolean
  mode: LightboxMode
  photos: readonly Photo[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

/**
 * <dialog> modal a pantalla completa. Galería y "Recorrido por los espacios" (D7) comparten el componente.
 * La imagen lleva el alt descriptivo; el <figcaption> visible repite ese texto, así que va con
 * aria-hidden para que el lector no lo anuncie dos veces. ← → cambian de foto; una región viva
 * oculta anuncia la posición y la descripción ("2 de 12: Novia sosteniendo su ramo de flores").
 * Con NVDA en modo exploración las flechas las intercepta el lector: ahí se usan los botones.
 */
export function Lightbox({ open, mode, photos, index, onIndexChange, onClose }: LightboxProps) {
  const { ref, onCancel, onKeyDown: trapTab } = useModalDialog(open, onClose)
  const { lightbox } = landing
  const count = photos.length
  const photo = photos[index]
  const label = mode === 'tour' ? lightbox.tourLabel : lightbox.galleryLabel
  const counter = mode === 'tour' ? lightbox.tourLabel : lightbox.counter(index + 1, count)

  const step = (delta: number) => onIndexChange((index + delta + count) % count)

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    trapTab(event)
    if (count < 2) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  return (
    <dialog
      ref={ref}
      aria-label={label}
      data-surface="inverse"
      onCancel={onCancel}
      onKeyDown={onKeyDown}
      className="m-0 size-full max-h-none max-w-none bg-overlay-strong p-0 text-text-inverse backdrop:bg-transparent"
    >
      <div className="flex h-full flex-col px-gutter pt-4 pb-6">
        <div className="flex min-h-14 items-center justify-between gap-4">
          <p className="m-0 font-sans text-sm font-medium text-text-inverse-muted">{counter}</p>
          {/* Existe desde el primer render; antes solo anunciaba "2 de 12", sin decir qué foto es */}
          <VisuallyHidden aria-live="polite">{open && photo ? lightbox.announce(index + 1, count, photo.alt) : ''}</VisuallyHidden>
          <IconButton icon="close" variant="overlay" size="lg" label={lightbox.close} onClick={onClose} />
        </div>

        {photo && (
          <div className="flex min-h-0 flex-1 items-center justify-center gap-4">
            {count > 1 && (
              <IconButton icon="chevron-left" variant="overlay" size="lg" label={lightbox.prev} onClick={() => step(-1)} />
            )}
            <figure className="m-0 flex h-full min-w-0 max-w-275 flex-1 flex-col justify-center gap-4">
              {/* key por foto: un <img> nuevo en cada cambio, así no se ve la foto anterior mientras carga la siguiente.
                  Solo con el diálogo abierto: cerrado, el <img> descargaba la primera foto al cargar la página.
                  Sin recorte: el lightbox muestra la foto completa (object-contain). */}
              {open && (
                <img
                  key={photo.id}
                  {...photoProps(photo, '(min-width: 1100px) 1100px, 100vw', 1600)}
                  alt={photo.alt}
                  className="mx-auto max-h-lightbox w-auto max-w-full rounded-md bg-surface-placeholder-dark object-contain"
                />
              )}
              <figcaption aria-hidden="true" className="text-center font-sans text-ui leading-relaxed text-text-inverse-muted">{photo.alt}</figcaption>
            </figure>
            {count > 1 && (
              <IconButton icon="chevron-right" variant="overlay" size="lg" label={lightbox.next} onClick={() => step(1)} />
            )}
          </div>
        )}
      </div>
    </dialog>
  )
}
