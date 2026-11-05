import type { ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { landing } from '@/content/landing'
import { BOX_ASPECT, photoProps } from '@/lib/unsplash'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { ShapedImage } from '@/components/atoms/ShapedImage'

/** id del botón principal: la barra móvil (MobileStickyCTA) aparece cuando sale de pantalla. */
export const HERO_CTA_ID = 'hero-cta'

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
  // En % del alto de la foto, no en px: scale-115 deja sobrar un 7.5 % arriba y, con 40 px fijos, en cajas de menos
  // de 533 px de alto (móvil) la foto bajaba más que ese sobrante y destapaba el fondo del marco. 6.15 % = 40 px
  // en la caja de 650 px (desktop), así que ahí no cambia.
  const y = useTransform(scrollY, [0, 600], ['0%', '6.15%'])

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
              <Button id={HERO_CTA_ID} href={cta.contactHref} icon={<Icon name="arrow-right" size={18} />} iconPosition="end">
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

          {/* Bloque de imágenes: contenedor (@container) de la composición; nada sale de su ancho (tokens --hero-* de theme.css) */}
          <div data-reveal="" className="@container w-full">
            <div className="hero-media-box relative pb-10">
              <div aria-hidden="true" className="absolute -top-hero-frame -right-hero-frame aspect-portrait w-full rounded-arch border border-border-decor" />
              <div className="relative aspect-portrait overflow-hidden rounded-arch bg-surface-placeholder shadow-2">
                <motion.img
                  // Caja: hasta 520 px; en móvil, el bloque menos foto pequeña y contorno (6.24 % del bloque, --hero-*),
                  // × 1.15 por scale-115: (100vw − 40px) × 0.9376 × 1.15 ≈ × 1.08. Recortada a 4:5
                  {...photoProps(hero.image, '(min-width: 600px) 598px, calc((100vw - 40px) * 1.08)', 1600, BOX_ASPECT.portrait)}
                  alt={hero.image.alt}
                  loading="eager"
                  // auto, no high: en móvil la foto queda bajo la primera pantalla y competía con el JS que necesita
                  // el LCP (el h1). Lighthouse a 360 px: LCP 4.5 → 2.9 s; a 1440 px sin cambio (0.84 s, aquí sí es el LCP)
                  fetchPriority="auto"
                  decoding="async"
                  style={reduceMotion ? undefined : { y }}
                  className="absolute inset-0 size-full scale-115 object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-image-tint" />
              </div>
              <ShapedImage
                // Ancho de la caja del arco (0.9376 del bloque en móvil) × 2/5, o × 11/25 desde @md (bloque de 448 px =
                // viewport de 488 px), menos el borde de 6 px por lado
                {...photoProps(
                  hero.detailImage,
                  '(min-width: 600px) 217px, (min-width: 488px) calc((100vw - 40px) * 0.4125 - 12px), calc((100vw - 40px) * 0.375 - 12px)',
                  768,
                  BOX_ASPECT.photo,
                )}
                alt={hero.detailImage.alt}
                shape="corner"
                aspect="photo"
                // Alineada con el texto en bloques angostos: sobresale del arco lo que deja el bloque (--hero-overhang)
                frameClassName="absolute -left-hero-overhang bottom-0 w-2/5 border-6 border-surface shadow-1 @md:w-11/25"
              />
            </div>
          </div>
        </div>

        {trustBar}
      </div>
    </section>
  )
}
