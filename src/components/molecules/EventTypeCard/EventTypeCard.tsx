import type { MouseEventHandler } from 'react'
import { cn } from '@/lib/cn'
import { photoProps, type Photo } from '@/lib/unsplash'
import { ShapedImage } from '@/components/atoms/ShapedImage'
import { Heading } from '@/components/atoms/Heading'
import { TextLink } from '@/components/atoms/TextLink'

type EventTypeCardProps = {
  photo: Photo
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
export function EventTypeCard({ photo, title, description, linkLabel, href, onLinkClick, featured = false, className }: EventTypeCardProps) {
  return (
    <li className={cn('group/card flex flex-col', featured ? 'gap-4' : 'gap-3', className)}>
      {featured ? (
        <div className="relative min-h-90 flex-1 overflow-hidden rounded-arch bg-surface-placeholder">
          <img
            {...photoProps(photo, '(min-width: 768px) 66vw, 100vw')}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-slower ease-out-expo group-hover/card:scale-104"
          />
        </div>
      ) : (
        <ShapedImage
          {...photoProps(photo, '(min-width: 768px) 33vw, 100vw', 1200)}
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
