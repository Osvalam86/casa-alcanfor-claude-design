import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from '@/components/atoms/Icon'

type ContactItemProps = {
  icon: IconName
  term: string
  children: ReactNode
  className?: string
}

/**
 * Par término → descripción ("Dirección" → la dirección). Va dentro de un <dl>;
 * el <div> agrupa el par y lleva el ícono decorativo.
 */
export function ContactItem({ icon, term, children, className }: ContactItemProps) {
  return (
    <div className={cn('flex gap-3.5', className)}>
      <Icon name={icon} size={22} className="mt-0.5 flex-none text-accent" />
      <div className="flex flex-col gap-1">
        <dt className="font-sans text-sm font-semibold text-text">{term}</dt>
        <dd className="m-0 flex flex-col gap-1 font-sans text-ui leading-loose text-text-muted">{children}</dd>
      </div>
    </div>
  )
}
