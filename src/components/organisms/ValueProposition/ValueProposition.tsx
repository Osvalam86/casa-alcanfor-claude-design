import { landing } from '@/content/landing'
import { photoProps } from '@/lib/unsplash'
import { Heading } from '@/components/atoms/Heading'
import { Button } from '@/components/atoms/Button'
import { ShapedImage } from '@/components/atoms/ShapedImage'
import { StatItem } from '@/components/atoms/StatItem'
import { RatingStars } from '@/components/atoms/RatingStars'
import { FeatureItem } from '@/components/molecules/FeatureItem'

/** Superficie oscura: data-surface="inverse" cambia el anillo de foco a dorado claro. */
export function ValueProposition() {
  const { value, cta } = landing
  return (
    <section
      data-surface="inverse"
      aria-labelledby="vp-h"
      className="relative overflow-hidden bg-surface-inverse py-section text-text-inverse"
    >
      <div aria-hidden="true" className="absolute -top-30 -right-30 h-130 w-105 rounded-arch-top border border-border-inverse-soft" />
      <div className="relative mx-auto grid max-w-page grid-fit-420 items-center gap-split px-gutter">
        <div data-reveal="" className="relative w-full max-w-120">
          <ShapedImage {...photoProps(value.image, '(min-width: 1024px) 480px, 100vw', 1200)} alt={value.image.alt} shape="arch" aspect="portrait" />
          <StatItem as="div" variant="card" value={value.stat.value} label={value.stat.label} className="absolute -right-4 bottom-8" />
        </div>
        <div className="flex flex-col gap-10">
          <Heading as="h2" id="vp-h" size="display-l" tone="inverse" data-reveal="">
            {value.title}
          </Heading>
          <ul className="m-0 grid list-none grid-fit-240 gap-8 p-0">
            {value.features.map((feature) => (
              <FeatureItem key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </ul>
          <div data-reveal="" className="flex flex-wrap items-center gap-5">
            <Button href={cta.contactHref} variant="inverse">
              {cta.availability}
            </Button>
            <p className="m-0 font-sans text-sm font-medium text-text-inverse-muted">
              <RatingStars tone="inverse" label={value.ratingLabel} /> {value.rating}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
