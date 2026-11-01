import { landing } from '@/content/landing'
import { Heading } from '@/components/atoms/Heading'
import { Button } from '@/components/atoms/Button'
import { Divider } from '@/components/atoms/Divider'

/** Banner oscuro: los arcos y el ornamento son decorativos (aria-hidden). */
export function CTABanner() {
  const { ctaBanner, cta } = landing
  return (
    <section
      data-surface="inverse"
      aria-labelledby="cta-h"
      className="relative overflow-hidden bg-surface-inverse py-section-lg text-text-inverse"
    >
      <div aria-hidden="true" className="absolute top-arch-1 left-1/2 h-7/5 w-9/10 max-w-180 -translate-x-1/2 rounded-arch-top border border-border-inverse-soft" />
      <div aria-hidden="true" className="absolute top-arch-2 left-1/2 h-7/5 w-4/5 max-w-160 -translate-x-1/2 rounded-arch-top border border-border-inverse-faint" />
      <div className="relative mx-auto flex max-w-190 flex-col items-center gap-6 px-gutter text-center">
        <Divider tone="gold" className="w-40" />
        <Heading as="h2" id="cta-h" size="display-l" tone="inverse" data-reveal="">
          {ctaBanner.title}
        </Heading>
        <p data-reveal="" className="m-0 max-w-measure font-sans text-body-lg text-text-inverse-muted">
          {ctaBanner.lead}
        </p>
        <Button href={cta.contactHref} variant="inverse" size="xl" data-reveal="">
          {cta.availability}
        </Button>
      </div>
    </section>
  )
}
