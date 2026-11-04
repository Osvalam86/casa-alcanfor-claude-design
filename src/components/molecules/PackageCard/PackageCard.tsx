import type { MouseEventHandler } from 'react'
import { cn } from '@/lib/cn'
import { Heading } from '@/components/atoms/Heading'
import { PriceTag } from '@/components/atoms/PriceTag'
import { Icon } from '@/components/atoms/Icon'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'

type PackageCardProps = {
  name: string
  pricePrefix: string
  price: string
  priceSuffix: string
  /** Precio completo para lector de pantalla (moneda en palabras, sin "$"). */
  priceSr?: string
  features: readonly string[]
  ctaLabel: string
  onCta?: MouseEventHandler<HTMLButtonElement>
  /** Paquete destacado: superficie oscura en arco con insignia. */
  highlighted?: boolean
  badge?: string
  className?: string
}

/** <li> de la lista de paquetes. Las características son una <ul>: el lector anuncia cuántas incluye. */
export function PackageCard({
  name,
  pricePrefix,
  price,
  priceSuffix,
  priceSr,
  features,
  ctaLabel,
  onCta,
  highlighted = false,
  badge,
  className,
}: PackageCardProps) {
  return (
    <li
      data-surface={highlighted ? 'inverse' : undefined}
      className={cn(
        'relative flex flex-col gap-6',
        highlighted
          ? 'rounded-arch bg-surface-inverse px-card pt-card-top pb-card text-text-inverse shadow-2'
          : 'rounded-md border border-border bg-surface p-card',
        className,
      )}
    >
      <Heading as="h3" size="display-sm" tone={highlighted ? 'inverse' : 'default'} className={highlighted ? 'text-center' : undefined}>
        {name}
      </Heading>
      {/* Después del título en el DOM (antes se leía como parte de la tarjeta anterior); order-first lo deja arriba */}
      {highlighted && badge && (
        <Badge className="order-first -mt-8 self-center">{badge}</Badge>
      )}
      <PriceTag
        prefix={pricePrefix}
        amount={price}
        suffix={priceSuffix}
        srText={priceSr}
        tone={highlighted ? 'inverse' : 'default'}
        emphasis={highlighted}
        align={highlighted ? 'center' : 'start'}
      />
      <ul
        className={cn(
          'm-0 flex flex-1 list-none flex-col gap-3 border-t p-0 pt-6',
          highlighted ? 'border-border-inverse' : 'border-border',
        )}
      >
        {features.map((feature) => (
          <li key={feature} className={cn('flex gap-2.5 font-sans text-ui leading-relaxed', !highlighted && 'text-text')}>
            <Icon name="check" size={18} className={cn('mt-0.5 flex-none', highlighted ? 'text-accent-inverse' : 'text-accent')} />
            {feature}
          </li>
        ))}
      </ul>
      <Button variant={highlighted ? 'inverse' : 'secondary'} onClick={onCta} className="px-6">
        {ctaLabel}
      </Button>
    </li>
  )
}
