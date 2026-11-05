import type { MouseEventHandler } from 'react'
import { cn } from '@/lib/cn'
import { BOX_ASPECT, photoProps, safeCrop, type Photo } from '@/lib/unsplash'

import { ShapedImage } from '@/components/atoms/ShapedImage'
import { Heading } from '@/components/atoms/Heading'
import { TextLink } from '@/components/atoms/TextLink'

/** Proporción de la caja de la tarjeta destacada, medida de 320 a 1440 px (alto mínimo + flex-1). */
const FEATURED_BOX = [0.77, 2.6] as const

type EventTypeCardProps = {
  photo: Photo
  /** sizes de la foto; lo da quien coloca la tarjeta, que conoce el ancho de su columna. */
  sizes: string
  title: string
  description: string
  linkLabel: string
  href: string
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>
  featured?: boolean
  className?: string
}

/**
 * <li> de la grilla de eventos. No es <article>: es un acceso a una categoría, no contenido
 * autónomo. El enlace tiene texto único ("Ver ideas para bodas"), así que no necesita sufijo.
 */
export function EventTypeCard({ photo, sizes, title, description, linkLabel, href, onLinkClick, featured = false, className }: EventTypeCardProps) {
  return (
    <li className={cn('group/card flex flex-col', featured ? 'gap-4' : 'gap-3', className)}>
      {featured ? (
        <div className="relative min-h-90 flex-1 overflow-hidden rounded-arch bg-surface-placeholder">
          <img
            // Caja de proporción variable (0.77 a 2.6 entre 320 y 1440 px): recorte seguro según el original
            {...photoProps(photo, sizes, 1600, safeCrop(photo, FEATURED_BOX))}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-slower ease-out-expo group-hover/card:scale-104"
          />
        </div>
      ) : (
        <ShapedImage
          {...photoProps(photo, sizes, 1200, BOX_ASPECT.photo)}
          alt={photo.alt}
          shape="corner"
          aspect="photo"
          className="transition-transform duration-slower ease-out-expo group-hover/card:scale-104"
        />
      )}
      <Heading as="h3" size={featured ? 'h3-card' : 'title-lg'} className={featured ? undefined : 'mt-2'}>
        {title}
      </Heading>
      <p className={cn('m-0 font-sans text-body text-text-muted', featured && 'max-w-measure')}>{description}</p>
      <TextLink href={href} onClick={onLinkClick}>
        {linkLabel}
      </TextLink>
    </li>
  )
}
