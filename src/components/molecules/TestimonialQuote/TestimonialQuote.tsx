import { cn } from '@/lib/cn'
import { BOX_ASPECT, photoProps, type Photo } from '@/lib/unsplash'
import { ShapedImage } from '@/components/atoms/ShapedImage'
import { Avatar } from '@/components/atoms/Avatar'
import { RatingStars } from '@/components/atoms/RatingStars'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'
import { SR_SEPARATOR } from '@/lib/srText'

type TestimonialQuoteProps = {
  quote: string
  author: string
  initials: string
  meta: string
  ratingLabel: string
  /** Con foto: testimonio destacado a todo el ancho. */
  photo?: Photo
  className?: string
}

/**
 * <figure> + <blockquote> + <figcaption>: la atribución queda fuera de la cita y nombra la figura.
 * La comilla grande y las iniciales son decorativas.
 */
export function TestimonialQuote({ quote, author, initials, meta, ratingLabel, photo, className }: TestimonialQuoteProps) {
  const featured = Boolean(photo)
  const caption = (
    <figcaption className="flex items-center gap-3.5">
      <Avatar variant={featured ? 'dark' : 'light'} size={featured ? 'lg' : 'md'}>
        {initials}
      </Avatar>
      <span className="flex flex-col gap-0.5">
        <span className="font-sans text-ui font-semibold leading-snug text-text">{author}</span>
        {/* Autor y detalle van en líneas distintas: sin separador NVDA leía "Andrea y LuisBoda" */}
        <VisuallyHidden>{SR_SEPARATOR}</VisuallyHidden>
        <span className="font-sans text-sm leading-snug text-text-muted">
          {meta} · <RatingStars label={ratingLabel} />
        </span>
      </span>
    </figcaption>
  )

  if (photo) {
    return (
      <figure
        className={cn(
          'col-span-full m-0 grid grid-fit-320 items-center gap-x-quote-x gap-y-6 border-b border-border pb-quote',
          className,
        )}
      >
        <ShapedImage {...photoProps(photo, '(min-width: 1280px) 560px, (min-width: 1200px) calc(48vw - 48px), (min-width: 728px) 44vw, (min-width: 500px) 92vw, calc(100vw - 40px)', 1200, BOX_ASPECT.photo)} alt={photo.alt} shape="corner-bl" aspect="photo" frameClassName="max-w-140" />
        <div className="flex flex-col gap-6">
          <span aria-hidden="true" className="h-10 font-display text-quote-mark font-medium text-accent">
            “
          </span>
          <blockquote className="m-0 text-pretty font-display text-quote font-medium text-text">{quote}</blockquote>
          {caption}
        </div>
      </figure>
    )
  }

  return (
    <figure className={cn('m-0 flex flex-col gap-5 py-2', className)}>
      {/* Comillas decorativas, como la grande del destacado: el texto de todas las citas va sin comillas */}
      <blockquote className="m-0 font-display text-quote-sm font-medium text-text">
        <span aria-hidden="true">“</span>
        {quote}
        <span aria-hidden="true">”</span>
      </blockquote>
      {caption}
    </figure>
  )
}
