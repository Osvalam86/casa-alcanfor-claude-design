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
      {highlighted && badge && (
        <Badge className="-mt-8 self-center">{badge}</Badge>
      )}
      <Heading as="h3" size="display-sm" tone={highlighted ? 'inverse' : 'default'} className={highlighted ? 'text-center' : undefined}>
        {name}
      </Heading>
      <PriceTag
        prefix={pricePrefix}
        amount={price}
        suffix={priceSuffix}
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
