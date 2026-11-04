import { landing } from '@/content/landing'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { PackageCard } from '@/components/molecules/PackageCard'

type PricingPackagesProps = {
  /** "Cotiza este paquete" precarga el formulario y lleva el foco a él (acción → <button>). */
  onQuote: (packageName: string) => void
}

export function PricingPackages({ onQuote }: PricingPackagesProps) {
  const { packages } = landing
  return (
    <section id="paquetes" aria-labelledby="pk-h" className="bg-surface-alt py-section">
      <div className="mx-auto max-w-page px-gutter">
        <div className="mx-auto mb-head flex max-w-180 flex-col items-center gap-4 text-center">
          <Eyebrow data-reveal="">{packages.eyebrow}</Eyebrow>
          <Heading as="h2" id="pk-h" data-reveal="">
            {packages.title}
          </Heading>
          <p data-reveal="" className="m-0 font-sans text-body-lg text-text-muted">
            {packages.lead}
          </p>
        </div>
        <ul className="m-0 grid list-none grid-fit-300 items-stretch gap-6 p-0">
          {packages.items.map((item) => (
            <PackageCard
              key={item.name}
              name={item.name}
              pricePrefix={packages.prefix}
              price={item.price}
              priceSuffix={packages.suffix}
              priceSr={packages.priceSr(item.price)}
              features={item.features}
              ctaLabel={packages.cta}
              highlighted={'highlighted' in item}
              badge={'badge' in item ? item.badge : undefined}
              onCta={() => onQuote(item.name)}
            />
          ))}
        </ul>
        <p className="mx-auto mt-8 mb-0 max-w-measure-lg text-center font-sans text-sm leading-loose text-text-muted">
          {packages.footnote}
        </p>
      </div>
    </section>
  )
}
