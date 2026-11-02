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
 * Par término → descripción ("Dirección" → la dirección). Va dentro de un <dl>; el <div> agrupa
 * el par y dt/dd son sus hijos directos (lo único válido dentro de un <div> de <dl>).
 * El ícono decorativo va posicionado dentro del <dt>, en la sangría del grupo.
 */
export function ContactItem({ icon, term, children, className }: ContactItemProps) {
  return (
    <div className={cn('relative flex flex-col gap-1 pl-9', className)}>
      <dt className="font-sans text-sm font-semibold text-text">
        <Icon name={icon} size={22} className="absolute top-0.5 left-0 text-accent" />
        {term}
      </dt>
      <dd className="m-0 flex flex-col gap-1 font-sans text-ui leading-loose text-text-muted">{children}</dd>
    </div>
  )
}
