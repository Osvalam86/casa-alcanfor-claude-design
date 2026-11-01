import { landing } from '@/content/landing'
import { Heading } from '@/components/atoms/Heading'
import { RatingStars } from '@/components/atoms/RatingStars'
import { TestimonialQuote } from '@/components/molecules/TestimonialQuote'

/** Cada testimonio es una <figure> con su cita y atribución; el resumen de calificación es un <p>. */
export function TestimonialsSection() {
  const { testimonials: t } = landing
  return (
    <section aria-labelledby="ts-h" className="py-section">
      <div className="mx-auto max-w-page px-gutter">
        <div className="mb-head flex flex-wrap items-end justify-between gap-6">
          <Heading as="h2" id="ts-h" className="max-w-160" data-reveal="">
            {t.title}
          </Heading>
          <p data-reveal="" className="m-0 flex items-center gap-3 font-sans text-ui font-medium leading-normal text-text-muted">
            <span className="font-display text-stat font-medium text-text">{t.rating}</span>
            <span className="flex flex-col">
              <RatingStars label={t.ratingLabel} />
              {t.ratingNote}
            </span>
          </p>
        </div>
        <div className="grid grid-fit-340 gap-6">
          <TestimonialQuote
            quote={t.featured.quote}
            author={t.featured.author}
            initials={t.featured.initials}
            meta={t.featured.meta}
            ratingLabel={t.ratingLabel}
            photo={t.featured.photo}
          />
          {t.items.map((item) => (
            <TestimonialQuote
              key={item.author}
              quote={item.quote}
              author={item.author}
              initials={item.initials}
              meta={item.meta}
              ratingLabel={t.ratingLabel}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
