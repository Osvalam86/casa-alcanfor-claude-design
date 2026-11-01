import type { ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { landing } from '@/content/landing'
import { photoProps } from '@/lib/unsplash'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { ShapedImage } from '@/components/atoms/ShapedImage'

type HeroProps = {
  onTour: () => void
  /** Slots compuestos por el template (un organismo no importa otros organismos). */
  quickCheck: ReactNode
  trustBar: ReactNode
}

/** Única <h1> de la página. La sección es destino de "#top" (logo). */
export function Hero({ onTour, quickCheck, trustBar }: HeroProps) {
  const { hero, cta } = landing
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  // Parallax solo en el hero (motion del DS). Es el único estilo inline: un valor dinámico de motion.
  const y = useTransform(scrollY, [0, 600], [0, 40])

  return (
    <section id="top" aria-labelledby="hero-h" className="overflow-hidden pt-hero-top">
      <div className="mx-auto max-w-page px-gutter">
        <div className="grid grid-fit-460 items-center gap-split">
          <div className="flex max-w-155 flex-col gap-6">
            <Eyebrow data-reveal="">{hero.eyebrow}</Eyebrow>
            <Heading as="h1" id="hero-h" size="display-xl" className="tracking-display" data-reveal="">
              {hero.titleStart}
              <em className="italic text-accent">{hero.titleEmphasis}</em>
            </Heading>
            <p data-reveal="" className="m-0 max-w-measure-md text-pretty font-sans text-body-lg text-text-muted">
              {hero.lead}
            </p>
            <div data-reveal="" className="flex flex-wrap gap-3">
              <Button href={cta.contactHref} icon={<Icon name="arrow-right" size={18} />} iconPosition="end">
                {cta.availability}
              </Button>
              <Button variant="ghost" icon={<Icon name="gallery" size={16} />} onClick={onTour} aria-haspopup="dialog">
                {hero.tour}
              </Button>
            </div>
            <div data-reveal="" className="mt-2">
              {quickCheck}
            </div>
          </div>

          <div data-reveal="" className="relative w-full max-w-130 justify-self-center pb-10">
            <div aria-hidden="true" className="absolute -top-5 -right-5 aspect-portrait w-full rounded-arch border border-border-decor" />
            <div className="relative aspect-portrait overflow-hidden rounded-arch bg-surface-placeholder shadow-2">
              <motion.img
                {...photoProps(hero.image, '(min-width: 1024px) 520px, 100vw')}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                style={reduceMotion ? undefined : { y }}
                className="absolute inset-0 size-full scale-115 object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-image-tint" />
            </div>
            <ShapedImage
              {...photoProps(hero.detailImage, '240px', 768)}
              shape="corner"
              aspect="photo"
              frameClassName="absolute -left-6 bottom-0 w-11/25 border-6 border-surface shadow-1"
            />
          </div>
        </div>

        {trustBar}
      </div>
    </section>
  )
}
