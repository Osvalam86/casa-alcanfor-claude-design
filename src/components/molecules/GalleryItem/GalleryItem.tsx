import type { MouseEventHandler } from 'react'
import { cn } from '@/lib/cn'
import { photoProps, type Photo } from '@/lib/unsplash'

type GalleryItemProps = {
  photo: Photo
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
export function GalleryItem({ photo, label, onOpen, shape = 'rounded', className }: GalleryItemProps) {
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
        {...photoProps(photo, '(min-width: 600px) 33vw, 50vw', 1200)}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-slower ease-out-expo group-hover/item:scale-104"
      />
    </button>
  )
}
