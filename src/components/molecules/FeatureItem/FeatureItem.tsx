import { cn } from '@/lib/cn'
import { Icon, type IconName } from '@/components/atoms/Icon'
import { Heading } from '@/components/atoms/Heading'

type FeatureItemProps = {
  icon: IconName
  title: string
  description: string
  headingLevel?: 'h3' | 'h4'
  className?: string
}

/** Ítem de lista (<li>) para superficies oscuras: ícono decorativo, título y descripción. */
export function FeatureItem({ icon, title, description, headingLevel = 'h3', className }: FeatureItemProps) {
  return (
    <li className={cn('flex flex-col gap-2.5 border-t border-border-inverse pt-5', className)}>
      <Icon name={icon} size={28} className="text-accent-inverse" />
      <Heading as={headingLevel} size="feature" tone="inverse">
        {title}
      </Heading>
      <p className="m-0 font-sans text-body text-text-inverse-muted">{description}</p>
    </li>
  )
}
