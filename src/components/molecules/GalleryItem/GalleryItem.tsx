import type { MouseEventHandler } from 'react'
import { cn } from '@/lib/cn'
import { photoProps, type Photo } from '@/lib/unsplash'

type GalleryItemProps = {
  photo: Photo
  /** sizes de la imagen; lo calcula la galería, que conoce el tamaño de cada mosaico. */
  sizes: string
  /** Proporción a la que se recorta en origen (ver safeCrop); sin ella, la foto llega completa. */
  crop?: number
  /** Nombre accesible completo del botón, p. ej. "Ampliar foto: Novia sosteniendo su ramo". */
  label: string
  onOpen: MouseEventHandler<HTMLButtonElement>
  shape?: 'arch' | 'corner' | 'rounded'
  className?: string
}

const shapes = {
  arch: 'rounded-arch',
  corner: 'rounded-corner',
  rounded: 'rounded-md',
} as const

/**
 * <button> que abre el lightbox. Un solo nombre accesible (el label del botón):
 * la imagen interior va con alt="" para no anunciarse dos veces.
 */
export function GalleryItem({ photo, sizes, crop, label, onOpen, shape = 'rounded', className }: GalleryItemProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onOpen}
      className={cn(
        'group/item relative block size-full cursor-zoom-in overflow-hidden border-0 bg-surface-placeholder p-0',
        shapes[shape],
        className,
      )}
    >
      <img
        {...photoProps(photo, sizes, 1200, crop)}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-slower ease-out-expo group-hover/item:scale-104"
      />
    </button>
  )
}
